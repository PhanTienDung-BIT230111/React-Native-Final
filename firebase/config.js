// firebase/config.js
import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";


const firebaseConfig = {
  apiKey: "AIzaSyDeAwOELBGGmEI8rHGIjhDLEYd5rSs1PwQ",
  authDomain: "companyprojectmanager.firebaseapp.com",
  projectId: "companyprojectmanager",
  storageBucket: "companyprojectmanager.firebasestorage.app",
  messagingSenderId: "454620976725",
  appId: "1:454620976725:web:0802fc812fe51b83d7a6dc",
  measurementId: "G-6F3L2FS2ED"
};

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

export { db, auth };
