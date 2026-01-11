import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import User from '@/lib/models/User';
import Review from '@/lib/models/Review';
import Genre from '@/lib/models/Genre';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { BookOpen, Users, MessageSquare } from 'lucide-react';
import { AdminCharts } from '@/components/admin/AdminCharts';

export default async function AdminDashboardPage() {
  await connectToDatabase();
  
  // Ensure Genre model is registered before populating
  void Genre;
  
  const booksCount = await Book.countDocuments();
  const usersCount = await User.countDocuments();
  /* eslint-disable @typescript-eslint/no-explicit-any */
  const books = await Book.find().populate('genres').lean();
  const genreStats: Record<string, number> = {};
  books.forEach((book: any) => {
    if (book.genres && Array.isArray(book.genres)) {
      book.genres.forEach((genre: any) => {
        if (genre?.name) {
          genreStats[genre.name] = (genreStats[genre.name] || 0) + 1;
        }
      });
    }
  });
  const genreData = Object.entries(genreStats).map(([name, value]) => ({ name, value }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  const pendingReviews = await Review.countDocuments({ status: 'pending' });


  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>
      
      <div className="grid gap-4 md:grid-cols-3">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Books</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{booksCount}</div>
            <p className="text-xs text-muted-foreground">Books in the library</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{usersCount}</div>
            <p className="text-xs text-muted-foreground">Registered readers</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Reviews</CardTitle>
            <MessageSquare className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingReviews}</div>
            <p className="text-xs text-muted-foreground">Reviews awaiting approval</p>
          </CardContent>
        </Card>
      </div>

      <AdminCharts data={{ genreData }} />
      
    </div>
  );
}
