// utils/auth.js
import { auth } from './firebase'; // Ensure this imports your Firebase auth instance
import { getIdToken } from 'firebase/auth';

export const getAuthToken = async () => {
  const user = auth.currentUser; // Get the currently signed-in user
  if (user) {
    const token = await user.getIdToken(); // Get the ID token
    return token;
  }
  throw new Error('User not authenticated'); // Handle case when user is not authenticated
};
