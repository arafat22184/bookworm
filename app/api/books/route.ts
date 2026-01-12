import { NextRequest } from 'next/server';
import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import Genre from '@/lib/models/Genre';
import { successResponse, handleApiError, forbiddenResponse } from '@/lib/api-utils';
import { BookFilters } from '@/lib/types';

export async function GET(request: NextRequest) {
  try {
    await connectToDatabase();

    // Ensure Genre model is registered for population
    void Genre;

    const { searchParams } = new URL(request.url);

    // Parse query parameters
    const searchQuery = searchParams.get('q') || '';
    const genreFilter = searchParams.get('genre');
    const minRating = Number(searchParams.get('minRating')) || undefined;
    const maxRating = Number(searchParams.get('maxRating')) || undefined;
    const sortBy = (searchParams.get('sortBy') as BookFilters['sortBy']) || 'date';
    const sortOrder = (searchParams.get('sortOrder') as 'asc' | 'desc') || 'desc';
    const page = Number(searchParams.get('page')) || 1;
    const limit = Number(searchParams.get('limit')) || 20;
    const skip = (page - 1) * limit;

    // Build filter object
    const filter: Record<string, unknown> = {};

    // Search by title or author
    if (searchQuery) {
      filter.$or = [
        { title: { $regex: searchQuery, $options: 'i' } },
        { author: { $regex: searchQuery, $options: 'i' } },
      ];
    }

    // Filter by genre
    if (genreFilter) {
      filter.genres = genreFilter;
    }

    // Filter by rating range
    if (minRating !== undefined || maxRating !== undefined) {
      filter.avgRating = {};
      if (minRating !== undefined) {
        (filter.avgRating as Record<string, number>).$gte = minRating;
      }
      if (maxRating !== undefined) {
        (filter.avgRating as Record<string, number>).$lte = maxRating;
      }
    }

    // Build sort object
    const sortOptions: Record<string, 1 | -1> = {};
    const sortDirection = sortOrder === 'asc' ? 1 : -1;

    switch (sortBy) {
      case 'rating':
        sortOptions.avgRating = sortDirection;
        break;
      case 'title':
        sortOptions.title = sortDirection;
        break;
      case 'author':
        sortOptions.author = sortDirection;
        break;
      case 'date':
      default:
        sortOptions.createdAt = sortDirection;
        break;
    }

    // Execute query
    const books = await Book.find(filter)
      .populate('genres')
      .sort(sortOptions)
      .skip(skip)
      .limit(limit)
      .lean();

    const totalBooks = await Book.countDocuments(filter);
    const totalPages = Math.ceil(totalBooks / limit);

    return successResponse({
      books,
      pagination: {
        total: totalBooks,
        page,
        pages: totalPages,
        hasMore: page < totalPages,
      },
    });
  } catch (error) {
    return handleApiError(error);
  }
}

export async function POST(request: NextRequest) {
  try {
    const currentUser = await getCurrentUser();

    if (!currentUser || currentUser.role !== 'admin') {
      return forbiddenResponse('Only admins can create books');
    }

    await connectToDatabase();
    const bookData = await request.json();

    const newBook = await Book.create(bookData);

    return successResponse(
      { book: newBook },
      'Book created successfully',
      201
    );
  } catch (error) {
    return handleApiError(error);
  }
}

