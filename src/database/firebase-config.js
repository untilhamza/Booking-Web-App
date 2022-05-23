import { initializeApp } from "firebase/app";
import { getFirestore } from "@firebase/firestore";

const firebaseConfig = {
  apiKey: process.env.REACT_APP_API_KEY,
  authDomain: "appointments-9fa9d.firebaseapp.com",
  projectId: "appointments-9fa9d",
  storageBucket: "appointments-9fa9d.appspot.com",
  messagingSenderId: "514032231488",
  appId: "1:514032231488:web:a841adecd9dffad5aaaba5",
  measurementId: "G-N2D42P9687",
};

// Initialize Firebase
initializeApp(firebaseConfig);

//all your store data is in the db object
const db = getFirestore();

export default db;
