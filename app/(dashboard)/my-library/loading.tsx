import { BookGridSkeleton } from '@/components/shared/LoadingSkeletons';
import { Skeleton } from '@/components/ui/skeleton';

export default function MyLibraryLoading() {
  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <Skeleton className="h-9 w-48 mb-2" />
        <Skeleton className="h-5 w-64" />
      </div>

      {/* Tabs */}
      <div className="flex gap-2">
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
        <Skeleton className="h-10 w-32" />
      </div>

      {/* Books Grid */}
      <BookGridSkeleton />
    </div>
  );
}
