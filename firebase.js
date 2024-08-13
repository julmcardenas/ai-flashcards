// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries
import { getFirestore, collection, getDocs } from "firebase/firestore";
// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyAi5NGcBrzpFD5F409Z_cwBnkL00aKT77g",
  authDomain: "ai-flashcards-90877.firebaseapp.com",
  projectId: "ai-flashcards-90877",
  storageBucket: "ai-flashcards-90877.appspot.com",
  messagingSenderId: "1025259765321",
  appId: "1:1025259765321:web:80c9d3f2063c937cd84998"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const usersRef = collection(db, 'users');

export { app, db, usersRef };