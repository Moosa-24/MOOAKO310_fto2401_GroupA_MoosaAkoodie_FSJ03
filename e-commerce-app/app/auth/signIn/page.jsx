'use client'; 

import { useState } from 'react';
import { signInWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../utils/firebase'; // Adjust the path as necessary
import styles from '../signIn.module.css';

const SignIn = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleSignIn = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(''); // Reset error message
    try {
      await signInWithEmailAndPassword(auth, email, password);
      alert('User signed in successfully');
    } catch (error) {
      console.error('Error signing in:', error);
      setErrorMessage(error.message); // Set error message
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form className={styles.form} onSubmit={handleSignIn}>
      <label htmlFor="email">Email:</label>
      <input
        type="email"
        id="email"
        className={styles.inputField} // Apply the new class
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        required
      />
      
      <label htmlFor="password">Password:</label>
      <input
        type="password"
        id="password"
        className={styles.inputField} // Apply the new class
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
