// utils/firebaseAdmin.js

import admin from 'firebase-admin';
import serviceAccount from '../../config/serviceAccountKey.json'; // Ensure this path is correct

// Initialize the Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Use the service account JSON
  });
}

// Export Firestore database instance
export const db = admin.firestore();

// Function to verify ID tokens
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
