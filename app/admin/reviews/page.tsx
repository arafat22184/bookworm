
import connectToDatabase from '@/lib/db';
import Review from '@/lib/models/Review';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { ReviewActions } from '@/components/admin/ReviewActions';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function AdminReviewsPage() {
  await connectToDatabase();
  const rawReviews = await Review.find({ status: 'pending' })
    .populate('user', 'name')
    .populate('book', 'title')
    .sort({ createdAt: -1 });
    
  const reviews = serialize(rawReviews);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-serif font-bold">Moderate Reviews</h1>
      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Book</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Comment</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {reviews.map((review: any) => (
              <TableRow key={review._id}>
                <TableCell className="font-medium">{review.book.title}</TableCell>
                <TableCell>{review.user.name}</TableCell>
                <TableCell>{review.rating}/5</TableCell>
                <TableCell className="max-w-xs truncate" title={review.comment}>{review.comment}</TableCell>
                <TableCell>
                    <ReviewActions reviewId={review._id} />
                </TableCell>
              </TableRow>
            ))}
            {reviews.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No pending reviews.
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
