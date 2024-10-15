// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

const firebaseConfig = {
    apiKey: "AIzaSyC8-zUaUWgvEqQI_RxTLiGll7DPh1CSjro",
    authDomain: "next-ecommerce-45af9.firebaseapp.com",
    projectId: "next-ecommerce-45af9",
    storageBucket: "next-ecommerce-45af9.appspot.com",
    messagingSenderId: "499136242133",
    appId: "1:499136242133:web:c859859ee079a009e45d5c"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);
const auth = getAuth(app);

// Set persistence to local storage
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

export { db, auth };
