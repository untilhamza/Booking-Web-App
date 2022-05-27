import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";
import { getAuth } from "firebase/auth";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: process.env.REACT_APP_AUTH_DOMAIN,
  projectId: "appointments-9fa9d",
  storageBucket: "appointments-9fa9d.appspot.com",
  messagingSenderId: "514032231488",
  appId: "1:514032231488:web:a841adecd9dffad5aaaba5",
  measurementId: "G-N2D42P9687",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

//get authetication service from the app and use it else where
export const auth = getAuth(app);

export const db = getFirestore(app);
