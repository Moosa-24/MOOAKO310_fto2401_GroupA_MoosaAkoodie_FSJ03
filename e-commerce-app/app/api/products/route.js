import { db } from '../../utils/firebase';
import { NextResponse } from 'next/server';
import { collection, getDocs, query, where } from 'firebase/firestore';
import Fuse from 'fuse.js';

/**
 * Handles the GET request to fetch products from the database.
 *
 * @param {Request} request - The incoming HTTP request object.
 * @returns {Promise<Response>} - A promise that resolves to a JSON response containing the paginated and filtered products.
 */
export async function GET(request) {
  const { searchParams } = new URL(request.url);
  
  // Parse query parameters
  const limit = parseInt(searchParams.get('limit')) || 20; // Default limit
  const page = parseInt(searchParams.get('page')) || 1; // Default page
  const search = searchParams.get('search') || ''; // Get the search query
  const category = searchParams.get('category') || ''; // Get the category filter
  const sort = searchParams.get('sort') || 'asc'; // Get the sort parameter, default to ascending

  try {
    let productsRef = collection(db, 'products');
    let q = productsRef;

    // Apply category filter if provided using array-contains
    if (category) {
      q = query(productsRef, where('categories', 'array-contains', category));
    }

    // Fetch all matching products (without search yet)
    const snapshot = await getDocs(q);
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

    // Sort products based on price
    products.sort((a, b) => {
      if (sort === 'desc') {
        return b.price - a.price; // Sort descending
      }
      return a.price - b.price; // Sort ascending
    });

    // Apply pagination (assuming page is 1-indexed)
    const startIndex = (page - 1) * limit;
    const paginatedProducts = products.slice(startIndex, startIndex + limit);

    return NextResponse.json(paginatedProducts);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Failed to fetch products' }, { status: 500 });
  }
}
