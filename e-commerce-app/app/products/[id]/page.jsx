'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Image from 'next/image';
import Head from 'next/head'; // Import Head for SEO
import styles from '../productDetails.module.css';

/**
 * Fetches product details from the API.
 * @async
 * @param {string} id - The ID of the product to fetch.
 * @returns {Promise<Object>} A promise that resolves to the product details.
 * @throws Will throw an error if the fetch fails.
 */
const fetchProductDetails = async (id) => {
  const response = await fetch(`https://next-ecommerce-api.vercel.app/products/${id}`);
  if (!response.ok) {
    throw new Error('Failed to fetch product details');
  }
  return response.json();
};

/**
 * Displays the product details page.
 * @param {Object} props - The component props.
 * @param {Object} props.params - The route parameters.
 * @param {string} props.params.id - The product ID from the route parameters.
 * @returns {JSX.Element} The rendered product details page.
 */
export default function ProductDetailsPage({ params }) {
  const { id } = params;
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState('highest'); // Default sort order
  const [sortCriteria, setSortCriteria] = useState('rating'); // Default sort criteria
  const router = useRouter();

  // Fetch product details when component mounts or the product ID changes
  useEffect(() => {
    setLoading(true);
    setError(null);

    fetchProductDetails(id)
      .then(data => setProduct(data))
      .catch(err => setError('Error fetching product details'))
      .finally(() => setLoading(false));
  }, [id]);

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
        <meta property="og:title" content={product.title} />
        <meta property="og:description" content={product.description} />
        <meta property="og:image" content={product.images && product.images.length > 0 ? product.images[0] : product.thumbnail} />
        <meta property="og:url" content={`https://yourwebsite.com/products/${id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={product.title} />
        <meta name="twitter:description" content={product.description} />
        <meta name="twitter:image" content={product.images && product.images.length > 0 ? product.images[0] : product.thumbnail} />

        {/* Structured Data */}
        <script type="application/ld+json">{JSON.stringify({
          "@context": "https://schema.org/",
          "@type": "Product",
          "name": product.title,
          "image": product.images && product.images.length > 0 ? product.images[0] : product.thumbnail,
          "description": product.description,
          "sku": product.id,
          "offers": {
            "@type": "Offer",
            "url": `https://yourwebsite.com/products/${id}`,
            "priceCurrency": "USD",
            "price": product.price.toFixed(2),
            "itemCondition": "https://schema.org/NewCondition",
            "availability": product.stock > 0 ? "https://schema.org/InStock" : "https://schema.org/OutOfStock"
          }
        })}</script>
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

        {/* Sort Dropdown for Reviews */}
        <div className={styles.sortContainer}>
          <label htmlFor="sortReviews">Sort Reviews: </label>
          <select
            id="sortCriteria"
            value={sortCriteria}
            onChange={(e) => setSortCriteria(e.target.value)}
            className={styles.sortSelect}
          >
            <option value="rating">By Rating</option>
            <option value="date">By Date</option>
          </select>

          <select
            id="sortOrder"
            value={sortOrder}
            onChange={(e) => setSortOrder(e.target.value)}
            className={styles.sortSelect}
          >
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
      </section>

      <footer className={styles.footer}>
        <p>© 2024 E-Commerce Store</p>
      </footer>
    </div>
  );
}
