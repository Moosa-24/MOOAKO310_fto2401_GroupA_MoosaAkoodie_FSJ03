// app/api/categories/route.js
import { db } from '../../utils/firebaseAdmin';  // Adjust the path based on your project structure
import { NextResponse } from 'next/server';

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
