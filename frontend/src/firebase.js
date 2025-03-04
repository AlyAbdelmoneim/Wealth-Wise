import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyAIjTWGiW8aCjJZVQEToRwmCD7fmSe-_E4",
    authDomain: "ai-hackathon-10b0f.firebaseapp.com",
    projectId: "ai-hackathon-10b0f",
    storageBucket: "ai-hackathon-10b0f.firebasestorage.app",
    messagingSenderId: "83741863920",
    appId: "1:83741863920:web:7d85fc6f550df32bd1b735",
    measurementId: "G-X0M4H4JBBB"
  };

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firebase services
const auth = getAuth(app);
const db = getFirestore(app);
const provider = new GoogleAuthProvider();

export { auth, db, provider };
