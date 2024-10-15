import { db, verifyIdToken } from '../../../../utils/firebaseAdmin'; // Adjust the path as needed
import { NextResponse } from 'next/server';

export async function POST(request, { params }) {
    const { id } = params;

    try {
        const authHeader = request.headers.get('Authorization');
        if (!authHeader) {
            return NextResponse.json({ error: 'Authorization header is missing' }, { status: 401 });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = await verifyIdToken(token);

        const { rating, comment } = await request.json();

        const review = {
            reviewerName: decodedToken.email,
            rating: parseInt(rating),
            comment,
            date: new Date().toISOString(),
        };

        await db.collection('products').doc(id).update({
            reviews: admin.firestore.FieldValue.arrayUnion(review),
        });

        return NextResponse.json({ message: 'Review added successfully' }, { status: 201 });
    } catch (error) {
        console.error('Error adding review:', error);
        return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
    }
}
