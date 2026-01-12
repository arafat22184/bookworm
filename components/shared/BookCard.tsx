import Link from 'next/link';
import Image from 'next/image';
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
  totalPages?: number;
}

export function BookCard({ book, progress, status, totalPages = 300 }: BookCardProps) {
  const progressPercentage = progress && totalPages ? (progress / totalPages) * 100 : 0;
  
  return (
    <Link href={`/book/${book._id}`}>
      <Card className="h-full overflow-hidden hover:shadow-lg transition-shadow border-zinc-200 dark:border-zinc-800 group">
        <div className="aspect-[2/3] relative overflow-hidden bg-muted">
           <Image 
             src={book.coverImage} 
             alt={book.title}
             fill
             sizes="(max-width: 768px) 50vw, (max-width: 1024px) 33vw, 20vw"
             className="object-cover group-hover:scale-105 transition-transform duration-300"
             priority={false}
           />
           {status && (
             <Badge className="absolute top-2 right-2 capitalize z-10" variant="secondary">
               {status.replace(/-/g, ' ')}
             </Badge>
           )}
        </div>
        <CardContent className="p-4 space-y-1">
          <h3 className="font-serif font-bold truncate" title={book.title}>
            {book.title}
          </h3>
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
                 {totalPages && (
                   <span>{Math.round(progressPercentage)}%</span>
                 )}
               </div>
               <Progress value={progressPercentage} className="h-1.5" />
             </div>
          </CardFooter>
        )}
      </Card>
    </Link>
  );
}

