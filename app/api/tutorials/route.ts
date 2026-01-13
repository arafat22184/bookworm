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

export async function DELETE(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') {
      return errorResponse('Unauthorized', 403);
    }

    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (!id) {
        return errorResponse('Missing tutorial ID', 400);
    }

    await connectToDatabase();
    
    const deletedTutorial = await Tutorial.findByIdAndDelete(id);

    if (!deletedTutorial) {
        return errorResponse('Tutorial not found', 404);
    }

    return successResponse({ id }, 'Tutorial deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
