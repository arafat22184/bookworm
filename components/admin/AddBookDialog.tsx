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
import { Plus } from 'lucide-react';
import { BookForm, BookFormValues } from './BookForm';

export function AddBookDialog() {
  const router = useRouter();
  const [open, setOpen] = useState(false);

  const onSubmit = async (data: BookFormValues) => {
    try {
      const res = await fetch('/api/books', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(data),
      });

      if (!res.ok) throw new Error('Failed to create book');

      toast.success('Book created successfully');
      setOpen(false);
      router.refresh();
    } catch {
      toast.error('Failed to create book');
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          Add Book
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Add New Book</DialogTitle>
          <DialogDescription>
            Add a book to the library database.
          </DialogDescription>
        </DialogHeader>
        <BookForm onSubmit={onSubmit} />
      </DialogContent>
    </Dialog>
  );
}
