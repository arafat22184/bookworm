import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import Genre from '@/lib/models/Genre';
import { successResponse, handleApiError, errorResponse } from '@/lib/api-utils';

export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    // Ensure Genre model registration
    const _ = Genre;

    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || '';
    const genre = searchParams.get('genre');
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    const filter: any = {};
    if (query) {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { author: { $regex: query, $options: 'i' } },
      ];
    }
    if (genre) {
      filter.genres = genre;
    }

    const books = await Book.find(filter)
      .populate('genres')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    const total = await Book.countDocuments(filter);

    return successResponse({ books, total, page, pages: Math.ceil(total / limit) });
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

    const book = await Book.create(body);

    return successResponse({ book }, 201);
  } catch (error) {
    return handleApiError(error);
  }
}
