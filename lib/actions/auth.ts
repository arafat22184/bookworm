'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { signAccessToken, signRefreshToken, setAuthCookies } from '@/lib/auth';
import { registerSchema, loginSchema } from '@/lib/validations/auth';

export async function registerUser(formData: FormData) {
  try {
    await connectToDatabase();

    const data = {
      name: formData.get('name') as string,
      email: formData.get('email') as string,
      password: formData.get('password') as string,
      image: formData.get('image') as string,
    };

    const result = registerSchema.safeParse(data);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      return {
        success: false,
        message: firstError || 'Validation failed',
      };
    }

    const { name, email, password, image } = result.data;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return {
        success: false,
        message: 'Email is already in use',
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashedPassword,
      image,
      role: 'user',
    });

    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await setAuthCookies(accessToken, refreshToken);

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

export async function loginUser(formData: FormData) {
  try {
    await connectToDatabase();

    const data = {
      email: formData.get('email') as string,
      password: formData.get('password') as string,
    };

    const result = loginSchema.safeParse(data);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      return {
        success: false,
        message: firstError || 'Validation failed',
      };
    }

    const { email, password } = result.data;

    const user = await User.findOne({ email });

    if (!user) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const isMatch = await bcrypt.compare(password, user.password!);

    if (!isMatch) {
      return {
        success: false,
        message: 'Invalid email or password',
      };
    }

    const payload = { userId: user._id.toString(), role: user.role };
    const accessToken = signAccessToken(payload);
    const refreshToken = signRefreshToken(payload);

    await setAuthCookies(accessToken, refreshToken);

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
