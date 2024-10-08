// app/api/products/route.js
import { NextResponse } from 'next/server';

export async function GET(req) {
  const { searchParams } = new URL(req.url);
  const limit = searchParams.get('limit') || 20;
  const skip = searchParams.get('skip') || 0;
  const searchQuery = searchParams.get('search') ? `&search=${encodeURIComponent(searchParams.get('search'))}` : '';
  const category = searchParams.get('category') ? `&category=${encodeURIComponent(searchParams.get('category'))}` : '';

  try {
    const response = await fetch(`https://next-ecommerce-api.vercel.app/products?limit=${limit}&skip=${skip}${searchQuery}${category}`);
    if (!response.ok) {
      throw new Error('Failed to fetch products');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching products' }, { status: 500 });
  }
}
