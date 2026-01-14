import connectToDatabase from "@/lib/db";
import Review from "@/lib/models/Review";
import Book from "@/lib/models/Book";
import User from "@/lib/models/User";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { ReviewActions } from "@/components/admin/ReviewActions";

const serialize = <T,>(obj: T): T => JSON.parse(JSON.stringify(obj));

export default async function AdminReviewsPage() {
  await connectToDatabase();

  void Book;
  void User;

  const rawReviews = await Review.find({})
    .populate("user", "name")
    .populate("book", "title")
    .sort({ createdAt: -1 });

  const reviews: Array<{
    _id: string;
    book: { title: string } | null;
    user: { name: string } | null;
    rating: number;
    comment: string;
    status: string;
  }> = serialize(rawReviews) as unknown as Array<{
    _id: string;
    book: { title: string } | null;
    user: { name: string } | null;
    rating: number;
    comment: string;
    status: string;
  }>;

  const getStatusBadge = (status: string) => {
    const variants: Record<
      string,
      {
        variant: "default" | "secondary" | "destructive" | "outline";
        label: string;
      }
    > = {
      pending: { variant: "secondary", label: "Pending" },
      approved: { variant: "default", label: "Approved" },
      rejected: { variant: "destructive", label: "Rejected" },
    };
    const config = variants[status] || variants.pending;
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Manage Reviews</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {reviews.map((review) => (
              <TableRow key={review._id}>
                <TableCell className="font-medium">
                  {review.book?.title || (
                    <span className="text-muted-foreground italic">
                      Deleted Book
                    </span>
                  )}
                </TableCell>
                <TableCell>
                  {review.user?.name || (
                    <span className="text-muted-foreground italic">
                      Deleted User
                    </span>
                  )}
                </TableCell>
                <TableCell>{review.rating}/5</TableCell>
                <TableCell className="max-w-xs truncate" title={review.comment}>
                  {review.comment}
                </TableCell>
                <TableCell>{getStatusBadge(review.status)}</TableCell>
                <TableCell>
                  <ReviewActions reviewId={review._id} status={review.status} />
                </TableCell>
              </TableRow>
            ))}
            {reviews.length === 0 && (
              <TableRow>
                <TableCell
                  colSpan={6}
                  className="text-center h-24 text-muted-foreground"
                >
                  No reviews found.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
