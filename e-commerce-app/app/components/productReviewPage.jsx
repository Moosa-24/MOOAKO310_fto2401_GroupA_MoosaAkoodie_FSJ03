'use client';

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { onAuthStateChanged } from 'firebase/auth';
import { auth } from '../../utils/firebaseClient';
import styles from './productReview.module.css';

const ProductReviewPage = ({ params }) => {
    const { id } = params;
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newReview, setNewReview] = useState({ rating: '', comment: '' });
    const [isAuthenticated, setIsAuthenticated] = useState(false);

    useEffect(() => {
        const unsubscribe = onAuthStateChanged(auth, (user) => {
            setIsAuthenticated(!!user);
        });
        return () => unsubscribe();
    }, []);

    useEffect(() => {
        const fetchProductDetails = async () => {
            try {
                const response = await fetch(`/api/products/${id}`);
                if (!response.ok) {
                    throw new Error('Failed to fetch product details');
                }
                const data = await response.json();
                setProduct(data);
            } catch (err) {
                setError(err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchProductDetails();
    }, [id]);

    const submitReview = async (e) => {
        e.preventDefault();
        if (!auth.currentUser) return;

        const token = await auth.currentUser.getIdToken();
        const response = await fetch(`/api/products/${id}/reviews`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`,
            },
            body: JSON.stringify(newReview),
        });

        if (response.ok) {
            const updatedProduct = await fetch(`/api/products/${id}`);
            setProduct(updatedProduct);
            setNewReview({ rating: '', comment: '' });
        } else {
            const errorData = await response.json();
            setError(errorData.error || 'Failed to submit review');
        }
    };

    if (loading) return <p>Loading product details...</p>;
    if (error) return <p>{error}</p>;
    if (!product) return <p>No product found.</p>;

    return (
        <div className={styles.container}>
            <h1 className={styles.title}>{product.title}</h1>
            <img src={product.thumbnail} alt={product.title} className={styles.image} />
            <p className={styles.description}>{product.description}</p>
            <p className={styles.price}>${product.price.toFixed(2)}</p>
            <h2>Reviews:</h2>
            {product.reviews.length > 0 ? (
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

            {isAuthenticated ? (
                <form onSubmit={submitReview} className={styles.reviewForm}>
                    <h3>Submit a Review:</h3>
                    <label htmlFor="rating">Rating:</label>
                    <select
                        id="rating"
                        value={newReview.rating}
                        onChange={(e) => setNewReview({ ...newReview, rating: e.target.value })}
                        required
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
                    />

                    <button type="submit">Submit Review</button>
                </form>
            ) : (
                <p>You must be signed in to submit a review. Please log in.</p>
            )}
        </div>
    );
};

export default ProductReviewPage;
