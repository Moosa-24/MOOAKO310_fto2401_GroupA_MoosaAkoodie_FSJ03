// app/auth/signIn/page.jsx

'use client';  

import { useState, useEffect } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import styles from '../signIn.module.css';

/**
 * SignIn component allows users to sign in using email and password.
 * 
 * It handles user authentication with Firebase, manages state for email, 
 * password, error messages, and loading status. It also listens for changes 
 * in authentication state and provides feedback to the user.
 *
 * @returns {JSX.Element} The rendered SignIn component.
 */
const SignIn = () => {
  const [email, setEmail] = useState(''); // State for storing email input
  const [password, setPassword] = useState(''); // State for storing password input
  const [errorMessage, setErrorMessage] = useState(''); // State for storing error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading status
  
  useEffect(() => {
    /**
     * Subscribes to authentication state changes.
     * Displays an alert if a user is already signed in.
     *
     * @function onAuthStateChanged
     * @param {User} user - The currently signed-in user.
     * @returns {Function} Cleanup function to unsubscribe from the listener.
     */
    const unsubscribe = auth.onAuthStateChanged(user => {
      if (user) {
        // Optionally, you can redirect the user or show a success message
        alert('User is already signed in');
      }
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  /**
   * Handles sign-in form submission.
   * Attempts to sign in the user with email and password.
   *
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   * @returns {Promise<void>} A promise that resolves when the sign-in process is complete.
   */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get the token
      
      // Set token in a HttpOnly cookie (this is just a placeholder; use an API for setting cookies)
      document.cookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;
      
      alert('User signed in successfully');
      // Redirect or perform any additional actions upon successful sign-in
    } catch (error) {
      console.error('Error signing in:', error);
      handleError(error.code); // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles errors during sign-in based on error codes.
   *
   * @param {string} errorCode - The error code from Firebase Authentication.
   */
  const handleError = (errorCode) => {
    switch (errorCode) {
      case 'auth/user-not-found':
        setErrorMessage('No user found with this email.');
        break;
      case 'auth/wrong-password':
        setErrorMessage('Incorrect password. Please try again.');
        break;
      case 'auth/invalid-email':
        setErrorMessage('Please enter a valid email address.');
        break;
      default:
        setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSignIn}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        className={styles.inputField}
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        className={styles.inputField}
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        required
      />
      
      {errorMessage && <p className={styles.error}>{errorMessage}</p>}
      
      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Signing In...' : 'Sign In'}
      </button>
    </form>
  );
};

export default SignIn;
