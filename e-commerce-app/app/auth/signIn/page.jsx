'use client'; 

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase'; // Adjust the path as necessary
import styles from '../signIn.module.css';

/**
 * SignIn component for user authentication.
 * 
 * This component allows users to sign in using their email and password. 
 * It handles form submission, displays error messages, and manages loading states.
 *
 * @returns {JSX.Element} The rendered SignIn component.
 */
const SignIn = () => {
  const [email, setEmail] = useState(''); // User's email input
  const [password, setPassword] = useState(''); // User's password input
  const [errorMessage, setErrorMessage] = useState(''); // Error message state
  const [isLoading, setIsLoading] = useState(false); // Loading state during sign-in

  /**
   * Handles the sign-in form submission.
   * 
   * @param {React.FormEvent<HTMLFormElement>} e - The form event.
   * @returns {Promise<void>} 
   */
  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message

    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('User signed in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      handleError(error.code); // Handle error
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Handles authentication errors and sets appropriate error messages.
   *
   * @param {string} errorCode - The error code returned by Firebase.
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
