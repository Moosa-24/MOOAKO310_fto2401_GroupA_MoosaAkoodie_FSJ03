'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import styles from './products.module.css';

const fetchProducts = async (limit, skip, searchQuery, category) => {
  const query = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
  const categoryFilter = category ? `&category=${encodeURIComponent(category)}` : '';
  const response = await fetch(`/api/products?limit=${limit}&skip=${skip}${query}${categoryFilter}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchQuery);
  const [category, setCategory] = useState(categoryQuery);

  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data))
      .catch(err => setError('Error loading categories'));
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);

    const skip = (page - 1) * 20;

    fetchProducts(20, skip, searchQuery, category)
      .then(data => setProducts(data))
      .catch(err => setError('Error loading products'))
      .finally(() => setLoading(false));
  }, [page, searchQuery, category]);

  const handleNextPage = () => {
    router.push(`/products?page=${page + 1}&search=${search}&category=${category}`);
  };

  const handlePreviousPage = () => {
    if (page > 1) {
      router.push(`/products?page=${page - 1}&search=${search}&category=${category}`);
    }
  };

  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/products?page=1&search=${search}&category=${category}`);
  };

  const handleCategoryChange = (e) => {
    setCategory(e.target.value);
    router.push(`/products?page=1&search=${search}&category=${e.target.value}`);
  };

  const handleReset = () => {
    setSearch('');
    setCategory('');
    router.push(`/products`);
  };

  if (loading && products.length === 0) return <p>Loading products...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div className={styles.page}>
      <Head>
        <title>{search ? `${search} Products` : 'Products'} | E-Commerce Store</title>
        <meta name="description" content={`Browse ${search ? `${search} products` : 'our collection of products'} in various categories.`} />
        <meta name="robots" content="index, follow" />
        <meta name="keywords" content={search ? `${search}, products, e-commerce` : 'products, e-commerce'} />
      </Head>

      <header className={styles.header}>
        <h1>Products</h1>
        <button onClick={() => router.push('/')} className={styles.homeButton}>
          Back to Home
        </button>

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

        <div className={styles.categoryFilter}>
          <label htmlFor="category">Filter by Category: </label>
          <select id="category" value={category} onChange={handleCategoryChange} className={styles.categorySelect}>
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option value={cat} key={cat}>{cat}</option>
            ))}
          </select>
        </div>

        <button onClick={handleReset} className={styles.resetButton}>
          Reset Filters
        </button>
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
