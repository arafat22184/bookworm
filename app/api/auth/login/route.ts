import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { loginSchema } from '@/lib/validations/auth';
import { errorResponse, successResponse, handleApiError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const result = loginSchema.safeParse(body);

    if (!result.success) {
      return errorResponse('Validation Error', 400);
    }

    const { email, password } = result.data;

    // Explicitly select password since it might be excluded by default if we update the model later, 
    // but typically it's included unless logic changes. 
    // Mongoose query returns document.
    const user = await User.findOne({ email });

    if (!user) {
      return errorResponse('Invalid email or password', 401);
    }

    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return errorResponse('Invalid email or password', 401);
    }

    // Generate tokens
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await setAuthCookies(accessToken, refreshToken);

    return successResponse({
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}
