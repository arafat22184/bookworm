'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback, useRef } from 'react';

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const timeoutRef = useRef<NodeJS.Timeout | undefined>(undefined);

  const handleSearch = useCallback((searchTerm: string) => {
    const params = new URLSearchParams(searchParams);
    
    if (searchTerm) {
      params.set('q', searchTerm);
    } else {
      params.delete('q');
    }
    
    // Reset page to 1 on new search
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  }, [searchParams, router]);
  
  const debouncedSearch = useCallback((searchTerm: string) => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
    timeoutRef.current = setTimeout(() => {
      handleSearch(searchTerm);
    }, 300);
  }, [handleSearch]);

  return (
    <div className="relative">
      <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
      <Input
        type="search"
        placeholder="Search by title or author..."
        className="pl-8 w-full md:w-[300px]"
        defaultValue={searchParams.get('q')?.toString()}
        onChange={(e) => debouncedSearch(e.target.value)}
      />
    </div>
  );
}


