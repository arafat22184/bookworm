'use server';

import { revalidatePath } from 'next/cache';
import bcrypt from 'bcryptjs';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { getCurrentUser } from '@/lib/session';
import { updateProfileSchema, changePasswordSchema } from '@/lib/validations/profile';

/**
 * Server Action: Update user profile
 */
export async function updateProfile(formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    await connectToDatabase();

    // Extract form data
    const data = {
      name: formData.get('name') as string,
      image: formData.get('image') as string,
    };

    // Validate with Zod
    const result = updateProfileSchema.safeParse(data);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      return {
        success: false,
        message: firstError || 'Validation failed',
      };
    }

    // Build update object with only provided fields
    const updateData: { name?: string; image?: string } = {};
    if (result.data.name) updateData.name = result.data.name;
    if (result.data.image) updateData.image = result.data.image;

    // Update user in database
    const updatedUser = await User.findByIdAndUpdate(
      user.id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Revalidate profile page
    revalidatePath('/profile');

    return {
      success: true,
      message: 'Profile updated successfully!',
      user: {
        id: updatedUser._id.toString(),
        name: updatedUser.name,
        email: updatedUser.email,
        role: updatedUser.role,
        image: updatedUser.image,
      },
    };
  } catch (error) {
    console.error('Profile update error:', error);
    return {
      success: false,
      message: 'An error occurred while updating profile',
    };
  }
}

/**
 * Server Action: Change user password
 */
export async function updatePassword(formData: FormData) {
  try {
    const user = await getCurrentUser();

    if (!user) {
      return {
        success: false,
        message: 'Unauthorized',
      };
    }

    await connectToDatabase();

    // Extract form data
    const data = {
      currentPassword: formData.get('currentPassword') as string,
      newPassword: formData.get('newPassword') as string,
      confirmPassword: formData.get('confirmPassword') as string,
    };

    // Validate with Zod
    const result = changePasswordSchema.safeParse(data);

    if (!result.success) {
      const firstError = Object.values(result.error.flatten().fieldErrors)[0]?.[0];
      return {
        success: false,
        message: firstError || 'Validation failed',
      };
    }

    // Find user with password
    const dbUser = await User.findById(user.id);

    if (!dbUser) {
      return {
        success: false,
        message: 'User not found',
      };
    }

    // Verify current password
    const isMatch = await bcrypt.compare(result.data.currentPassword, dbUser.password!);

    if (!isMatch) {
      return {
        success: false,
        message: 'Current password is incorrect',
      };
    }

    // Hash new password
    const hashedPassword = await bcrypt.hash(result.data.newPassword, 10);

    // Update password
    await User.findByIdAndUpdate(user.id, { password: hashedPassword });

    return {
      success: true,
      message: 'Password changed successfully!',
    };
  } catch (error) {
    console.error('Password change error:', error);
    return {
      success: false,
      message: 'An error occurred while changing password',
    };
  }
}
