'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import styles from './products.module.css';

/**
 * Fetches a list of products with pagination or search query.
 * 
 * @param {number} limit - The number of products to fetch.
 * @param {number} skip - The number of products to skip for pagination.
 * @param {string} searchQuery - The search query to filter products by title.
 * @returns {Promise<Array>} A promise that resolves to an array of products.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
const fetchProducts = async (limit, skip, searchQuery) => {
  const query = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products?limit=${limit}&skip=${skip}${query}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchQuery);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const skip = (page - 1) * 20;

    fetchProducts(20, skip, searchQuery)
      .then(data => setProducts(data))
      .catch(err => setError('Error loading products'))
      .finally(() => setLoading(false));
  }, [page, searchQuery]);

  const handleNextPage = () => {
    router.push(`/products?page=${page + 1}&search=${search}`);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      router.push(`/products?page=${page - 1}&search=${search}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/products?page=1&search=${search}`);
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

        {/* Search bar */}
        <form onSubmit={handleSearchSubmit} className={styles.searchForm}>
          <input
            type="text"
            placeholder="Search products by title..."
            value={search}
            onChange={handleSearchChange}
            className={styles.searchInput}
          />
          <button type="submit" className={styles.searchButton}>Search</button>
        </form>
      </header>

      <section className={styles.productsGrid}>
        {products.length === 0 && !loading ? (
          <p>No products found.</p>
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
