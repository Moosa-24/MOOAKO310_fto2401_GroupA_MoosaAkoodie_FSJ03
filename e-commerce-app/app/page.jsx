'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link'; // Import Link for client-side navigation
import Head from 'next/head'; // Import Head for SEO meta tags

/**
 * HomePage component displays a welcome message, featured products, and a link to view all products.
 * 
 * This component fetches a list of featured products from the local API route and displays them in a grid.
 * It includes a button to navigate to the Products page to view all products.
 * It handles loading and error states while fetching the featured products.
 * 
 * @returns {JSX.Element} The rendered component.
 */
export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);

    // Fetching from the local API route
    fetch('/api/products')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to fetch products');
        }
        return response.json();
      })
      .then(data => setFeaturedProducts(data))
      .catch(err => setError('Error fetching featured products'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return <p>Loading featured products...</p>;
  if (error) return <p>{error}</p>;

  /**
   * Handles navigation to the Products page.
   * 
   * Navigates to the Products page with the query parameter to show the first page of products.
   */
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
        <button onClick={handleViewAll} className={styles.viewAll}>
          View All Products
        </button>
        <div>
            <h1>Welcome to My Product App</h1>
            <a href="/upload">Upload Product</a>
        </div>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
