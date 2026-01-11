import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Genre from '@/lib/models/Genre';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(_req: NextRequest) {
  try {
    await connectToDatabase();
    const genres = await Genre.find().sort({ name: 1 });
    return successResponse({ genres });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(req: NextRequest) {
  try {
    const limit = Number(req.nextUrl.searchParams.get('limit')) || 10;
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return errorResponse('Unauthorized', 403);
    }

    await connectToDatabase();
    const body = await req.json();

    const genre = await Genre.create(body);

    return successResponse({ genre }, 'Genre created successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
