import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: "WAITING_FOR_DATA", 
  authDomain: "your-app.firebaseapp.com",
  projectId: "your-app",
  storageBucket: "your-app.appspot.com",
  messagingSenderId: "123456",
  appId: "1:123456:web:abc"
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);