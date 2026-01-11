
import { cookies } from 'next/headers';
import { verifyAccessToken } from '@/lib/auth';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db';

export async function getCurrentUser() {
  const cookieStore = await cookies();
  const token = cookieStore.get('accessToken')?.value;

  if (!token) return null;

  try {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const payload: any = verifyAccessToken(token);
    if (!payload) return null;

    await connectToDatabase();

    // Select necessary fields, exclude password, purely for UI use
    const user = await User.findById(payload.userId).select('-password');

    if (!user) return null;

    return {
      id: user._id.toString(),
      name: user.name,
      email: user.email,
      role: user.role,
      image: user.image,
    };
  } catch (_error) {
    return null;
  }
}
