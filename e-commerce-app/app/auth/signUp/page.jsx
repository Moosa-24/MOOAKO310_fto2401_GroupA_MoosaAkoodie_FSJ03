// app/auth/signUp/page.jsx

'use client'; 

import { useState, useEffect } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import styles from '../signUp.module.css';

/**
 * SignUp component for user registration.
 *
 * This component allows users to sign up using their email and password.
 * It handles user state changes, displays error messages, and manages loading states.
 *
 * @returns {JSX.Element} The rendered SignUp form.
 */
const SignUp = () => {
  const [email, setEmail] = useState(''); // State for user email input
  const [password, setPassword] = useState(''); // State for user password input
  const [errorMessage, setErrorMessage] = useState(''); // State for displaying error messages
  const [isLoading, setIsLoading] = useState(false); // State for loading indicator

  useEffect(() => {
    /**
     * Effect to handle user authentication state.
     * Listens for authentication state changes and alerts if the user is already signed in.
     * 
     * @returns {function} A cleanup function to unsubscribe from the listener.
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
   * Handles user sign-up when the form is submitted.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form submission event.
   * @returns {Promise<void>} A promise that resolves when the sign-up process is complete.
   */
  const handleSignUp = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const token = await userCredential.user.getIdToken(); // Get the token
      
      // Set token in a HttpOnly cookie (this is just a placeholder; use an API for setting cookies)
      document.cookie = `token=${token}; HttpOnly; Secure; SameSite=Strict`;
      
      alert('User created successfully');
      // Redirect or perform any additional actions upon successful sign-up
    } catch (error) {
      console.error('Error signing up:', error);
      handleError(error.code); // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles errors during the sign-up process and updates the error message state.
   * 
   * @param {string} errorCode - The error code returned by Firebase.
   */
  const handleError = (errorCode) => {
    switch (errorCode) {
      case 'auth/email-already-in-use':
        setErrorMessage('This email is already in use. Please use a different email.');
        break;
      case 'auth/invalid-email':
        setErrorMessage('Please enter a valid email address.');
        break;
      case 'auth/weak-password':
        setErrorMessage('Password should be at least 6 characters.');
        break;
      default:
        setErrorMessage('An error occurred. Please try again later.');
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSignUp}>
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
        {isLoading ? 'Signing Up...' : 'Sign Up'}
      </button>
    </form>
  );
};

export default SignUp;
