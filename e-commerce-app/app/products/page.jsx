'use client'; 

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Link from 'next/link';
import Head from 'next/head';
import styles from './products.module.css';

/**
 * Fetches products from the API with optional filters and sorting.
 * 
 * @param {number} limit - The maximum number of products to fetch.
 * @param {number} page - The page number for pagination.
 * @param {string} searchQuery - The search query to filter products.
 * @param {string} category - The category to filter products.
 * @param {string} sort - The sorting order (e.g., "asc" or "desc").
 * @returns {Promise<Object[]>} - A promise that resolves to the list of products.
 * @throws {Error} - Throws an error if the fetch fails.
 */
const fetchProducts = async (limit, page, searchQuery, category, sort) => {
  const query = searchQuery ? `&search=${encodeURIComponent(searchQuery)}` : '';
  const categoryFilter = category ? `&category=${encodeURIComponent(category)}` : '';
  const sortOrder = sort ? `&sort=${encodeURIComponent(sort)}` : '';
  const response = await fetch(`/api/products?limit=${limit}&page=${page}${query}${categoryFilter}${sortOrder}`);
  if (!response.ok) {
    throw new Error('Failed to fetch products');
  }
  return response.json();
};

/**
 * Fetches the list of product categories from the API.
 * 
 * @returns {Promise<Object[]>} - A promise that resolves to the list of categories.
 * @throws {Error} - Throws an error if the fetch fails.
 */
const fetchCategories = async () => {
  const response = await fetch('/api/categories');
  if (!response.ok) {
    throw new Error('Failed to fetch categories');
  }
  return response.json();
};

/**
 * ProductsPage component that displays a list of products with filtering, sorting, and pagination options.
 * 
 * @returns {JSX.Element} - The rendered ProductsPage component.
 */
export default function ProductsPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const page = parseInt(searchParams.get('page') || '1', 10);
  const searchQuery = searchParams.get('search') || '';
  const categoryQuery = searchParams.get('category') || '';
  const sortQuery = searchParams.get('sort') || 'asc'; // Get the sort parameter from the URL
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [search, setSearch] = useState(searchQuery);
  const [category, setCategory] = useState(categoryQuery);
  const [sort, setSort] = useState(sortQuery); // New state for sorting

  // Fetch categories on component mount
  useEffect(() => {
    fetchCategories()
      .then(data => setCategories(data[0].categories)) // Adjust based on the API response
      .catch(err => setError('Error loading categories'));
  }, []);

  // Fetch products whenever the page, searchQuery, category, or sort changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProducts(20, page, searchQuery, category, sort) // Include sort in the fetch
      .then(data => setProducts(data))
      .catch(err => setError('Error loading products'))
      .finally(() => setLoading(false));
  }, [page, searchQuery, category, sort]); // Ensure sort is included in the dependencies

  /**
   * Handles the navigation to the next page of products.
   */
  const handleNextPage = () => {
    router.push(`/products?page=${page + 1}&search=${search}&category=${category}&sort=${sort}`);
  };

  /**
   * Handles the navigation to the previous page of products.
   */
  const handlePreviousPage = () => {
    if (page > 1) {
      router.push(`/products?page=${page - 1}&search=${search}&category=${category}&sort=${sort}`);
    }
  };

  /**
   * Updates the search query state when the input changes.
   * 
   * @param {Event} e - The input change event.
   */
  const handleSearchChange = (e) => {
    setSearch(e.target.value);
  };

  /**
   * Handles the submission of the search form.
   * 
   * @param {Event} e - The submit event.
   */
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    router.push(`/products?page=1&search=${search}&category=${category}&sort=${sort}`);
  };

  /**
   * Updates the category state and navigates to the first page of products for the selected category.
   * 
   * @param {Event} e - The change event from the category dropdown.
   */
  const handleCategoryChange = (e) => {
    const selectedCategory = e.target.value;
    setCategory(selectedCategory);
    router.push(`/products?page=1&search=${search}&category=${selectedCategory}&sort=${sort}`); // Ensure this triggers a new fetch
  };

  /**
   * Updates the sort state and navigates to the first page of products for the selected sort order.
   * 
   * @param {Event} e - The change event from the sort dropdown.
   */
  const handleSortChange = (e) => {
    const selectedSort = e.target.value;
    setSort(selectedSort);
    router.push(`/products?page=1&search=${search}&category=${category}&sort=${selectedSort}`); // Ensure this triggers a new fetch
  };

  /**
   * Resets the search, category, and sort filters to their default values.
   */
  const handleReset = () => {
    setSearch('');
    setCategory('');
    setSort('asc'); // Reset sort to default
    router.push(`/products`);
  };

  // Rendering logic
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

        {products.length > 0 && (
          <button onClick={() => router.push('/products')} className={styles.backToProductsButton}>
            Back to Products
          </button>
        )}

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

        <div className={styles.sortFilter}>
          <label htmlFor="sort">Sort by Price: </label>
          <select id="sort" value={sort} onChange={handleSortChange} className={styles.sortSelect}>
            <option value="asc">Price: Low to High</option>
            <option value="desc">Price: High to Low</option>
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
          products.map(product => (
            <Link href={`/products/${product.id}`} key={product.id} className={styles.productCard}>
              <img src={product.thumbnail} alt={product.title} className={styles.productImage} />
              <h2 className={styles.productTitle}>{product.title}</h2>
              <p className={styles.productCategory}>Category: {product.category}</p>
              <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
            </Link>
          ))
        )}
      </section>

      <footer className={styles.pagination}>
        <button onClick={handlePreviousPage} disabled={page === 1} className={styles.paginationButton}>
          Previous
        </button>
        <span>Page {page}</span>
        <button onClick={handleNextPage} className={styles.paginationButton}>
          Next
        </button>
      </footer>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
