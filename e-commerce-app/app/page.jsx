// app/page.jsx

'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import Head from 'next/head'; 
import { auth } from './utils/firebase'; // Import auth
import { onAuthStateChanged, signOut } from 'firebase/auth'; // Import required functions

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [user, setUser] = useState(null); // Track user authentication state
  const router = useRouter();

  useEffect(() => {
    // Check authentication state
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setUser(user); // Set user if authenticated
    });

    setLoading(true);
    setError(null);

    // Fetch featured products
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => {
        // Limit to 5 products for featured products
        setFeaturedProducts(data.slice(0, 5));
      })
      .catch(err => setError('Error fetching featured products'))
      .finally(() => setLoading(false));

    return () => unsubscribe(); // Clean up the subscription on unmount
  }, []);

  // Call the secure API
  const callSecureApi = async () => {
    const user = auth.currentUser;

    if (user) {
      try {
        const idToken = await user.getIdToken();
        const response = await fetch('/api/secureRoute', {
          method: 'GET',
          headers: {
            Authorization: `Bearer ${idToken}`,
          },
        });

        if (!response.ok) {
          throw new Error('Failed to call secure API');
        }

        const data = await response.json();
        console.log(data);
      } catch (error) {
        console.error('Error calling secure API:', error);
      }
    } else {
      console.log('User not authenticated');
    }
  };

  const handleSignOut = async () => {
    try {
      await signOut(auth); // Sign out the user
      alert('You have been signed out.'); // Notify user
      router.push('/'); // Redirect to home page
    } catch (error) {
      console.error('Error signing out:', error);
      alert(error.message); // Show error message
    }
  };

  // Handle loading and error states
  if (loading) return <p>Loading featured products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
      <Head>
        <title>Home - Your E-Commerce Store</title>
        <meta name="description" content="Welcome to our e-commerce store. Discover amazing products tailored just for you." />
        <meta property="og:title" content="Home - Your E-Commerce Store" />
        <meta property="og:description" content="Explore our featured products and shop the latest trends." />
        <meta property="og:image" content="/images/home-og-image.jpg" />
      </Head>

      <header className={styles.header}>
        <h1>Welcome to Our E-Commerce Store</h1>
        <p>Your one-stop shop for amazing products!</p>
        <div className={styles.authSection}>
          {user ? (
            <>
              <p>Welcome, {user.email}</p>
              <button onClick={callSecureApi} className={styles.apiCallButton}>
                Call Secure API
              </button>
              <button onClick={handleSignOut} className={styles.signOutButton}>
                Sign Out
              </button>
            </>
          ) : (
            <>
              <Link href="/auth/signIn" className={styles.authLink}>
                Sign In
              </Link>
              <Link href="/auth/signUp" className={styles.authLink}>
                Sign Up
              </Link>
            </>
          )}
        </div>
      </header>

      <section className={styles.featuredProducts}>
        <h2>Featured Products</h2>
        <p>Check out some of our top picks for you.</p>
        <div className={styles.productList}>
          {featuredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className={styles.productCard}>
                <Image
                  src={product.thumbnail}
                  alt={product.title}
                  width={150}
                  height={150}
                  className={styles.productImage}
                />
                <h3 className={styles.productTitle}>{product.title}</h3>
                <p className={styles.productCategory}>Category: {product.category}</p>
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
              </div>
            </Link>
          ))}
        </div>
        <button onClick={() => router.push('/products?page=1')} className={styles.viewAll}>
          View All Products
        </button>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
