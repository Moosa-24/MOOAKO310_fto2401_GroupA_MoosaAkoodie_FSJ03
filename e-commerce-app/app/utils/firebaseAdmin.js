import admin from 'firebase-admin';
import serviceAccount from '../../config/serviceAccountKey.json';

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
    const decodedToken = await admin.auth().verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error('Error verifying ID token:', error);
    throw new Error('Unauthorized');
  }
};
