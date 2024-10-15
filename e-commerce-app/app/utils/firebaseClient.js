// utils/firebaseClient.js
import { initializeApp, getApps } from 'firebase/app';
import { getAuth } from 'firebase/auth';

/**
 * Firebase configuration object containing the necessary credentials
 * for initializing the Firebase app.
 * @constant {Object} firebaseConfig
 * @property {string} apiKey - The API key for Firebase project.
 * @property {string} authDomain - The authentication domain for Firebase project.
 * @property {string} projectId - The unique identifier for Firebase project.
 * @property {string} storageBucket - The storage bucket URL for Firebase project.
 * @property {string} messagingSenderId - The sender ID for Firebase messaging.
 * @property {string} appId - The unique app identifier for Firebase project.
 */
const firebaseConfig = {
    apiKey: "AIzaSyC8-zUaUWgvEqQI_RxTLiGll7DPh1CSjro",
    authDomain: "next-ecommerce-45af9.firebaseapp.com",
    projectId: "next-ecommerce-45af9",
    storageBucket: "next-ecommerce-45af9.appspot.com",
    messagingSenderId: "499136242133",
    appId: "1:499136242133:web:c859859ee079a009e45d5c",
};

/**
 * Initializes Firebase application if it has not been initialized yet.
 * This prevents multiple instances of the app from being created.
 */
if (!getApps().length) {
    initializeApp(firebaseConfig);
}

/**
 * Firebase authentication instance used for user authentication.
 * @constant {firebase.auth.Auth} auth
 */
export const auth = getAuth();
