'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import styles from '../productDetails.module.css';

/**
 * Fetches the details of a product by its ID from the API.
 * 
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Object>} A promise that resolves to the product details.
 * @throws {Error} Throws an error if the fetch operation fails.
 */
const fetchProductDetails = async (id) => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
};

/**
 * ProductDetailsPage component fetches and displays detailed information about a single product.
 * 
 * This component uses the product ID from route parameters to fetch product details from an API.
 * It handles loading, error states, and displays product information including images, title, description,
 * price, category, tags, rating, stock availability, and reviews. It also provides navigation buttons
 * to return to the products list or home page.
 * 
 * @param {Object} props - Component props.
 * @param {Object} props.params - Route parameters.
 * @param {string} props.params.id - The ID of the product to fetch.
 * 
 * @returns {JSX.Element} The rendered component.
 * 
 * @throws {Error} Throws an error if the product details fail to fetch.
 */
export default function ProductDetailsPage({ params }) {
  const { id } = params; // Retrieve the product ID from route params
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
        <button onClick={() => router.push('/products')} className={styles.backButton}>
          Back to Products
        </button>
        <button onClick={() => router.push('/')} className={styles.backButton}>
          Back to Home
        </button>
      </header>

      <section className={styles.productDetails}>
        {/* Display the product image gallery */}
        <div className={styles.imageGallery}>
          {product.images && product.images.length > 1 ? (
            product.images.map((image, index) => (
              <Image
                key={index}
                src={image}
                alt={product.title}
                width={500}
                height={500}
                className={styles.productImage}
              />
            ))
          ) : (
            <Image
              src={product.thumbnail}
              alt={product.title}
              width={500}
              height={500}
              className={styles.productImage}
            />
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
        <p className={styles.productStock}>
          {product.stock > 0 ? `In Stock: ${product.stock}` : 'Out of Stock'}
        </p>

        <div className={styles.productReviews}>
          <h4>Reviews:</h4>
          {product.reviews && product.reviews.length > 0 ? (
            product.reviews.map((review, index) => (
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
      </section>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
