'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { getAuth, onAuthStateChanged } from 'firebase/auth';
import Image from 'next/image';
import Head from 'next/head';
import styles from '../productDetails.module.css';

const fetchProductDetails = async (id) => {
  const formattedId = id.padStart(3, '0');
  const response = await fetch(`/api/products/${formattedId}`);
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
  const [sortOrder, setSortOrder] = useState('highest');
  const [sortCriteria, setSortCriteria] = useState('rating');
  const [newReview, setNewReview] = useState({ rating: '', comment: '' });
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const router = useRouter();

  useEffect(() => {
    const auth = getAuth();
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsAuthenticated(!!user); // Update authenticated state
    });

    // Clean up the subscription
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setLoading(true);
    setError(null);
    fetchProductDetails(id)
      .then(data => setProduct(data))
      .catch(err => setError('Error fetching product details'))
      .finally(() => setLoading(false));
  }, [id]);

  const submitReview = async (e) => {
    e.preventDefault();
    const token = await getAuthToken(); // Implement your method to get the auth token

    const response = await fetch(`/api/products/${id}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(newReview),
    });

    if (response.ok) {
      const updatedProduct = await fetchProductDetails(id); // Re-fetch product details to include new review
      setProduct(updatedProduct);
      setNewReview({ rating: '', comment: '' }); // Reset the form
    } else {
      const errorData = await response.json();
      setError(errorData.error || 'Failed to submit review');
    }
  };

  const sortedReviews = () => {
    if (!product || !product.reviews) return [];
    return product.reviews.sort((a, b) => {
      if (sortCriteria === 'rating') {
        return sortOrder === 'highest' ? b.rating - a.rating : a.rating - b.rating;
      } else if (sortCriteria === 'date') {
        return sortOrder === 'newest' ? new Date(b.date) - new Date(a.date) : new Date(a.date) - new Date(b.date);
      }
    });
  };

  if (loading) return <p>Loading product details...</p>;
  if (error) return <p>{error}</p>;
  if (!product) return <p>No product found.</p>;

  return (
    <div className={styles.page}>
      <Head>
        <title>{product.title} - E-Commerce Store</title>
        <meta name="description" content={product.description} />
        <meta name="keywords" content={product.tags.join(', ')} />
      </Head>
      
      <header className={styles.header}>
        <button onClick={() => router.push('/products')} className={styles.backButton}>
          Back to Products
        </button>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          Back to Home
        </button>
      </header>

      <section className={styles.productDetails}>
        <div className={styles.imageGallery}>
          {product.images && product.images.length > 1 ? (
            product.images.map((image, index) => (
              <Image key={index} src={image} alt={product.title} width={500} height={500} className={styles.productImage} />
            ))
          ) : (
            <Image src={product.thumbnail} alt={product.title} width={500} height={500} className={styles.productImage} />
          )}
        </div>

        <h2 className={styles.productTitle}>{product.title}</h2>
        <p className={styles.productDescription}>{product.description}</p>
        <p className={styles.productPrice}>${product.price.toFixed(2)}</p>
        <p className={styles.productCategory}>Category: {product.category}</p>

        {product.tags && product.tags.length > 0 && (
          <div className={styles.productTags}>
            <h4>Tags:</h4>
            <ul>
              {product.tags.map((tag, index) => (
                <li key={index}>{tag}</li>
              ))}
            </ul>
          </div>
        )}

        <p className={styles.productRating}>Rating: {product.rating}</p>
        <p className={styles.productStock}>{product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}</p>

        <div className={styles.sortContainer}>
          <label htmlFor="sortReviews">Sort Reviews: </label>
          <select id="sortCriteria" value={sortCriteria} onChange={(e) => setSortCriteria(e.target.value)} className={styles.sortSelect}>
            <option value="rating">By Rating</option>
            <option value="date">By Date</option>
          </select>

          <select id="sortOrder" value={sortOrder} onChange={(e) => setSortOrder(e.target.value)} className={styles.sortSelect}>
            {sortCriteria === 'rating' ? (
              <>
                <option value="highest">Highest Rating First</option>
                <option value="lowest">Lowest Rating First</option>
              </>
            ) : (
              <>
                <option value="newest">Newest First</option>
                <option value="oldest">Oldest First</option>
              </>
            )}
          </select>
        </div>

        <div className={styles.productReviews}>
          <h4>Reviews:</h4>
          {product.reviews && product.reviews.length > 0 ? (
            sortedReviews().map((review, index) => (
              <div key={index} className={styles.review}>
                <p><strong>{review.reviewerName}</strong> ({new Date(review.date).toLocaleDateString()}):</p>
                <p>Rating: {review.rating}</p>
                <p>{review.comment}</p>
              </div>
            ))
          ) : (
            <p>No reviews yet.</p>
          )}
        </div>

        {/* Review Submission Form */}
        {isAuthenticated ? (
          <form onSubmit={submitReview} className={styles.reviewForm}>
            <h4>Submit a Review:</h4>
            <label htmlFor="rating">Rating:</label>
            <select
              id="rating"
              value={newReview.rating}
              onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
              required
              className={styles.reviewInput}
            >
              <option value="" disabled>Select a rating</option>
              <option value="1">1 Star</option>
              <option value="2">2 Stars</option>
              <option value="3">3 Stars</option>
              <option value="4">4 Stars</option>
              <option value="5">5 Stars</option>
            </select>

            <label htmlFor="comment">Comment:</label>
            <textarea
              id="comment"
              value={newReview.comment}
              onChange={(e) => setNewReview({ ...newReview, comment: e.target.value })}
              required
              className={styles.reviewInput}
            />

            <button type="submit" className={styles.submitButton}>Submit Review</button>
          </form>
        ) : (
          <p>You must be signed in to submit a review. Please log in.</p>
        )}
      </section>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
