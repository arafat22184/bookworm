'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Edit } from 'lucide-react';
import { BookForm, BookFormValues } from './BookForm';

interface Book extends BookFormValues {
  _id: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  match?: any; // To handle any potential type mismatch from parent
}

interface EditBookDialogProps {
  book: Book;
}

export function EditBookDialog({ book }: EditBookDialogProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  // Transform book genres from objects to array of IDs if necessary
  const initialData: BookFormValues = {
    ...book,
     // eslint-disable-next-line @typescript-eslint/no-explicit-any
    genres: book.genres.map((g: any) => typeof g === 'string' ? g : g._id),
  };

  const onSubmit = async (data: BookFormValues) => {
    try {
      const res = await fetch(`/api/books/${book._id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to update book');

      toast.success('Book updated successfully');
      setOpen(false);
      router.refresh();
    } catch {
      toast.error('Failed to update book');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon">
          <Edit className="h-4 w-4" />
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Book</DialogTitle>
          <DialogDescription>
            Make changes to the book details here.
          </DialogDescription>
        </DialogHeader>
        <BookForm 
            initialData={initialData} 
            onSubmit={onSubmit} 
            submitLabel="Save Changes"
        />
      </DialogContent>
    </Dialog>
  );
}
