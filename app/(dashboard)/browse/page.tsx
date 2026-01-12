import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import Genre from '@/lib/models/Genre';
import { BookCard } from '@/components/shared/BookCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { BookWithGenres } from '@/lib/types';
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
    // Assuming genreFilter is the genre ID
    // For better UX, you might want to support genre names too
    filter.genres = genreFilter;
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

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-serif font-bold">Browse Books</h1>
            <p className="text-muted-foreground">Discover your next favorite read.</p>
         </div>
         <div className="flex items-center gap-2">
            <SearchInput />
            {/* TODO: Add GenreFilter and SortDropdown components */}
         </div>
       </div>

       {books.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
             No books found matching your criteria.
          </div>
       ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {books.map((book: { _id: string; title: string; author: string; coverImage: string; avgRating: number }) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
       )}
       
       {/* TODO: Add PaginationControls component */}
       {totalPages > 1 && (
         <div className="flex justify-center gap-2 mt-8">
           <p className="text-sm text-muted-foreground">
             Page {currentPage} of {totalPages} ({totalBooks} books total)
           </p>
         </div>
       )}
    </div>
  );
}

