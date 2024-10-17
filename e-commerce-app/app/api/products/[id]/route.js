import { db } from '../../../utils/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';

/**
 * Handles GET requests to fetch a product by its ID.
 *
 * @param {Request} request - The incoming request object.
 * @param {Object} context - The context object containing parameters.
 * @param {Object} context.params - The URL parameters from the request.
 * @param {string} context.params.id - The ID of the product to fetch.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object containing the product data or an error message.
 */
export async function GET(request, { params }) {
  console.log("Received params:", params); 
  const { id } = params;

  try {
    // Reference to the specific document in 'products'
    const productRef = doc(db, 'products', id);
    // Fetch the document
    const productDoc = await getDoc(productRef);

    // Check if the document exists
    if (!productDoc.exists()) {
      return NextResponse.json({ error: 'Product not found' }, { status: 404 });
    }

    // Construct product object with the fetched data
    const product = {
      id: productDoc.id,
      ...productDoc.data(),
    };

    // Return the product data as JSON
    return NextResponse.json(product);
  } catch (error) {
    console.error('Error fetching product:', error);
    // Return an error response in case of failure
    return NextResponse.json({ error: 'Failed to fetch product' }, { status: 500 });
  }
}
