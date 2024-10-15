import { db } from '../../../utils/firebaseAdmin';
import { NextResponse } from 'next/server';
import { verifyIdToken } from '../../../utils/firebaseAdmin'; // Import the token verification function
import admin from 'firebase-admin'; // Import admin for Firestore operations if needed

/**
 * GET method to fetch a product by ID.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the product to fetch.
 * @returns {NextResponse} - The response containing the product data or an error message.
 */
export async function GET(request, { params }) {
    const { id } = params;

    try {
        const productDoc = await db.collection('products').doc(id).get();

        if (!productDoc.exists) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = {
            id: productDoc.id,
            ...productDoc.data(),
        };

        return NextResponse.json(product);
    } catch (error) {
        console.error('Error fetching product:', error);
        return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
    }
}

/**
 * POST method to add a review to a product.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the product to add a review for.
 * @returns {NextResponse} - The response indicating success or failure.
 */
export async function POST(request, { params }) {
    const { id } = params;

    try {
        // Verify the user token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token);

        // Get review data from the request body
        const { rating, comment } = await request.json();

        const review = {
            reviewerName: decodedToken.email,
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString(),
        };

        // Add the new review
        await db.collection('products').doc(id).update({
            reviews: admin.firestore.FieldValue.arrayUnion(review),
        });

        return NextResponse.json({ message: 'Review added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding review:', error);
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}

/**
 * PATCH method to edit a review for a product.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the product whose review is being edited.
 * @returns {NextResponse} - The response indicating success or failure.
 */
export async function PATCH(request, { params }) {
    const { id } = params;

    try {
        // Verify the user token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token);

        const { reviewId, rating, comment } = await request.json();

        const productRef = db.collection('products').doc(id);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const reviews = productDoc.data().reviews || [];

        const updatedReviews = reviews.map((review) =>
            review.id === reviewId && review.reviewerName === decodedToken.email
                ? { ...review, rating: parseInt(rating), comment, date: new Date().toISOString() }
                : review
        );

        await productRef.update({ reviews: updatedReviews });

        return NextResponse.json({ message: 'Review updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error editing review:', error);
        return NextResponse.json({ error: 'Failed to edit review' }, { status: 500 });
    }
}

/**
 * DELETE method to delete a review from a product.
 * 
 * @param {Request} request - The incoming HTTP request.
 * @param {Object} params - The route parameters.
 * @param {string} params.id - The ID of the product from which the review will be deleted.
 * @returns {NextResponse} - The response indicating success or failure.
 */
export async function DELETE(request, { params }) {
    const { id } = params;

    try {
        // Verify the user token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token);

        const { reviewId } = await request.json();

        const productRef = db.collection('products').doc(id);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const reviews = productDoc.data().reviews || [];

        // Remove the review by matching both the ID and the reviewer's email
        const updatedReviews = reviews.filter(
            (review) => !(review.id === reviewId && review.reviewerName === decodedToken.email)
        );

        await productRef.update({ reviews: updatedReviews });

        return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
