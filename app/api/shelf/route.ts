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

    // 1. Fetch existing shelf entry to check previous status
    const existingEntry = await Shelf.findOne({ user: user.id, book: bookId });
    const oldStatus = existingEntry?.status;

    // 2. Update shelf entry
    const shelfEntry = await Shelf.findOneAndUpdate(
      { user: user.id, book: bookId },
      { status, progress: body.progress || 0 }, // Optional progress update
      { upsert: true, new: true }
    );

    // 3. Recalculate User Challenge Progress (Self-correcting)
    // Instead of incrementing, we count the actual number of read books to ensure consistency
    const totalRead = await Shelf.countDocuments({ user: user.id, status: 'read' });

    await import('@/lib/models/User').then((mod) => 
      mod.default.findByIdAndUpdate(user.id, { 
        'challenge.current': totalRead 
      })
    );

    return successResponse({ shelf: shelfEntry });
  } catch (error) {
    return handleApiError(error);
  }
}
