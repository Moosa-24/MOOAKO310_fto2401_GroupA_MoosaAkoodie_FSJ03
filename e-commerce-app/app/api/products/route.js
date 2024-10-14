// app/api/products/route.js
import { db } from '../../utils/firebaseAdmin';
import { NextResponse } from 'next/server';
import Fuse from 'fuse.js';

export async function GET(request) {
  const { searchParams } = new URL(request.url);
  const limit = parseInt(searchParams.get('limit')) || 20; // Default limit
  const page = parseInt(searchParams.get('page')) || 1; // Default page
  const search = searchParams.get('search') || ''; // Get the search query
  const category = searchParams.get('category') || ''; // Get the category filter

  try {
    let productsRef = db.collection('products');

    // Apply category filter if provided and using array-contains
    if (category) {
      productsRef = productsRef.where('categories', 'array-contains', category);
    }

    // Fetch all matching products (without search yet)
    const snapshot = await productsRef.get();
    let products = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Use Fuse.js for fuzzy searching if a search term is provided
    if (search) {
      const fuse = new Fuse(products, {
        keys: ['title'], // Search in the title field
        threshold: 0.3,  // Adjust this value to make the search stricter or looser
      });
      const results = fuse.search(search);
      products = results.map(result => result.item); // Extract the original items from the Fuse.js result
    }

    // Apply pagination (assuming page is 1-indexed)
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return NextResponse.json(paginatedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
