
import connectToDatabase from '@/lib/db';
import Book from '@/lib/models/Book';
import { AddBookDialog } from '@/components/admin/AddBookDialog';
import { AddGenreDialog } from '@/components/admin/AddGenreDialog';
import { EditBookDialog } from '@/components/admin/EditBookDialog';
import { DeleteBookDialog } from '@/components/admin/DeleteBookDialog';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
const serialize = (obj: any) => JSON.parse(JSON.stringify(obj));

export default async function AdminBooksPage() {
  await connectToDatabase();
  
  const rawBooks = await Book.find().populate('genres').sort({ createdAt: -1 });
  const books = serialize(rawBooks);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-serif font-bold">Manage Books</h1>
        <div className="flex gap-2">
            <AddGenreDialog />
            <AddBookDialog />
        </div>
      </div>

      <div className="border rounded-md">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Author</TableHead>
              <TableHead>Genres</TableHead>
              <TableHead>Rating</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
            {books.map((book: any) => (
              <TableRow key={book._id}>
                <TableCell className="font-medium">{book.title}</TableCell>
                <TableCell>{book.author}</TableCell>
                <TableCell>
                  <div className="flex flex-wrap gap-1">
                    {/* eslint-disable-next-line @typescript-eslint/no-explicit-any */}
                    {book.genres.map((g: any) => (
                      <Badge key={g._id} variant="secondary" className="text-xs">
                        {g.name}
                      </Badge>
                    ))}
                  </div>
                </TableCell>
                <TableCell>{book.avgRating?.toFixed(1) || 'N/A'}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    <EditBookDialog book={book} />
                    <DeleteBookDialog bookId={book._id} bookTitle={book.title} />
                  </div>
                </TableCell>
              </TableRow>
            ))}
             {books.length === 0 && (
                <TableRow>
                    <TableCell colSpan={5} className="text-center h-24 text-muted-foreground">
                        No books found. Add some!
                    </TableCell>
                </TableRow>
             )}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
