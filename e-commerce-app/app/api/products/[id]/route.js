// app/api/products/[id]/route.js
import { db } from '../../../utils/firebaseAdmin';
import { NextResponse } from 'next/server';

export async function GET(request, { params }) {
    console.log("Received params:", params); 
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
