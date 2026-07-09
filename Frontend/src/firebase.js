// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC9LF6WOnmpbIctA5kH0_rl2lj2i2NoQg0",
  authDomain: "illysocial.firebaseapp.com",
  projectId: "illysocial",
  storageBucket: "illysocial.appspot.com",
  messagingSenderId: "356649909111",
  appId: "1:356649909111:web:73477014e0df82c5f4bf72",
  measurementId: "G-QYSQ53BZ5J"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase Authentication and export it
export const auth = getAuth(app);

// Cloud Firestore — stores each user's profile + IllySocial settings, keyed by
// their Google account UID so it follows them across devices worldwide.
export const db = getFirestore(app);

// Google is the only supported sign-in method. Always prompt for account choice
// so users on shared devices can pick the right Google account.
export const googleProvider = new GoogleAuthProvider();
googleProvider.setCustomParameters({ prompt: "select_account" });
