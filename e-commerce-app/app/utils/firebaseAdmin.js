import admin from 'firebase-admin';
import serviceAccount from '../../config/serviceAccountKey.json';

/**
 * Initializes the Firebase Admin SDK if it hasn't been initialized already.
 */
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Use the service account JSON
  });
}

/**
 * Firestore database instance.
 * @type {Firestore}
 */
export const db = admin.firestore();

/**
 * Verifies the provided ID token.
 *
 * @param {string} token - The ID token to verify.
 * @returns {Promise<Object>} - A promise that resolves with the decoded token if verification is successful.
 * @throws {Error} - Throws an error if the verification fails.
 */
export const verifyIdToken = async (token) => {
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Unauthorized');
  }
};
