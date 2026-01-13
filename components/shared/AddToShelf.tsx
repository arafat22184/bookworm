"use client";
import { useState, useEffect } from "react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function AddToShelf({
  bookId,
  currentStatus,
}: {
  bookId: string;
  currentStatus?: string;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus || "");

  useEffect(() => {
    // If no initial status provided, fetch it (for static pages)
    if (!currentStatus) {
      fetch(`/api/shelf?bookId=${bookId}`)
        .then((res) => {
          if (res.ok) return res.json();
          return null;
        })
        .then((data) => {
          if (data && data.status) setStatus(data.status);
        })
        .catch(() => {});
    }
  }, [bookId, currentStatus]);

  const handleValueChange = async (val: string) => {
    setStatus(val);
    try {
      const res = await fetch("/api/shelf", {
        method: "POST",
        body: JSON.stringify({ bookId, status: val }),
      });

      if (res.status === 401) {
        toast.error("Please login to add to shelf");
        router.push("/login");
        return;
      }

      if (!res.ok) throw new Error();
      toast.success("Shelf updated");
      router.refresh();
    } catch {
      toast.error("Failed to update shelf");
      setStatus(currentStatus || ""); // Revert on error
    }
  };

  return (
    <div className="space-y-2">
      <label className="text-sm font-medium">Reading Status</label>
      <Select value={status} onValueChange={handleValueChange}>
        <SelectTrigger className="w-full">
          <SelectValue placeholder="Add to Shelf" />
        </SelectTrigger>
        <SelectContent
          onWheel={(e) => e.stopPropagation()}
          onTouchMove={(e) => e.stopPropagation()}
        >
          <SelectItem value="want-to-read">Want to Read</SelectItem>
          <SelectItem value="currently-reading">Currently Reading</SelectItem>
          <SelectItem value="read">Read</SelectItem>
        </SelectContent>
      </Select>
    </div>
  );
}
