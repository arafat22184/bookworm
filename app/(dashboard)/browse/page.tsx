import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import Genre from '@/lib/models/Genre';
import { BookCard } from '@/components/shared/BookCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { PaginationControls } from '@/components/shared/PaginationControls';
import { GenreFilter } from '@/components/shared/GenreFilter';
import { SortDropdown } from '@/components/shared/SortDropdown';
import { RatingFilter } from '@/components/shared/RatingFilter';
import { serialize } from '@/lib/utils';

interface BrowsePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  await connectToDatabase();
  
  // Ensure Genre model is registered for population
  void Genre;

  const params = await searchParams;
  const searchQuery = (params.q as string) || '';
  const genreFilter = (params.genre as string) || '';
  const minRating = params.minRating ? Number(params.minRating) : undefined;
  const maxRating = params.maxRating ? Number(params.maxRating) : undefined;
  const currentPage = Number(params.page) || 1;
  const booksPerPage = 12;
  const skipCount = (currentPage - 1) * booksPerPage;

  // Build filter object
  const filter: Record<string, unknown> = {};
  
  if (searchQuery) {
    filter.$or = [
      { title: { $regex: searchQuery, $options: 'i' } },
      { author: { $regex: searchQuery, $options: 'i' } },
    ];
  }
  
  if (genreFilter) {
    // Support multiple genres (comma-separated)
    const genreIds = genreFilter.split(',');
    filter.genres = genreIds.length === 1 ? genreIds[0] : { $in: genreIds };
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

  // Fetch books with pagination
  const rawBooks = await Book.find(filter)
    .populate('genres')
    .sort({ createdAt: -1 })
    .skip(skipCount)
    .limit(booksPerPage)
    .lean();

  // Serialize and type as any for now since serialize returns JSON-parsed objects
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const books: any[] = serialize(rawBooks);
  const totalBooks = await Book.countDocuments(filter);
  const totalPages = Math.ceil(totalBooks / booksPerPage);

  // Fetch all genres for filter
  const rawGenres = await Genre.find().sort({ name: 1 }).lean();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const genres: any[] = serialize(rawGenres);

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-serif font-bold">Browse Books</h1>
            <p className="text-muted-foreground">Discover your next favorite read.</p>
         </div>
         <div className="flex items-center gap-2 flex-wrap">
            <SearchInput />
            <GenreFilter genres={genres} />
            <RatingFilter />
            <SortDropdown />
         </div>
       </div>

       {books.length === 0 ? (
          <div className="text-center py-12">
             <div className="text-muted-foreground mb-4">
                No books found matching your criteria.
             </div>
             <p className="text-sm text-muted-foreground">
                Try adjusting your filters or search terms.
             </p>
          </div>
       ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
                {books.map((book: { _id: string; title: string; author: string; coverImage: string; avgRating: number }) => (
                <BookCard key={book._id} book={book} />
              ))}
            </div>
            
            <PaginationControls
              currentPage={currentPage}
              totalPages={totalPages}
              totalItems={totalBooks}
            />
          </>
       )}
    </div>
  );
}


