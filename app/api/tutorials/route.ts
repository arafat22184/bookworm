import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Tutorial from '@/lib/models/Tutorial';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET() {
  try {
    await connectToDatabase();
    const tutorials = await Tutorial.find().sort({ createdAt: -1 });
    return successResponse({ tutorials });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return errorResponse('Unauthorized', 403);
    }

    await connectToDatabase();
    const body = await req.json();

    const tutorial = await Tutorial.create(body);

    return successResponse({ tutorial }, 'Tutorial created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
