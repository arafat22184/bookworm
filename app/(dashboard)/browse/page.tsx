import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import Genre from '@/lib/models/Genre';
import { BookCard } from '@/components/shared/BookCard';
import { SearchInput } from '@/components/shared/SearchInput';
import { ScrollArea } from '@/components/ui/scroll-area';

interface BrowsePageProps {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}

const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function BrowsePage({ searchParams }: BrowsePageProps) {
  await connectToDatabase();
  
  // Ensure we register models
  const _ = Genre;

  const params = await searchParams;
  const query = (params.q as string) || '';
  const genre = (params.genre as string) || '';
  const page = Number(params.page) || 1;
  const limit = 12;
  const skip = (page - 1) * limit;

  const filter: any = {};
  if (query) {
    filter.$or = [
      { title: { $regex: query, $options: 'i' } },
      { author: { $regex: query, $options: 'i' } },
    ];
  }
  if (genre) {
    // Need to find genre ID first if passing name, or pass ID. Let's assume ID passed or we lookup.
    // UX is better with names usually, but ID is reliable. Let's support both or just ID.
    // For simplicity, let's assume UI passes ID.
    filter.genres = genre;
  }

  const booksCount = await Book.countDocuments(filter);
  const rawBooks = await Book.find(filter)
    .populate('genres')
    .sort({ createdAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  const books = serialize(rawBooks);
  // const genres = serialize(await Genre.find().lean()); // For Filter UI if implemented

  return (
    <div className="space-y-6">
       <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
         <div>
            <h1 className="text-3xl font-serif font-bold">Browse Books</h1>
            <p className="text-muted-foreground">Discover your next favorite read.</p>
         </div>
         <div className="flex items-center gap-2">
            <SearchInput />
            {/* <GenreFilter genres={genres} /> */}
         </div>
       </div>

       {books.length === 0 ? (
          <div className="text-center py-12 text-muted-foreground">
             No books found matching your criteria.
          </div>
       ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
            {books.map((book: any) => (
              <BookCard key={book._id} book={book} />
            ))}
          </div>
       )}
       
       {/* Pagination Controls could go here */}
    </div>
  );
}
