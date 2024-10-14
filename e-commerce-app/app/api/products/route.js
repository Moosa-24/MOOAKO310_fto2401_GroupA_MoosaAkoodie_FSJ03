// app/api/products/route.js
import { db } from '../../utils/firebaseAdmin'; // Adjust the import path based on your structure
import { NextResponse } from 'next/server';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || 20; // Default limit
  const page = parseInt(searchParams.get('page')) || 1; // Default page
  const search = searchParams.get('search') || ''; // Get the search query
  const category = searchParams.get('category') || ''; // Get the category filter

  try {
    let productsRef = db.collection('products');

    // Apply search filter if provided
    if (search) {
      productsRef = productsRef.where('title', '>=', search).where('title', '<=', search + '\uf8ff');
    }

    // Apply category filter if provided and using array-contains
    if (category) {
      productsRef = productsRef.where('categories', 'array-contains', category);
    }

    // Limit results based on pagination
    const snapshot = await productsRef.limit(limit).get(); 
    const products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}