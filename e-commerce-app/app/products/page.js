'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import styles from './products.module.css';

function fetchProducts(limit, skip) {
  return fetch(`https://next-ecommerce-api.vercel.app/products?limit=${limit}&skip=${skip}`)
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      return response.json();
    });
}

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProducts(20, (page - 1) * 20)
      .then(data => setProducts(data))
      .catch(err => setError('Error loading products'))
      .finally(() => setLoading(false));
  }, [page]);

  const handleNextPage = () => {
    router.push(`/products?page=${page + 1}`);
  };

  if (loading && products.length === 0) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
      <header className={styles.header}>
        <h1>Products</h1>
        <button onClick={() => router.push('/')} className={styles.homeButton}>
          Back to Home
        </button>
      </header>

      <section className={styles.productsGrid}>
        {products.length === 0 && !loading ? (
          <p>No products available.</p>
        ) : (
          products.map((product) => (
            <div key={product.id} className={styles.productCard}>
              <img src={product.thumbnail} alt={product.title} />
              <h2>{product.title}</h2>
              <p>${product.price}</p>
            </div>
          ))
        )}
      </section>

      {products.length > 0 && (
        <button onClick={handleNextPage} className={styles.nextPage}>
          Next Page
        </button>
      )}
    </div>
  );
}
