// Import the functions you need
import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyBDL-E_GCH7eRGfF_MdQ3cSuQA5wgPt8Ds",
  authDomain: "campus-market-d381e.firebaseapp.com",
  projectId: "campus-market-d381e",
  storageBucket: "campus-market-d381e.appspot.com",
  messagingSenderId: "967405445457",
  appId: "1:967405445457:web:5d2d7321ae6a6c26a53370",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Services
export const auth = getAuth(app);
export const db = getFirestore(app);
