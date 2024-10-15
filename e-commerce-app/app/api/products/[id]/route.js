// app/api/products/[id]/route.js
import { db } from '../../../utils/firebaseAdmin';
import { NextResponse } from 'next/server';
import { verifyIdToken } from '../../../utils/firebaseAdmin'; // Make sure to import your token verification function

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

// Add the POST method to handle reviews
export async function POST(request, { params }) {
    const { id } = params;
    
    try {
        // Verify the user token
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token); // Verify token

        // Get review data from the request body
        const { rating, comment } = await request.json();
        
        // Prepare the review object
        const review = {
            reviewerName: decodedToken.email, // Use the user's email as the reviewer name
            rating: parseInt(rating), // Ensure rating is a number
            comment,
            date: new Date().toISOString(), // Add a timestamp
        };

        // Update the product document with the new review
        await db.collection('products').doc(id).update({
            reviews: admin.firestore.FieldValue.arrayUnion(review), // Use arrayUnion to add the review to the array
        });

        return NextResponse.json({ message: 'Review added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding review:', error);
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}