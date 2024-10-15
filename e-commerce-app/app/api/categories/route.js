// app/api/categories/route.js
import { db } from '../../utils/firebaseAdmin';  // Adjust the path based on your project structure
import { NextResponse } from 'next/server';

/**
 * Handles GET requests to fetch all categories from the database.
 *
 * @async
 * @function GET
 * @returns {Promise<NextResponse>} A Promise that resolves to a NextResponse object containing
 *                                  the list of categories in JSON format or an error message.
 * 
 * @throws {Error} Throws an error if fetching categories fails.
 */
export async function GET() {
  try {
    const categoriesRef = db.collection('categories'); // Access the 'categories' collection
    const snapshot = await categoriesRef.get(); // Fetch all categories

    const categories = snapshot.docs.map(doc => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(categories);
  } catch (error) {
    console.error('Error fetching categories:', error);
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}
