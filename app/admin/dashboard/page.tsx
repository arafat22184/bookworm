import connectToDatabase from "@/lib/db";
import Book from "@/lib/models/Book";
import User from "@/lib/models/User";
import Review from "@/lib/models/Review";
import Genre from "@/lib/models/Genre";
import Tutorial from "@/lib/models/Tutorial";
import Link from "next/link";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Users, MessageSquare, Video } from "lucide-react";
import { AdminCharts } from "@/components/admin/AdminCharts";

export default async function AdminDashboardPage() {
  await connectToDatabase();

  // Ensure Genre model is registered before populating
  void Genre;

  const booksCount = await Book.countDocuments();
  const usersCount = await User.countDocuments();
  const tutorialsCount = await Tutorial.countDocuments();
  const pendingReviews = await Review.countDocuments({ status: "pending" });

  // User Role Distribution
  const adminCount = await User.countDocuments({ role: "admin" });
  const regularUserCount = await User.countDocuments({ role: "user" });
  const userRoleData = [
    { name: "Admin", value: adminCount },
    { name: "User", value: regularUserCount },
  ];

  /* eslint-disable @typescript-eslint/no-explicit-any */
  const books = await Book.find().populate("genres").lean();
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
  const genreData = Object.entries(genreStats).map(([name, value]) => ({
    name,
    value,
  }));
  /* eslint-enable @typescript-eslint/no-explicit-any */

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Admin Dashboard</h1>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Link href="/admin/books">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Books</CardTitle>
              <BookOpen className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{booksCount}</div>
              <p className="text-xs text-muted-foreground">
                Books in the library
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/users">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Users</CardTitle>
              <Users className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{usersCount}</div>
              <p className="text-xs text-muted-foreground">
                Registered readers
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/reviews">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">
                Pending Reviews
              </CardTitle>
              <MessageSquare className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{pendingReviews}</div>
              <p className="text-xs text-muted-foreground">
                Reviews awaiting approval
              </p>
            </CardContent>
          </Card>
        </Link>

        <Link href="/admin/tutorials">
          <Card className="hover:bg-muted/50 transition-colors cursor-pointer h-full">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Tutorials</CardTitle>
              <Video className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{tutorialsCount}</div>
              <p className="text-xs text-muted-foreground">
                Active video tutorials
              </p>
            </CardContent>
          </Card>
        </Link>
      </div>

      <AdminCharts data={{ genreData, userRoleData }} />
    </div>
  );
}
