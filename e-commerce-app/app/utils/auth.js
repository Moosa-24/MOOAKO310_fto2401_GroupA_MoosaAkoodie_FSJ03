// utils/auth.js
import { auth } from './firebase'; // Ensure this imports your Firebase auth instance
import { getIdToken } from 'firebase/auth';

/**
 * Retrieves the ID token of the currently authenticated user.
 * 
 * @async
 * @function getAuthToken
 * @returns {Promise<string>} A promise that resolves to the ID token of the authenticated user.
 * @throws {Error} Throws an error if the user is not authenticated.
 */
export const getAuthToken = async () => {
  const user = auth.currentUser; // Get the currently signed-in user
  if (user) {
    const token = await user.getIdToken(); // Get the ID token
    return token;
  }
  throw new Error('User not authenticated'); // Handle case when user is not authenticated
};
