import admin from 'firebase-admin';
import serviceAccount from '../../config/serviceAccountKey.json'; // Correct relative path

// Initialize the Firebase Admin SDK
if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert(serviceAccount), // Use the service account JSON
  });
}

// Export Firestore database instance
export const db = admin.firestore();
