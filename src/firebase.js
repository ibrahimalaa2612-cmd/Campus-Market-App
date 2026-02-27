
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";
/*
const firebaseConfig = {
  apiKey: "API_KEY_HERE",
  authDomain: "PROJECT.firebaseapp.com",
  projectId: "PROJECT_ID",
  storageBucket: "PROJECT.appspot.com",
  messagingSenderId: "SENDER_ID",
  appId: "APP_ID"
};*/
const firebaseConfig = {
  apiKey: "AIzaSyBDL-E_GCH7eRGfF_MdQ3cSuQA5wgPt8Ds",
  authDomain: "campus-market-d381e.firebaseapp.com",
  projectId: "campus-market-d381e",
  storageBucket: "campus-market-d381e.appspot.com",
  messagingSenderId: "967405445457",
  appId: "1:967405445457:web:5d2d7321ae6a6c26a53370",
  measurementId: "G-WZBTMQ4Z70"
};


const app = getApps().length > 0 ? getApp() : initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

