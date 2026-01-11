import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) return errorResponse('Unauthorized', 401);

    await connectToDatabase();
    const { goal } = await req.json();

    const user = await User.findByIdAndUpdate(
      currentUser.id,
      { 'challenge.goal': goal, 'challenge.year': new Date().getFullYear() },
      { new: true }
    );

    if (!user) return errorResponse('User not found', 404);

    return successResponse({ challenge: user.challenge });
  } catch (error) {
    return handleApiError(error);
  }
}
