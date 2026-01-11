'use client';

import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

// Implementing simple manual debounce to avoid extra dep for now
function useDebounce(callback: (...args: any[]) => void, delay: number) {
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const debounce = (func: Function, wait: number) => {
    let timeout: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timeout);
function debounce<T extends (...args: any[]) => void>(func: T, wait: number) {
  let timeout: NodeJS.Timeout;
  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function SearchInput({ onSearch, placeholder = 'Search...', initialValue = '' }: any) {
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
  
  // Actually implementing debounce efficiently inside component
  const debouncedSearch = useDebounce(handleSearch, 300);

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
