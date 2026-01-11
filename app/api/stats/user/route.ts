import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Shelf from '@/lib/models/Shelf';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(_req: NextRequest) {
  try {
    const user = await getCurrentUser();
    if (!user) return errorResponse('Unauthorized', 401);

    await connectToDatabase();

    const shelves = await Shelf.find({ user: user.id }).populate({
      path: 'book',
      populate: { path: 'genres' }
    });

    // Genre Distribution (Pie)
    const genreMap: Record<string, number> = {};
    shelves.forEach((s: any) => {
      if (s.book?.genres) {
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        s.book.genres.forEach((g: any) => {
          genreMap[g.name] = (genreMap[g.name] || 0) + 1;
        });
      }
    });
    const genreData = Object.entries(genreMap).map(([name, value]) => ({ name, value }));

    // Monthly Books Read (Bar) (Last 6 months)
    const monthlyBooks: Record<string, number> = {};
    const months = [];
    for (let i = 5; i >= 0; i--) {
      const d = new Date();
      d.setMonth(d.getMonth() - i);
      const key = d.toLocaleString('default', { month: 'short' });
      monthlyBooks[key] = 0;
      months.push(key);
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    shelves.forEach((s: any) => {
      if (s.status === 'read') {
        const date = new Date(s.updatedAt); // Using update time as finish time
        const key = date.toLocaleString('default', { month: 'short' });
        if (monthlyBooks[key] !== undefined) {
          monthlyBooks[key]++;
        }
      }
    });

    const monthlyData = months.map(name => ({ name, books: monthlyBooks[name] }));

    return successResponse({ genreData, monthlyData });
  } catch (error) {
    return handleApiError(error);
  }
}
