// utils/firebaseAdmin.js

import admin from 'firebase-admin';
import serviceAccount from '../config/serviceAccountKey.json'; // Ensure this path is correct

/**
 * Initializes the Firebase Admin SDK if it hasn't been initialized yet.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Use the service account JSON
  });
}

/**
 * Firestore database instance.
 * @type {FirebaseFirestore.Firestore}
 */
export const db = admin.firestore();

/**
 * Verifies the given ID token and decodes it.
 * @param {string} token - The ID token to verify.
 * @returns {Promise<FirebaseAuth.DecodedIdToken>} The decoded ID token if verification is successful.
 * @throws {Error} Throws an error if the ID token verification fails.
 */
export const verifyIdToken = async (token) => {
  try {
    // Verify the ID token and decode it
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error); // Log the error for debugging
    throw new Error('Unauthorized'); // You may want to throw a specific error message if needed
  }
};
