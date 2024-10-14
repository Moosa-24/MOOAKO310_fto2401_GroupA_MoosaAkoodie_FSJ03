// app/dashboard/page.jsx

import { auth } from '../../firebase';
import { useEffect, useState } from 'react';
import { onAuthStateChanged } from 'firebase/auth';
import { useRouter } from 'next/navigation';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const router = useRouter();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
      } else {
        router.push('/auth/signin'); // Redirect to sign-in if not authenticated
      }
    });
    return () => unsubscribe();
  }, [router]);

  if (!user) {
    return <p>Loading...</p>; // Show loading state while checking auth status
  }

  return <h1>Welcome to your Dashboard, {user.email}</h1>;
};

export default Dashboard;
