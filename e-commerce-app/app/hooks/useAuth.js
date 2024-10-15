import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../utils/firebase';

/**
 * A custom hook that manages authentication state using Firebase.
 *
 * This hook listens for authentication state changes and provides the current
 * user object and loading status. It returns an object containing the user and
 * a loading flag that indicates whether the authentication status is still being
 * determined.
 *
 * @returns {Object} An object containing:
 *   @property {Object|null} user - The current user object, or null if not authenticated.
 *   @property {boolean} loading - A flag indicating if the authentication state is loading.
 */
const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  return { user, loading };
};

export default useAuth;
