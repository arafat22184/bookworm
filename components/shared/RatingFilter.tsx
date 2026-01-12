'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Star, X } from 'lucide-react';
import { Badge } from '@/components/ui/badge';

export function RatingFilter() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [minRating, setMinRating] = useState<number>(0);
  const [maxRating, setMaxRating] = useState<number>(5);

  // Initialize from URL
  useEffect(() => {
    const minParam = searchParams.get('minRating');
    const maxParam = searchParams.get('maxRating');
    
    if (minParam) setMinRating(Number(minParam));
    if (maxParam) setMaxRating(Number(maxParam));
  }, [searchParams]);

  const applyFilter = () => {
    const params = new URLSearchParams(searchParams);
    
    if (minRating > 0) {
      params.set('minRating', minRating.toString());
    } else {
      params.delete('minRating');
    }
    
    if (maxRating < 5) {
      params.set('maxRating', maxRating.toString());
    } else {
      params.delete('maxRating');
    }
    
    params.set('page', '1'); // Reset to first page
    router.push(`?${params.toString()}`);
  };

  const clearFilter = () => {
    setMinRating(0);
    setMaxRating(5);
    
    const params = new URLSearchParams(searchParams);
    params.delete('minRating');
    params.delete('maxRating');
    params.set('page', '1');
    router.push(`?${params.toString()}`);
  };

  const hasActiveFilter = minRating > 0 || maxRating < 5;

  const renderStars = (rating: number, onClick: (value: number) => void, label: string) => {
    return (
      <div className="space-y-2">
        <label className="text-sm font-medium">{label}</label>
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <button
              key={star}
              type="button"
              onClick={() => onClick(star)}
              className="focus:outline-none focus:ring-2 focus:ring-primary rounded"
              aria-label={`${label} ${star} stars`}
            >
              <Star
                className={`h-6 w-6 transition-colors ${
                  star <= rating
                    ? 'fill-yellow-400 text-yellow-400'
                    : 'text-gray-300 dark:text-gray-600'
                }`}
              />
            </button>
          ))}
          <span className="ml-2 text-sm text-muted-foreground">
            {rating === 0 ? 'Any' : `${rating}+`}
          </span>
        </div>
      </div>
    );
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" className="gap-2">
          <Star className="h-4 w-4" />
          <span className="hidden sm:inline">Rating</span>
          {hasActiveFilter && (
            <Badge variant="secondary" className="ml-1 px-1.5 py-0 text-xs">
              {minRating > 0 && maxRating < 5
                ? `${minRating}-${maxRating}⭐`
                : minRating > 0
                ? `${minRating}+⭐`
                : `≤${maxRating}⭐`}
            </Badge>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-72">
        <div className="flex items-center justify-between px-2 py-1.5">
          <DropdownMenuLabel className="p-0">Filter by Rating</DropdownMenuLabel>
          {hasActiveFilter && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilter}
              className="h-auto p-1 text-xs"
            >
              <X className="h-3 w-3 mr-1" />
              Clear
            </Button>
          )}
        </div>
        <DropdownMenuSeparator />
        <div className="p-4 space-y-4">
          {renderStars(minRating, setMinRating, 'Minimum Rating')}
          {renderStars(maxRating, setMaxRating, 'Maximum Rating')}
          
          <Button onClick={applyFilter} className="w-full" size="sm">
            Apply Filter
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
