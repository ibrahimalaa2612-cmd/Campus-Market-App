import { initializeApp, getApps, getApp } from "firebase/app";
import { initializeAuth, getReactNativePersistence, getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore"; // ضيف السطر ده
import { getStorage } from "firebase/storage";     // ضيف السطر ده
import ReactNativeAsyncStorage from '@react-native-async-storage/async-storage';

const firebaseConfig = {
  apiKey: "AIzaSyBDL-E_GCH7eRGfF_MdQ3cSuQA5wgPt8Ds",
  authDomain: "campus-market-d381e.firebaseapp.com",
  projectId: "campus-market-d381e",
  storageBucket: "campus-market-d381e.appspot.com",
  messagingSenderId: "967405445457",
  appId: "1:967405445457:web:5d2d7321ae6a6c26a53370",
};

let app;
if (!getApps().length) {
  app = initializeApp(firebaseConfig);
} else {
  app = getApp();
}

const auth = initializeAuth(app, {
  persistence: getReactNativePersistence(ReactNativeAsyncStorage),
});

const db = getFirestore(app);    
const storage = getStorage(app);   

export { auth, db, storage };     