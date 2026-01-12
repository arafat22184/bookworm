'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ArrowUpDown, ArrowUp, ArrowDown } from 'lucide-react';

type SortOption = 'rating' | 'date' | 'title' | 'author';
type SortOrder = 'asc' | 'desc';

const sortOptions: { value: SortOption; label: string }[] = [
  { value: 'rating', label: 'Rating' },
  { value: 'date', label: 'Date Added' },
  { value: 'title', label: 'Title' },
  { value: 'author', label: 'Author' },
];

export function SortDropdown() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const currentSortBy = (searchParams.get('sortBy') as SortOption) || 'date';
  const currentSortOrder = (searchParams.get('sortOrder') as SortOrder) || 'desc';

  const updateSort = (sortBy: SortOption, sortOrder: SortOrder) => {
    const params = new URLSearchParams(searchParams);
    params.set('sortBy', sortBy);
    params.set('sortOrder', sortOrder);
    params.set('page', '1'); // Reset to first page on sort change
    router.push(`?${params.toString()}`);
  };

  const handleSortByChange = (value: string) => {
    updateSort(value as SortOption, currentSortOrder);
  };

  const toggleSortOrder = () => {
    const newOrder = currentSortOrder === 'asc' ? 'desc' : 'asc';
    updateSort(currentSortBy, newOrder);
  };

  const currentSortLabel = sortOptions.find(opt => opt.value === currentSortBy)?.label || 'Date Added';

  return (
    <div className="flex items-center gap-2">
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="outline" className="gap-2">
            <ArrowUpDown className="h-4 w-4" />
            <span className="hidden sm:inline">Sort by:</span>
            <span className="font-medium">{currentSortLabel}</span>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="w-48">
          <DropdownMenuLabel>Sort by</DropdownMenuLabel>
          <DropdownMenuSeparator />
          <DropdownMenuRadioGroup value={currentSortBy} onValueChange={handleSortByChange}>
            {sortOptions.map((option) => (
              <DropdownMenuRadioItem key={option.value} value={option.value}>
                {option.label}
              </DropdownMenuRadioItem>
            ))}
          </DropdownMenuRadioGroup>
        </DropdownMenuContent>
      </DropdownMenu>

      <Button
        variant="outline"
        size="icon"
        onClick={toggleSortOrder}
        aria-label={`Sort ${currentSortOrder === 'asc' ? 'descending' : 'ascending'}`}
        title={currentSortOrder === 'asc' ? 'Sort descending' : 'Sort ascending'}
      >
        {currentSortOrder === 'asc' ? (
          <ArrowUp className="h-4 w-4" />
        ) : (
          <ArrowDown className="h-4 w-4" />
        )}
      </Button>
    </div>
  );
}
