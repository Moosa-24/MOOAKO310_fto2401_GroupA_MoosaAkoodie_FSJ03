import { db } from '../../utils/firebase';  // Adjust the path based on your project structure
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';

/**
 * Fetches all categories from the 'categories' collection in Firestore.
 *
 * @async
 * @function GET
 * @returns {Promise<NextResponse>} A response object containing the list of categories in JSON format.
 * @throws {Error} Returns a JSON response with a 500 status code if there's an error fetching the categories.
 */
export async function GET() {
  try {
    // Access the 'categories' collection
    const categoriesRef = collection(db, 'categories');

    // Fetch all documents in the 'categories' collection
    const snapshot = await getDocs(categoriesRef);

    // Map over the documents and extract their data along with IDs
    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    // Return the list of categories as a JSON response
    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);

    // Return an error response with a 500 status code
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}
