'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useCallback } from 'react';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
function debounce(func: any, wait: number) {
  let timeout: NodeJS.Timeout | undefined;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return (...args: any[]) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

export function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const handleSearch = (term: string) => {
    const params = new URLSearchParams(searchParams);
    if (term) {
      params.set('q', term);
    } else {
      params.delete('q');
    }
    // Reset page to 1 on new search
    params.set('page', '1');
    router.replace(`?${params.toString()}`);
  };
  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debouncedSearch = useCallback(
    debounce((term: string) => {
      handleSearch(term);
    }, 300),
    [searchParams, router] // Dependencies for handleSearch logic
  );

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
