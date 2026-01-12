import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import { successResponse, handleApiError, forbiddenResponse, notFoundResponse } from '@/lib/api-utils';

interface RouteParams {
  params: Promise<{ id: string }>;
}

export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    await connectToDatabase();
    const { id } = await params;
    const book = await Book.findById(id).populate('genres');

    if (!book) {
      return notFoundResponse('Book not found');
    }

    return successResponse({ book });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return forbiddenResponse('Only admins can update books');
    }

    await connectToDatabase();
    const { id } = await params;
    const updateData = await request.json();

    const book = await Book.findByIdAndUpdate(
      id,
      { $set: updateData },
      { new: true, runValidators: true }
    ).populate('genres');

    if (!book) {
      return notFoundResponse('Book not found');
    }

    return successResponse({ book }, 'Book updated successfully');
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return forbiddenResponse('Only admins can delete books');
    }

    await connectToDatabase();
    const { id } = await params;
    const book = await Book.findByIdAndDelete(id);

    if (!book) {
      return notFoundResponse('Book not found');
    }

    return successResponse({ id }, 'Book deleted successfully');
  } catch (error) {
    return handleApiError(error);
  }
}
