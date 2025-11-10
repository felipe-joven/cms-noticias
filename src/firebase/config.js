import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyCK7YRIPOc1QkDDD1a6MLtgNOJ-A9Zwf_w",
  authDomain: "proyecto-final-f9858.firebaseapp.com",
  projectId: "proyecto-final-f9858",
  storageBucket: "proyecto-final-f9858.firebasestorage.app",
  messagingSenderId: "529102643631",
  appId: "1:529102643631:web:f511c387c72c387cd48f5a",
  measurementId: "G-GPKD2C7K0D"
};

const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);
export const auth = getAuth(app);
export const db = getFirestore(app);
export default app;