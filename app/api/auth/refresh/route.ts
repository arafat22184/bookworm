import { NextRequest } from 'next/server';
import { verifyRefreshToken, signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { errorResponse, successResponse, handleApiError } from '@/lib/api-utils';
import { cookies } from 'next/headers';
import User from '@/lib/models/User';
import connectToDatabase from '@/lib/db';

export async function POST(_req: NextRequest) {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get('refreshToken')?.value;

    if (!token) {
      return errorResponse('Refresh token missing', 401);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const decoded: any = verifyRefreshToken(token);

    if (!decoded) {
      return errorResponse('Invalid or expired refresh token', 401);
    }

    await connectToDatabase();
    const user = await User.findById(decoded.userId);

    if (!user) {
      return errorResponse('User not found', 401);
    }

    // Token Rotation: Issue new Access AND Refresh tokens
    const payload = { userId: user._id, role: user.role };
    const newAccessToken = signAccessToken(payload);
    const newRefreshToken = signRefreshToken(payload);

    await setAuthCookies(newAccessToken, newRefreshToken);

    return successResponse({
      accessToken: newAccessToken,
      // We don't necessarily send refresh token back in body effectively as it is HttpOnly,
      // but passing it is fine or just empty.
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      }
    });

  } catch (error) {
    return handleApiError(error);
  }
}
