import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return errorResponse('Unauthorized', 403);

    await connectToDatabase();

    // Books per Genre
    const books = await Book.find().populate('genres');
    const genreMap: Record<string, number> = {};

    books.forEach((b: any) => {
      b.genres.forEach((g: any) => {
        genreMap[g.name] = (genreMap[g.name] || 0) + 1;
      });
    });

    const genreData = Object.entries(genreMap).map(([name, value]) => ({ name, value }));

    return successResponse({ genreData });
  } catch (error) {
    return handleApiError(error);
  }
}
