// app/api/secureRoute/route.js

import { NextResponse } from 'next/server';
import { verifyIdToken } from '../../utils/firebaseAdmin'; // Adjust the path if necessary

/**
 * Handles the GET request to the secure route.
 *
 * @param {Request} req - The incoming request object containing headers and other request details.
 * @returns {Promise<NextResponse>} A promise that resolves to a NextResponse object,
 * which contains a JSON response indicating whether access was granted or denied.
 */
export async function GET(req) {
  const authHeader = req.headers.get('authorization'); // Get the Authorization header

  // Check for the Bearer token
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  // Extract the token from the Authorization header
  const token = authHeader.split('Bearer ')[1];

  try {
    // Verify the ID token
    const decodedToken = await verifyIdToken(token);
    
    // Respond with success and user UID
    return NextResponse.json({ message: 'Access granted', uid: decodedToken.uid });
  } catch (error) {
    console.error('Token verification failed:', error); // Log the error for debugging
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }
}
