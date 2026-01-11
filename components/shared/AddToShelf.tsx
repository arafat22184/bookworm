'use client';
import { useState } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from 'next/navigation';

export function AddToShelf({ bookId, currentStatus }: { bookId: string, currentStatus?: string }) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || '');

  const handleValueChange = async (val: string) => {
    setStatus(val);
    try {
        const res = await fetch('/api/shelf', {
            method: 'POST',
            body: JSON.stringify({ bookId, status: val }),
        });
        if (!res.ok) throw new Error();
        toast.success("Shelf updated");
        router.refresh();
    } catch (_e) {
        toast.error("Failed to update shelf");
    }
  };

  return (
      <div className="space-y-2">
        <label className="text-sm font-medium">Reading Status</label>
        <Select value={status} onValueChange={handleValueChange}>
            <SelectTrigger className="w-full">
                <SelectValue placeholder="Add to Shelf" />
            </SelectTrigger>
            <SelectContent>
                <SelectItem value="want-to-read">Want to Read</SelectItem>
                <SelectItem value="currently-reading">Currently Reading</SelectItem>
                <SelectItem value="read">Read</SelectItem>
            </SelectContent>
        </Select>
      </div>
  );
}
