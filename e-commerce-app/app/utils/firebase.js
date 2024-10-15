// firebase.js

import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";
import { getAuth, setPersistence, browserLocalPersistence } from 'firebase/auth';

/**
 * Firebase configuration object containing the necessary keys and identifiers.
 * @type {Object}
 * @property {string} apiKey - The API key for the Firebase project.
 * @property {string} authDomain - The authentication domain for the Firebase project.
 * @property {string} projectId - The unique identifier for the Firebase project.
 * @property {string} storageBucket - The storage bucket URL for the Firebase project.
 * @property {string} messagingSenderId - The sender ID for messaging services.
 * @property {string} appId - The unique application identifier.
 */
const firebaseConfig = {
    apiKey: "AIzaSyC8-zUaUWgvEqQI_RxTLiGll7DPh1CSjro",
    authDomain: "next-ecommerce-45af9.firebaseapp.com",
    projectId: "next-ecommerce-45af9",
    storageBucket: "next-ecommerce-45af9.appspot.com",
    messagingSenderId: "499136242133",
    appId: "1:499136242133:web:c859859ee079a009e45d5c"
};

/**
 * Initializes Firebase with the provided configuration.
 * @type {Object} app - The initialized Firebase app instance.
 */
const app = initializeApp(firebaseConfig);

/**
 * Gets the Firestore database instance for the initialized Firebase app.
 * @type {Object} db - The Firestore database instance.
 */
const db = getFirestore(app);

/**
 * Gets the authentication instance for the initialized Firebase app.
 * @type {Object} auth - The authentication instance.
 */
const auth = getAuth(app);

/**
 * Sets the authentication persistence to local storage.
 * This allows the user to remain logged in even after closing the browser.
 */
setPersistence(auth, browserLocalPersistence)
  .then(() => {
    console.log('Persistence set to local');
  })
  .catch((error) => {
    console.error('Error setting persistence:', error);
  });

// Exporting the database and authentication instances for use in other modules.
export { db, auth };
