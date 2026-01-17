// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

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
export const googleProvider = new GoogleAuthProvider();