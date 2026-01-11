import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return errorResponse('Unauthorized', 403);
    }

    await connectToDatabase();
    const { role } = await req.json();

    if (!['user', 'admin'].includes(role)) {
      return errorResponse('Invalid role', 400);
    }

    const { id } = params;
    const user = await User.findByIdAndUpdate(id, { role }, { new: true });

    return successResponse({ user });
  } catch (error) {
    return handleApiError(error);
  }
}
