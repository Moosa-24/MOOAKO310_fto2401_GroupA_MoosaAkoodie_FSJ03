// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth } from "firebase/auth";

/**
 * Firebase configuration object containing the API keys and identifiers.
 * @type {Object}
 * @property {string} apiKey - The API key for Firebase.
 * @property {string} authDomain - The authentication domain for Firebase.
 * @property {string} projectId - The unique identifier for the Firebase project.
 * @property {string} storageBucket - The Google Cloud Storage bucket for Firebase.
 * @property {string} messagingSenderId - The sender ID for Firebase Cloud Messaging.
 * @property {string} appId - The unique app identifier for Firebase.
 */
const firebaseConfig = {
    apiKey: "AIzaSyC8-zUaUWgvEqQI_RxTLiGll7DPh1CSjro",
    authDomain: "next-ecommerce-45af9.firebaseapp.com",
    projectId: "next-ecommerce-45af9",
    storageBucket: "next-ecommerce-45af9.appspot.com",
    messagingSenderId: "499136242133",
    appId: "1:499136242133:web:c859859ee079a009e45d5c"
};

// Initialize Firebase
/**
 * Initializes the Firebase app using the provided configuration.
 * @type {FirebaseApp}
 */
const app = initializeApp(firebaseConfig);

/**
 * Firestore database reference.
 * @type {Firestore}
 */
const db = getFirestore(app);

/**
 * Firebase authentication reference.
 * @type {Auth}
 */
const auth = getAuth(app);

export { db, auth };
