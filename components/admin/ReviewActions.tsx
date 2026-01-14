"use client";

import { Button } from "@/components/ui/button";
import { Check, X, Trash2 } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { useState } from "react";

export function ReviewActions({
  reviewId,
  status,
}: {
  reviewId: string;
  status: string;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const updateStatus = async (newStatus: string) => {
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: newStatus }),
      });
      if (!res.ok) throw new Error();
      toast.success(`Review ${newStatus}`);
      router.refresh();
    } catch {
      toast.error("Failed to update review status");
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/reviews/${reviewId}`, {
        method: "DELETE",
      });
      if (!res.ok) throw new Error();
      toast.success("Review deleted successfully");
      router.refresh();
    } catch {
      toast.error("Failed to delete review");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex gap-2">
      {status !== "approved" && (
        <Button
          size="icon"
          variant="outline"
          className="text-green-600 hover:text-green-700"
          onClick={() => updateStatus("approved")}
          title="Approve"
        >
          <Check className="h-4 w-4" />
        </Button>
      )}
      {status !== "rejected" && (
        <Button
          size="icon"
          variant="outline"
          className="text-red-600 hover:text-red-700"
          onClick={() => updateStatus("rejected")}
          title="Reject"
        >
          <X className="h-4 w-4" />
        </Button>
      )}

      <AlertDialog>
        <AlertDialogTrigger asChild>
          <Button
            size="icon"
            variant="outline"
            className="text-destructive hover:text-destructive/90"
            title="Delete"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </AlertDialogTrigger>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete this
              review.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive hover:bg-destructive/90"
              disabled={loading}
            >
              {loading ? "Deleting..." : "Delete"}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}
