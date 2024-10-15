// app/auth/signUp/page.jsx

'use client'; 

import { useState } from 'react';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase';
import styles from '../signUp.module.css';

const SignUp = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

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
    } catch (error) {
      console.error('Error signing up:', error);
      handleError(error.code); // Handle error
    } finally {
      setIsLoading(false);
    }
  };

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
