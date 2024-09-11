'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from './productDetails.module.css'; // Create this file for styling

const fetchProductDetails = async (id) => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
};

export default function ProductDetailsPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const router = useRouter();

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProductDetails(id)
      .then(data => setProduct(data))
      .catch(err => setError('Error fetching product details'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;

  if (!product) return <p>No product found.</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <button onClick={() => router.back()} className={styles.backButton}>
          Back
        </button>
      </header>

      <section className={styles.productDetails}>
        <Image
          src={product.thumbnail}
          alt={product.title}
          width={500}
          height={500}
          className={styles.productImage}
        />
        <h1 className={styles.productTitle}>{product.title}</h1>
        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
        <p className={styles.productDescription}>{product.description}</p>
      </section>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
