'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './products.module.css';

const fetchProducts = async (limit, skip) => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products?limit=${limit}&skip=${skip}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

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

    const skip = (page - 1) * 20;

    fetchProducts(20, skip)
      .then(data => setProducts(data))
      .catch(err => setError('Error loading products'))
      .finally(() => setLoading(false));
  }, [page]);

  const handleNextPage = () => {
    router.push(`/products?page=${page + 1}`);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      router.push(`/products?page=${page - 1}`);
    }
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
            <Link href={`/products/${product.id}`} key={product.id}>
              <div className={styles.productCard}>
                <img src={product.thumbnail} alt={product.title} className={styles.productImage} />
                <h2 className={styles.productTitle}>{product.title}</h2>
                <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
                <p className={styles.productCategory}>Category: {product.category}</p>
              </div>
            </Link>
          ))
        )}
      </section>

      <div className={styles.paginationControls}>
        {page > 1 && (
          <button onClick={handlePreviousPage} className={styles.prevPage}>
            Previous Page
          </button>
        )}
        {products.length > 0 && (
          <button onClick={handleNextPage} className={styles.nextPage}>
            Next Page
          </button>
        )}
      </div>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
        <a href="#">Privacy Policy</a>
      </footer>
    </div>
  );
}
