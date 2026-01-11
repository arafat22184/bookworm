import { NextRequest } from 'next/server';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { registerSchema } from '@/lib/validations/auth';
import { errorResponse, successResponse, handleApiError } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();

    const body = await req.json();
    const result = registerSchema.safeParse(body);

    if (!result.success) {
      return errorResponse('Validation Error', 400);
    }

    const { name, email, password } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return errorResponse('Email is already in use', 409);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      role: 'user', // Default role
    });

    // Generate tokens
    const payload = { userId: user._id, role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await setAuthCookies(accessToken, refreshToken);

    return successResponse({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    }, 'User registered successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
