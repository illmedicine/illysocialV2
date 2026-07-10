// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyCRstsuTftQXtJ2VIxnhYroPkRBr5wHoKY",
  authDomain: "isocial-e5297.firebaseapp.com",
  projectId: "isocial-e5297",
  storageBucket: "isocial-e5297.firebasestorage.app",
  messagingSenderId: "391798877995",
  appId: "1:391798877995:web:b0d682c0a84954d4801f6e",
  measurementId: "G-T9TWBRF35K"
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
