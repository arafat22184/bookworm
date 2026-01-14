'use server';

import { redirect } from 'next/navigation';
import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { registerSchema, loginSchema } from '@/lib/validations/auth';

/**
 * Server Action: Register a new user
 */
export async function registerUser(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract form data
    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      image: formData.get('image') as string,
    };

    // Validate with Zod
    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      return {
        success: false,
        message: firstError || 'Validation failed',
      };
    }

    const { name, email, password, image } = result.data;

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: 'Email is already in use',
      };
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
      role: 'user',
    });

    // Generate tokens
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Set auth cookies
    await setAuthCookies(accessToken, refreshToken);

    // Revalidate relevant paths
    revalidatePath('/');
    revalidatePath('/my-library');

    return {
      success: true,
      message: 'Account created successfully!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    };
  } catch (error) {
    console.error('Registration error:', error);
    return {
      success: false,
      message: 'An error occurred during registration',
    };
  }
}

/**
 * Server Action: Login user
 */
export async function loginUser(formData: FormData) {
  try {
    await connectToDatabase();

    // Extract form data
    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    // Validate with Zod
    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      return {
        success: false,
        message: firstError || 'Validation failed',
      };
    }

    const { email, password } = result.data;

    // Find user
    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Verify password
    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    // Generate tokens
    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    // Set auth cookies
    await setAuthCookies(accessToken, refreshToken);

    // Revalidate relevant paths
    revalidatePath('/');

    return {
      success: true,
      message: 'Welcome back!',
      user: {
        id: user._id.toString(),
        name: user.name,
        email: user.email,
        role: user.role,
        image: user.image,
      },
    };
  } catch (error) {
    console.error('Login error:', error);
    return {
      success: false,
      message: 'An error occurred during login',
    };
  }
}
