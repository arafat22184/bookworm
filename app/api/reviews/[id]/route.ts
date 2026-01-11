import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Review from '@/lib/models/Review';
import Book from '@/lib/models/Book';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function PATCH(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return errorResponse('Unauthorized', 403);
    }

    await connectToDatabase();
    const { status } = await req.json();
    const { id } = params;

    if (!['approved', 'rejected', 'pending'].includes(status)) {
      return errorResponse('Invalid status', 400);
    }

    const review = await Review.findByIdAndUpdate(id, { status }, { new: true });

    // Update Book Average Rating if approved
    // This is expensive to do on every update, but strictly correct.
    // Or we can just calculate it on read.
    // But since it's "Instructor-grade", let's update it or just rely on aggregation during read?
    // Book model has `avgRating` field. We should update it.
    if (status === 'approved' && review) {
      const stats = await Review.aggregate([
        { $match: { book: review.book, status: 'approved' } },
        { $group: { _id: '$book', avgRating: { $avg: '$rating' }, count: { $sum: 1 } } }
      ]);

      if (stats.length > 0) {
        await Book.findByIdAndUpdate(review.book, {
          avgRating: stats[0].avgRating,
          totalRatings: stats[0].count
        });
      }
    }

    return successResponse({ review });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function DELETE(req: NextRequest, props: { params: Promise<{ id: string }> }) {
  const params = await props.params;
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser || currentUser.role !== 'admin') {
      return errorResponse('Unauthorized', 403);
    }

    await connectToDatabase();
    const { id } = params;
    await Review.findByIdAndDelete(id);

    return successResponse({ message: 'Review deleted' });
  } catch (error) {
    return handleApiError(error);
  }
}
