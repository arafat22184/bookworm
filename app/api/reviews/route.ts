import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Review from '@/lib/models/Review';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse('Unauthorized', 401);

    await connectToDatabase();
    const body = await req.json();
    const { bookId, rating, comment } = body;

    if (!bookId || !rating || !comment) {
      return errorResponse('Missing fields', 400);
    }

    // Check for existing review
    const existingReview = await Review.findOne({ user: user.id, book: bookId });
    if (existingReview) {
      return errorResponse('You have already reviewed this book', 409);
    }

    const review = await Review.create({
      user: user.id,
      book: bookId,
      rating,
      comment,
      status: 'pending', // Pending approval
    });

    return successResponse({ review }, 'Review submitted successfully', 201);
  } catch (error) {
    return handleApiError(error);
  }
}
