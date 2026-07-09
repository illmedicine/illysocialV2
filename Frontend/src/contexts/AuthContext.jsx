import { createContext, useContext, useEffect, useState } from 'react';
import { signInWithPopup, signOut, onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, setDoc, serverTimestamp } from 'firebase/firestore';
import { auth, googleProvider, db } from '../firebase';

const AuthContext = createContext();

export const useAuth = () => {
  return useContext(AuthContext);
};

// Default IllySocial settings applied the first time a user signs in. These are
// tied to the user's Google account and can be edited from the Creators Dashboard.
const DEFAULT_SETTINGS = {
  displayHandle: '',
  bio: '',
  primaryPlatform: 'instagram',
  emailNotifications: true,
  publicProfile: true,
};

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  // Google is the only sign-in method. On success we upsert a Firestore user
  // document so the profile + settings persist against the Google account.
  const signInWithGoogle = async () => {
    const result = await signInWithPopup(auth, googleProvider);
    await ensureUserDocument(result.user);
    return result;
  };

  const signout = () => {
    setUserProfile(null);
    return signOut(auth);
  };

  // Create the user document on first login, or refresh the Google profile
  // fields on returning logins. Existing settings are preserved via merge.
  const ensureUserDocument = async (user) => {
    const ref = doc(db, 'users', user.uid);
    const snap = await getDoc(ref);

    if (!snap.exists()) {
      const profile = {
        uid: user.uid,
        email: user.email,
        displayName: user.displayName || '',
        photoURL: user.photoURL || '',
        provider: 'google',
        settings: { ...DEFAULT_SETTINGS, displayHandle: user.displayName || '' },
        createdAt: serverTimestamp(),
        lastLoginAt: serverTimestamp(),
      };
      await setDoc(ref, profile);
      setUserProfile(profile);
      return profile;
    }

    // Returning user: refresh Google-sourced fields + login timestamp.
    const updates = {
      email: user.email,
      displayName: user.displayName || '',
      photoURL: user.photoURL || '',
      lastLoginAt: serverTimestamp(),
    };
    await setDoc(ref, updates, { merge: true });
    const merged = { ...snap.data(), ...updates };
    setUserProfile(merged);
    return merged;
  };

  // Persist edits to the user's IllySocial settings from the dashboard.
  const updateSettings = async (newSettings) => {
    if (!currentUser) return;
    const ref = doc(db, 'users', currentUser.uid);
    const settings = { ...(userProfile?.settings || DEFAULT_SETTINGS), ...newSettings };
    await setDoc(ref, { settings }, { merge: true });
    setUserProfile((prev) => ({ ...(prev || {}), settings }));
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);
      if (user) {
        try {
          await ensureUserDocument(user);
        } catch (err) {
          console.error('Failed to load user profile:', err);
        }
      } else {
        setUserProfile(null);
      }
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const value = {
    currentUser,
    userProfile,
    signInWithGoogle,
    updateSettings,
    signout,
  };

  return (
    <AuthContext.Provider value={value}>
      {!loading && children}
    </AuthContext.Provider>
  );
};
