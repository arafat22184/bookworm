import { notFound } from "next/navigation";
import connectToDatabase from "@/lib/db";
import Book from "@/lib/models/Book";
import Review from "@/lib/models/Review";
import User from "@/lib/models/User";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { Star } from "lucide-react";
import { AddToShelf } from "@/components/shared/AddToShelf";
import { ReviewForm } from "@/components/shared/ReviewForm";
import { SerializedGenre, SerializedReview } from "@/lib/types";

interface BookPageProps {
  params: Promise<{ id: string }>;
}

const serialize = <T extends unknown>(obj: T): T =>
  JSON.parse(JSON.stringify(obj));

export default async function BookPage({ params }: BookPageProps) {
  await connectToDatabase();

  // ensure models
  const _ = User;

  const { id } = await params;

  let book;
  try {
    book = await Book.findById(id).populate("genres").lean();
  } catch {
    notFound();
  }

  if (!book) notFound();

  // Fetch reviews
  const rawReviews = await Review.find({ book: id, status: "approved" })
    .populate("user", "name image")
    .sort({ createdAt: -1 })
    .lean();

  // Shelf status is now fetched client-side component

  const reviews: SerializedReview[] = serialize(
    rawReviews
  ) as unknown as SerializedReview[];
  const serializedBook = serialize(book) as any;

  return (
    <div className="max-w-4xl mx-auto space-y-8">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-4">
          <div className="relative aspect-2/3 w-full md:w-64 overflow-hidden rounded-lg shadow-lg">
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img
              src={serializedBook.coverImage}
              alt={serializedBook.title}
              className="w-full h-full object-cover"
            />
          </div>

          <AddToShelf bookId={id} />
        </div>

        <div className="flex-1 space-y-6">
          <div>
            <h1 className="text-4xl font-serif font-bold mb-2">
              {serializedBook.title}
            </h1>
            <p className="text-xl text-muted-foreground">
              {serializedBook.author}
            </p>
            <div className="flex items-center gap-2 mt-4">
              <div className="flex items-center text-yellow-500">
                <Star className="fill-current w-5 h-5" />
                <span className="ml-1 font-bold text-lg">
                  {serializedBook.avgRating?.toFixed(1) || "N/A"}
                </span>
              </div>
              <span className="text-muted-foreground">
                ({serializedBook.totalRatings || 0} reviews)
              </span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2">
            {serializedBook.genres.map((genre: SerializedGenre) => (
              <Badge key={genre._id} variant="outline">
                {genre.name}
              </Badge>
            ))}
          </div>

          <div>
            <h3 className="font-bold mb-2">Description</h3>
            <p className="leading-relaxed text-muted-foreground whitespace-pre-wrap">
              {serializedBook.description}
            </p>
          </div>
        </div>
      </div>

      <Separator />

      <div className="space-y-6">
        <h2 className="text-2xl font-serif font-bold">Community Reviews</h2>

        <ReviewForm bookId={id} />

        <div className="space-y-6">
          {reviews.map((review: SerializedReview) => {
            const user = review.user || { name: "Deleted User", image: null };
            return (
              <div key={review._id} className="flex gap-4">
                <Avatar>
                  <AvatarImage src={user.image} />
                  <AvatarFallback>{user.name[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                  <div className="flex items-center gap-2">
                    <span className="font-bold">{user.name}</span>
                    <div className="flex text-yellow-500 text-xs">
                      {[...Array(5)].map((_, i) => (
                        <Star
                          key={i}
                          className={`w-3 h-3 ${
                            i < review.rating ? "fill-current" : "text-gray-300"
                          }`}
                        />
                      ))}
                    </div>
                  </div>
                  <p className="text-sm text-gray-700 dark:text-gray-300">
                    {review.comment}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </p>
                </div>
              </div>
            );
          })}
          {reviews.length === 0 && (
            <p className="text-muted-foreground">
              No reviews yet. Be the first to review!
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
