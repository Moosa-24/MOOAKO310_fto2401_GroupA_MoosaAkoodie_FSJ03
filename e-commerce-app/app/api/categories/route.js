// app/api/categories/route.js
import { NextResponse } from 'next/server';

export async function GET() {
  try {
    const response = await fetch('https://next-ecommerce-api.vercel.app/categories');
    if (!response.ok) {
      throw new Error('Failed to fetch categories');
    }
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error) {
    return NextResponse.json({ error: 'Error fetching categories' }, { status: 500 });
  }
}
