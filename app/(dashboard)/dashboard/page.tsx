import { getCurrentUser } from "@/lib/session";
import connectToDatabase from "@/lib/db";
import User from "@/lib/models/User";
import Shelf from "@/lib/models/Shelf";
import Review from "@/lib/models/Review";
import { ReadingChallenge } from "@/components/shared/ReadingChallenge";
import { BookCard } from "@/components/shared/BookCard";
import { generateRecommendations } from "@/lib/recommendation";
import { serialize } from "@/lib/utils";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { BookOpen, Star, Sparkles } from "lucide-react";
import { redirect } from "next/navigation";

export default async function UserDashboardPage() {
  const userSession = await getCurrentUser();
  if (!userSession) redirect("/login");

  await connectToDatabase();
  const user = await User.findById(userSession.id).lean();
  // Stats
  const userShelves = await Shelf.find({ user: userSession.id });
  const readBooks = userShelves.filter((shelf) => shelf.status === "read");
  const totalBooksRead = readBooks.length;
  const totalPagesRead = userShelves.reduce(
    (sum, shelf) => sum + (shelf.progress || 0),
    0
  );

  // Calculate average rating
  const userReviews = await Review.find({
    user: userSession.id,
    status: "approved",
  });
  const averageRating =
    userReviews.length > 0
      ? userReviews.reduce((sum, review) => sum + review.rating, 0) /
        userReviews.length
      : 0;

  // Get personalized recommendations
  const recommendations = await generateRecommendations(userSession.id, {
    limit: 15,
    minRating: 3.5,
  });

  const recommendedBooks = serialize(recommendations);

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-serif font-bold">
          Welcome back, {userSession.name}
        </h1>
        <p className="text-muted-foreground">Here is your reading overview.</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {user && (
          <ReadingChallenge
            challenge={{
              ...user.challenge,
              current: totalBooksRead,
              goal: user.challenge?.goal || 0,
              year: user.challenge?.year || new Date().getFullYear(),
            }}
          />
        )}

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Books Read</CardTitle>
            <BookOpen className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalBooksRead}</div>
            {totalBooksRead === 0 && (
              <div className="mt-4 flex flex-col items-center opacity-70">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src="/empty-state.png"
                  alt="No books"
                  className="w-24 h-24 mb-2 opacity-50 grayscale"
                />
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
            <div className="text-2xl font-bold">
              {totalPagesRead.toLocaleString()}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Avg Rating Given
            </CardTitle>
            <Star className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {averageRating > 0 ? averageRating.toFixed(1) : "-"}
            </div>
            {averageRating > 0 && (
              <p className="text-xs text-muted-foreground mt-1">
                Based on {userReviews.length}{" "}
                {userReviews.length === 1 ? "review" : "reviews"}
              </p>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Personalized Recommendations */}
      <div className="space-y-6">
        <div className="flex items-center gap-2">
          <Sparkles className="h-6 w-6 text-primary" />
          <div>
            <h2 className="text-2xl font-serif font-bold">
              Recommended for You
            </h2>
            <p className="text-sm text-muted-foreground">
              {totalBooksRead >= 3
                ? "Based on your reading history and preferences"
                : "Popular books to get you started"}
            </p>
          </div>
        </div>

        {recommendedBooks.length === 0 ? (
          <Card>
            <CardContent className="flex flex-col items-center justify-center py-12">
              <BookOpen className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-semibold mb-2">
                No recommendations yet
              </h3>
              <p className="text-sm text-muted-foreground text-center max-w-md">
                Start reading and rating books to get personalized
                recommendations!
              </p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
            {recommendedBooks.map(
              (rec: {
                book: {
                  _id: string;
                  title: string;
                  author: string;
                  coverImage: string;
                  avgRating: number;
                };
                score: number;
                reason: string;
              }) => (
                <div key={rec.book._id} className="relative group">
                  <BookCard book={rec.book} />
                  {/* Recommendation reason tooltip */}
                  <div className="absolute inset-x-0 bottom-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                    <div className="bg-popover text-popover-foreground p-3 rounded-lg shadow-lg text-xs border mx-2 mb-2">
                      <p className="font-medium mb-1">Why this book?</p>
                      <p className="text-muted-foreground">{rec.reason}</p>
                    </div>
                  </div>
                </div>
              )
            )}
          </div>
        )}
      </div>
    </div>
  );
}
