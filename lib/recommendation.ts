import connectToDatabase from './db';
import Book from './models/Book';
import Shelf from './models/Shelf';
import Review from './models/Review';
import Genre from './models/Genre';
import {
  GenrePreference,
  RecommendationResult,
  RecommendationOptions,
  BookWithGenres,
} from './types';

/**
 * Analyzes user's reading history to determine genre preferences
 * @param userId - The user's ID
 * @returns Array of genre preferences with weights
 */
async function analyzeGenrePreferences(userId: string): Promise<GenrePreference[]> {
  await connectToDatabase();

  // Get all books the user has read
  const readShelves = await Shelf.find({
    user: userId,
    status: 'read',
  }).populate({
    path: 'book',
    populate: { path: 'genres' },
  });

  // Get user's reviews to factor in ratings
  const userReviews = await Review.find({ user: userId, status: 'approved' });
  const reviewMap = new Map(
    userReviews.map(review => [review.book.toString(), review.rating])
  );

  const genreStats = new Map<string, { count: number; totalRating: number }>();

  // Analyze each read book
  for (const shelf of readShelves) {
    const book = shelf.book as unknown as BookWithGenres;
    if (!book || !book.genres) continue;

    const userRating = reviewMap.get(book._id.toString()) || book.avgRating || 3;

    for (const genre of book.genres) {
      const genreId = genre._id.toString();
      const current = genreStats.get(genreId) || { count: 0, totalRating: 0 };

      genreStats.set(genreId, {
        count: current.count + 1,
        totalRating: current.totalRating + userRating,
      });
    }
  }

  // Convert to preferences with weights
  const preferences: GenrePreference[] = [];

  for (const [genreId, stats] of genreStats.entries()) {
    const genre = await Genre.findById(genreId);
    if (!genre) continue;

    const averageRating = stats.totalRating / stats.count;
    // Weight = frequency * average rating (normalized)
    const weight = (stats.count * averageRating) / 5;

    preferences.push({
      genreId,
      genreName: genre.name,
      count: stats.count,
      averageRating,
      weight,
    });
  }

  // Sort by weight descending
  return preferences.sort((a, b) => b.weight - a.weight);
}

/**
 * Generates personalized book recommendations for a user
 * @param userId - The user's ID
 * @param options - Recommendation options (limit, exclusions, etc.)
 * @returns Array of recommended books with scores and reasons
 */
export async function generateRecommendations(
  userId: string,
  options: RecommendationOptions = {}
): Promise<RecommendationResult[]> {
  const {
    limit = 18,
    excludeBookIds = [],
    minRating = 3.5,
  } = options;

  await connectToDatabase();

  // Ensure Genre model is registered
  void Genre;

  // Get user's reading history
  const userShelves = await Shelf.find({ user: userId });
  const readBookIds = userShelves.map(shelf => shelf.book.toString());
  const allExcludedIds = [...readBookIds, ...excludeBookIds];

  // Analyze genre preferences
  const genrePreferences = await analyzeGenrePreferences(userId);

  // If user has less than 3 read books, use fallback recommendations
  if (genrePreferences.length === 0 || userShelves.length < 3) {
    return getFallbackRecommendations(allExcludedIds, limit, minRating);
  }

  // Get top 3 preferred genres
  const topGenres = genrePreferences.slice(0, 3);
  const genreIds = topGenres.map(pref => pref.genreId);

  // Find books in preferred genres
  const candidateBooks = await Book.find({
    _id: { $nin: allExcludedIds },
    genres: { $in: genreIds },
    avgRating: { $gte: minRating },
  })
    .populate('genres')
    .limit(limit * 2) // Get more candidates for scoring
    .lean();

  // Score each book
  const scoredBooks: RecommendationResult[] = candidateBooks.map(book => {
    let score = 0;
    const matchedGenres: string[] = [];

    // Calculate score based on genre matches and weights
    for (const genre of book.genres as unknown as { _id: string; name: string }[]) {
      const preference = genrePreferences.find(
        pref => pref.genreId === genre._id.toString()
      );

      if (preference) {
        score += preference.weight;
        matchedGenres.push(genre.name);
      }
    }

    // Boost score based on book's average rating
    score += (book.avgRating / 5) * 2;

    // Boost score based on popularity (number of ratings)
    score += Math.min(book.totalRatings / 100, 1);

    // Generate recommendation reason
    const reason = generateRecommendationReason(
      matchedGenres,
      book.avgRating,
      genrePreferences
    );

    return {
      book: book as unknown as BookWithGenres,
      score,
      reason,
    };
  });

  // Sort by score and return top recommendations
  return scoredBooks
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

/**
 * Generates fallback recommendations for new users
 * @param excludeBookIds - Book IDs to exclude
 * @param limit - Number of recommendations
 * @param minRating - Minimum rating threshold
 * @returns Array of recommended books
 */
async function getFallbackRecommendations(
  excludeBookIds: string[],
  limit: number,
  minRating: number
): Promise<RecommendationResult[]> {
  await connectToDatabase();

  // Get popular, highly-rated books
  const popularBooks = await Book.find({
    _id: { $nin: excludeBookIds },
    avgRating: { $gte: minRating },
    totalRatings: { $gte: 5 },
  })
    .populate('genres')
    .sort({ totalRatings: -1, avgRating: -1 })
    .limit(limit)
    .lean();

  return popularBooks.map(book => ({
    book: book as unknown as BookWithGenres,
    score: book.avgRating + (book.totalRatings / 100),
    reason: `Popular choice with ${book.avgRating.toFixed(1)}⭐ rating from ${book.totalRatings} readers`,
  }));
}

/**
 * Generates a human-readable reason for the recommendation
 * @param matchedGenres - Genres that matched user preferences
 * @param rating - Book's average rating
 * @param preferences - User's genre preferences
 * @returns Recommendation reason string
 */
function generateRecommendationReason(
  matchedGenres: string[],
  rating: number,
  preferences: GenrePreference[]
): string {
  if (matchedGenres.length === 0) {
    return `Highly rated (${rating.toFixed(1)}⭐) and popular among readers`;
  }

  const topMatchedGenre = matchedGenres[0];
  const preference = preferences.find(p => p.genreName === topMatchedGenre);

  if (!preference) {
    return `Great ${matchedGenres.join(', ')} book with ${rating.toFixed(1)}⭐ rating`;
  }

  const reasons: string[] = [];

  // Genre match reason
  if (matchedGenres.length === 1) {
    reasons.push(`You enjoyed ${preference.count} ${topMatchedGenre} ${preference.count === 1 ? 'book' : 'books'}`);
  } else {
    reasons.push(`Matches your taste in ${matchedGenres.slice(0, 2).join(' and ')}`);
  }

  // Rating reason
  if (rating >= 4.5) {
    reasons.push(`exceptional ${rating.toFixed(1)}⭐ rating`);
  } else if (rating >= 4.0) {
    reasons.push(`${rating.toFixed(1)}⭐ rating`);
  }

  return reasons.join(' • ');
}

/**
 * Gets quick recommendations without detailed analysis (for performance)
 * @param userId - The user's ID
 * @param limit - Number of recommendations
 * @returns Array of recommended books
 */
export async function getQuickRecommendations(
  userId: string,
  limit = 12
): Promise<BookWithGenres[]> {
  const recommendations = await generateRecommendations(userId, { limit });
  return recommendations.map(rec => rec.book);
}
