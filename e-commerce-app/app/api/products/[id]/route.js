import { db } from '../../../utils/firebase';
import { NextResponse } from 'next/server';
import { doc, getDoc } from 'firebase/firestore';

export async function GET(request, { params }) {
  console.log("Received params:", params); 
  const { id } = params;

  try {
    const productRef = doc(db, 'products', id); // Reference to the specific document in 'products'
    const productDoc = await getDoc(productRef); // Fetch the document

    if (!productDoc.exists()) {
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
