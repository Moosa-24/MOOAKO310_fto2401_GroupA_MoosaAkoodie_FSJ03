// app/api/secureRoute/route.js

import { NextResponse } from 'next/server';
import { verifyIdToken } from '../../utils/firebaseAdmin'; // Adjust the path if necessary

/**
 * Handles GET requests to the secure route, verifying the user's authentication.
 *
 * This function checks for an authorization header containing a Bearer token
 * or a cookie with a token. If a valid token is found and verified, it responds
 * with the user's UID. Otherwise, it responds with an unauthorized status.
 *
 * @param {Request} req - The incoming HTTP request object.
 * @returns {Promise<NextResponse>} - A promise that resolves to a NextResponse object.
 */
export async function GET(req) {
  const authHeader = req.headers.get('authorization'); // Get the Authorization header
  const cookieString = req.headers.get('cookie'); // Get the cookie header

  // Check for the Bearer token in the Authorization header
  if (authHeader && authHeader.startsWith('Bearer ')) {
    // Extract the token from the Authorization header
    const token = authHeader.split('Bearer ')[1];

    try {
      // Verify the ID token
      const decodedToken = await verifyIdToken(token);
      
      // Respond with success and user UID
      return NextResponse.json({ message: 'Access granted', uid: decodedToken.uid });
    } catch (error) {
      console.error('Token verification failed (Authorization header):', error); // Log the error for debugging
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
  }

  // If no token found in the Authorization header, check cookies
  if (cookieString) {
    const token = cookieString.split('; ').find(row => row.startsWith('token='));
    
    if (token) {
      const extractedToken = token.split('=')[1];
      
      try {
        // Verify the ID token from cookies
        const decodedToken = await verifyIdToken(extractedToken);
        
        // Respond with success and user UID
        return NextResponse.json({ message: 'Access granted', uid: decodedToken.uid });
      } catch (error) {
        console.error('Token verification failed (Cookie):', error); // Log the error for debugging
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
    }
  }

  // If no token is found, return unauthorized response
  return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
}
