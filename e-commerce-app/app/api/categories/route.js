import { db } from '../../utils/firebase';  // Adjust the path based on your project structure
import { NextResponse } from 'next/server';
import { collection, getDocs } from 'firebase/firestore';

export async function GET() {
  try {
    const categoriesRef = collection(db, 'categories'); // Access the 'categories' collection
    const snapshot = await getDocs(categoriesRef); // Fetch all categories

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
