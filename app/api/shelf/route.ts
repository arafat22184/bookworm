import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Shelf from '@/lib/models/Shelf';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function POST(req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse('Unauthorized', 401);

    await connectToDatabase();
    const body = await req.json();
    const { bookId, status } = body;

    if (!bookId || !status) {
      return errorResponse('Missing bookId or status', 400);
    }

    const validStatuses = ['want-to-read', 'currently-reading', 'read'];
    if (!validStatuses.includes(status)) {
      return errorResponse('Invalid status', 400);
    }

    const shelfEntry = await Shelf.findOneAndUpdate(
      { user: user.id, book: bookId },
      { status, progress: body.progress || 0 }, // Optional progress update
      { upsert: true, new: true }
    );

    return successResponse({ shelf: shelfEntry });
  } catch (error) {
    return handleApiError(error);
  }
}
