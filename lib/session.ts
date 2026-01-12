import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db';
import { UserSession } from './types';

/**
 * Gets the current authenticated user from the access token cookie
 * @returns User session object or null if not authenticated
 */
export async function getCurrentUser(): Promise<UserSession | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return null;

  try {
    const payload = verifyAccessToken(token);
    if (!payload) return null;

    await connectToDatabase();

    // Select necessary fields, exclude password
    const user = await User.findById(payload.userId).select('-password').lean();

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    };
  } catch {
    return null;
  }
}

