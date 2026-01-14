import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';
import { SerializedBook, SerializedGenre } from '@/lib/types';

export async function GET() {
  try {
    const user = await getCurrentUser();
    if (!user || user.role !== 'admin') return errorResponse('Unauthorized', 403);

    await connectToDatabase();

    // Books per Genre
    const books: SerializedBook[] = (await Book.find().populate('genres')) as unknown as SerializedBook[];
    const genreMap: Record<string, number> = {};

    books.forEach((b: SerializedBook) => {
      b.genres.forEach((g: SerializedGenre) => {
        genreMap[g.name] = (genreMap[g.name] || 0) + 1;
      });
    });

    const genreData = Object.entries(genreMap).map(([name, value]) => ({ name, value }));

    return successResponse({ genreData });
  } catch (error) {
    return handleApiError(error);
  }
}
