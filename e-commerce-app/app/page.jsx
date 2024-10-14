'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; 
import Head from 'next/head'; 

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetching from the new Firestore API route
    fetch('/api/products') // Change this line to point to your API route
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
  }, []);

  if (loading) return <p>Loading featured products...</p>;
  if (error) return <p>{error}</p>;

  const handleViewAll = () => {
    router.push('/products?page=1');
  };

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
      </header>

      <section className={styles.featuredProducts}>
        <h2>Featured Products</h2>
        <p>Check out some of our top picks for you.</p>
        <div className={styles.productList}>
          {featuredProducts.map((product) => (
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className={styles.productCard}>
                <Image
                  src={product.thumbnail} // Ensure this field exists in your Firestore data
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
        <button onClick={handleViewAll} className={styles.viewAll}>
          View All Products
        </button>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
