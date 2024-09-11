'use client';

import Image from 'next/image';
import styles from './page.module.css';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetch('https://next-ecommerce-api.vercel.app/products?limit=20')
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

  const handleViewAll = () => {
    router.push('/products?page=1');
  };

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Welcome to Our E-Commerce Store</h1>
        <p>Your one-stop shop for amazing products!</p>
      </header>

      <section className={styles.featuredProducts}>
        <h2>Featured Products</h2>
        <p>Check out some of our top picks for you.</p>
        <div className={styles.productList}>
          {featuredProducts.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <Image
                src={product.thumbnail}
                alt={product.title}
                width={150}
                height={150}
                className={styles.productImage}
              />
              <h3>{product.title}</h3>
              <p>${product.price.toFixed(2)}</p>
              <a href={`/products/${product.id}`} className={styles.viewDetails}>
                View Details
              </a>
            </div>
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
