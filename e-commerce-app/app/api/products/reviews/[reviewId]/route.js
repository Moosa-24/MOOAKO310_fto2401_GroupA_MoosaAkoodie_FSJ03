import { db } from '../../../../utils/firebaseAdmin';
import { NextResponse } from 'next/server';
import { verifyIdToken } from '../../../../utils/firebaseAdmin';
import admin from 'firebase-admin';

// GET a specific review (not commonly needed, but included for completeness)
export async function GET(request, { params }) {
    const { id, reviewId } = params;

    try {
        const productDoc = await db.collection('products').doc(id).get();

        if (!productDoc.exists) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = productDoc.data();
        const review = product.reviews.find(r => r.id === reviewId);

        if (!review) {
            return NextResponse.json({ error: 'Review not found' }, { status: 404 });
        }

        return NextResponse.json(review);
    } catch (error) {
        console.error('Error fetching review:', error);
        return NextResponse.json({ error: 'Failed to fetch review' }, { status: 500 });
    }
}

// PUT to update a specific review
export async function PUT(request, { params }) {
    const { id, reviewId } = params;
    
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token);

        const { rating, comment } = await request.json();
        const updatedReview = {
            rating: parseInt(rating), // Ensure rating is a number
            comment,
            date: new Date().toISOString(), // Update the date to the current time
        };

        const productRef = db.collection('products').doc(id);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = productDoc.data();
        const reviews = product.reviews.map(r => r.id === reviewId ? { ...r, ...updatedReview } : r);

        await productRef.update({ reviews });

        return NextResponse.json({ message: 'Review updated successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error updating review:', error);
        return NextResponse.json({ error: 'Failed to update review' }, { status: 500 });
    }
}

// DELETE a specific review
export async function DELETE(request, { params }) {
    const { id, reviewId } = params;
    
    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token);

        const productRef = db.collection('products').doc(id);
        const productDoc = await productRef.get();

        if (!productDoc.exists) {
            return NextResponse.json({ error: 'Product not found' }, { status: 404 });
        }

        const product = productDoc.data();
        const updatedReviews = product.reviews.filter(r => r.id !== reviewId);

        await productRef.update({ reviews: updatedReviews });

        return NextResponse.json({ message: 'Review deleted successfully' }, { status: 200 });
    } catch (error) {
        console.error('Error deleting review:', error);
        return NextResponse.json({ error: 'Failed to delete review' }, { status: 500 });
    }
}
