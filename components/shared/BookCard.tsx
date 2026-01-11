import Link from 'next/link';
import { Star } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import { Progress } from '@/components/ui/progress';

interface BookCardProps {
  book: {
    _id: string;
    title: string;
    author: string;
    coverImage: string;
    avgRating: number;
  };
  progress?: number;
  status?: string;
  totalPages?: number; // If we track total pages per book on Book model, currently not in initial schema but useful. Assuming progress is pages read.
}

export function BookCard({ book, progress, status, totalPages = 300 }: BookCardProps) {
  // Using a placeholder for total pages since it wasn't in the schema explicitly but progress is pages.
  // We'll calculate percentage based on an assumed average or if Book model has totalPages later.
  // For now, let's just show progress as a number or percentage if we had total.
  
  return (
    <Link href={`/book/${book._id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-zinc-200 dark:border-zinc-800">
        <div className="aspect-[2/3] relative overflow-hidden">
           {/* Replace with Next.js Image if domain configured, else img */}
           {/* eslint-disable-next-line @next/next/no-img-element */}
           <img 
             src={book.coverImage} 
             alt={book.title} 
             className="object-cover w-full h-full group-hover:scale-105 transition-transform duration-300"
           />
           {status && (
             <Badge className="absolute top-2 right-2 capitalize" variant="secondary">
               {status.replace(/-/g, ' ')}
             </Badge>
           )}
        </div>
        <CardContent className="p-4 space-y-1">
          <h3 className="font-serif font-bold truncate" title={book.title}>{book.title}</h3>
          <p className="text-sm text-muted-foreground truncate">{book.author}</p>
          <div className="flex items-center gap-1 text-sm text-yellow-500">
            <Star className="h-4 w-4 fill-current" />
            <span>{book.avgRating.toFixed(1)}</span>
          </div>
        </CardContent>
        {progress !== undefined && (
          <CardFooter className="p-4 pt-0">
             <div className="w-full space-y-1">
               <div className="flex justify-between text-xs text-muted-foreground">
                 <span>{progress} pages read</span>
                 {/* <span>{Math.round((progress / totalPages) * 100)}%</span> */}
               </div>
               <Progress value={(progress / totalPages) * 100} className="h-1.5" />
             </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}
