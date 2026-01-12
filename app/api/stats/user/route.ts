import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Shelf from '@/lib/models/Shelf';
import { successResponse, handleApiError, unauthorizedResponse } from '@/lib/api-utils';
import { GenreDistribution, MonthlyReadingData, BookWithGenres } from '@/lib/types';
import { getMonthName } from '@/lib/utils';

export async function GET() {
  try {
    const currentUser = await getCurrentUser();
    if (!currentUser) {
      return unauthorizedResponse();
    }

    await connectToDatabase();

    const userShelves = await Shelf.find({ user: currentUser.id }).populate({
      path: 'book',
      populate: { path: 'genres' }
    });

    // Genre Distribution (Pie Chart)
    const genreCountMap: Record<string, number> = {};

    for (const shelfItem of userShelves) {
      const book = shelfItem.book as unknown as BookWithGenres;

      if (book?.genres) {
        for (const genre of book.genres) {
          const genreName = genre.name;
          genreCountMap[genreName] = (genreCountMap[genreName] || 0) + 1;
        }
      }
    }

    const genreData: GenreDistribution[] = Object.entries(genreCountMap).map(
      ([name, value]) => ({ name, value })
    );

    // Monthly Books Read (Bar Chart) - Last 6 months
    const monthlyBooksMap: Record<string, number> = {};
    const monthNames: string[] = [];

    // Initialize last 6 months
    for (let monthsAgo = 5; monthsAgo >= 0; monthsAgo--) {
      const monthName = getMonthName(-monthsAgo);
      monthlyBooksMap[monthName] = 0;
      monthNames.push(monthName);
    }

    // Count books read per month
    for (const shelfItem of userShelves) {
      if (shelfItem.status === 'read') {
        const finishedDate = new Date(shelfItem.updatedAt);
        const monthName = finishedDate.toLocaleString('default', { month: 'short' });

        if (monthlyBooksMap[monthName] !== undefined) {
          monthlyBooksMap[monthName]++;
        }
      }
    }

    const monthlyData: MonthlyReadingData[] = monthNames.map(name => ({
      name,
      books: monthlyBooksMap[name],
    }));

    return successResponse({ genreData, monthlyData });
  } catch (error) {
    return handleApiError(error);
  }
}

