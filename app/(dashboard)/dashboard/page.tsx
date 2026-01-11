import { getCurrentUser } from '@/lib/session';
import connectToDatabase from '@/lib/db';
import User from '@/lib/models/User';
import Book from '@/lib/models/Book';
import Shelf from '@/lib/models/Shelf';
import { ReadingChallenge } from '@/components/shared/ReadingChallenge';
import { BookCard } from '@/components/shared/BookCard';
import { UserCharts } from '@/components/shared/UserCharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Star, TrendingUp } from 'lucide-react';
import { redirect } from 'next/navigation';

const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function UserDashboardPage() {
  const userSession = await getCurrentUser();
  if (!userSession) redirect('/login');

  await connectToDatabase();
  const user = await User.findById(userSession.id).lean();
  
  // Re-fetch to ensure user model data like challenge is fresh if modified elsewhere
  // Actually userSession might be stale if challenge updated via API but session not refreshed.
  // We use `user` from DB.

  // Stats
  const shelves = await Shelf.find({ user: userSession.id });
  const readBooks = shelves.filter((s) => s.status === 'read');
  const totalRead = readBooks.length;
  // If we had pagesRead in Shelf history, we'd sum it. For now, sum of progress of ALL books? 
  // User wants "Pages read".
  const totalPages = shelves.reduce((acc, curr) => acc + (curr.progress || 0), 0);

  // Recommendations: Top Rated & New
  const rawTopRated = await Book.find().sort({ avgRating: -1 }).limit(5).lean();
  const rawNewest = await Book.find().sort({ createdAt: -1 }).limit(5).lean();

  const topRated = serialize(rawTopRated);
  const newest = serialize(rawNewest);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">Welcome back, {userSession.name}</h1>
        <p className="text-muted-foreground">Here is your reading overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {user && user.challenge && <ReadingChallenge challenge={user.challenge} />}
        
        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Books Read</CardTitle>
             <BookOpen className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{totalRead}</div>
             {totalRead === 0 && (
                <div className="mt-4 flex flex-col items-center opacity-70">
                    <img src="/empty-state.png" alt="No books" className="w-24 h-24 mb-2 opacity-50 grayscale" />
                    <p className="text-xs text-muted-foreground">Start reading!</p>
                </div>
             )}
           </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Pages Read</CardTitle>
             <BookOpen className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">{totalPages}</div>
           </CardContent>
        </Card>

        <Card>
           <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
             <CardTitle className="text-sm font-medium">Avg Rating Given</CardTitle>
             <Star className="h-4 w-4 text-muted-foreground" />
           </CardHeader>
           <CardContent>
             <div className="text-2xl font-bold">-</div> 
             {/* We need to fetch reviews to calc this, skipped for perf or do separate agg */}
           </CardContent>
        </Card>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">Top Rated Books</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {topRated.map((book: any) => (
                <BookCard key={book._id} book={book} />
            ))}
        </div>
      </div>

      <div className="space-y-6">
        <div className="flex items-center justify-between">
            <h2 className="text-2xl font-serif font-bold">New Arrivals</h2>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {newest.map((book: any) => (
                <BookCard key={book._id} book={book} />
            ))}
        </div>
      </div>
    </div>
  );
}
