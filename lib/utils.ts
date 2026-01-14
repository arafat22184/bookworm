import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"
import { ShelfItem, ReadingStats, Serialized } from './types';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Debounces a function call by the specified wait time
 * @param func - The function to debounce
 * @param waitMs - The number of milliseconds to delay
 * @returns Debounced function
 */
export function debounce<T extends (...args: unknown[]) => unknown>(
  func: T,
  waitMs: number
): (...args: Parameters<T>) => void {
  let timeoutId: NodeJS.Timeout | undefined;

  return (...args: Parameters<T>) => {
    if (timeoutId) {
      clearTimeout(timeoutId);
    }
    timeoutId = setTimeout(() => func(...args), waitMs);
  };
}

/**
 * Formats a date to a human-readable string
 * @param date - The date to format
 * @param format - The format type ('short', 'long', 'relative')
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string,
  format: 'short' | 'long' | 'relative' = 'short'
): string {
  const dateObj = typeof date === 'string' ? new Date(date) : date;

  if (format === 'relative') {
    return getRelativeTimeString(dateObj);
  }

  const options: Intl.DateTimeFormatOptions =
    format === 'long'
      ? { year: 'numeric', month: 'long', day: 'numeric' }
      : { year: 'numeric', month: 'short', day: 'numeric' };

  return dateObj.toLocaleDateString('en-US', options);
}

/**
 * Gets a relative time string (e.g., "2 days ago")
 * @param date - The date to compare
 * @returns Relative time string
 */
function getRelativeTimeString(date: Date): string {
  const now = new Date();
  const diffInMs = now.getTime() - date.getTime();
  const diffInSeconds = Math.floor(diffInMs / 1000);
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  const diffInHours = Math.floor(diffInMinutes / 60);
  const diffInDays = Math.floor(diffInHours / 24);

  if (diffInDays > 30) {
    return formatDate(date, 'short');
  } else if (diffInDays > 0) {
    return `${diffInDays} day${diffInDays > 1 ? 's' : ''} ago`;
  } else if (diffInHours > 0) {
    return `${diffInHours} hour${diffInHours > 1 ? 's' : ''} ago`;
  } else if (diffInMinutes > 0) {
    return `${diffInMinutes} minute${diffInMinutes > 1 ? 's' : ''} ago`;
  } else {
    return 'Just now';
  }
}

/**
 * Calculates the current reading streak in days
 * @param shelves - Array of shelf items
 * @returns Number of consecutive days with reading activity
 */
export function calculateReadingStreak(shelves: ShelfItem[]): number {
  if (shelves.length === 0) return 0;

  // Sort by updatedAt descending
  const sortedShelves = [...shelves].sort(
    (a, b) => new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime()
  );

  let streak = 0;
  let currentDate = new Date();
  currentDate.setHours(0, 0, 0, 0);

  for (const shelf of sortedShelves) {
    const shelfDate = new Date(shelf.updatedAt);
    shelfDate.setHours(0, 0, 0, 0);

    const diffInDays = Math.floor(
      (currentDate.getTime() - shelfDate.getTime()) / (1000 * 60 * 60 * 24)
    );

    if (diffInDays === streak) {
      streak++;
      currentDate = shelfDate;
    } else if (diffInDays > streak) {
      break;
    }
  }

  return streak;
}

/**
 * Calculates comprehensive reading statistics
 * @param shelves - Array of shelf items with populated book data
 * @returns Reading statistics object
 */
export function getReadingStats(shelves: ShelfItem[]): ReadingStats {
  const readBooks = shelves.filter(shelf => shelf.status === 'read');
  const currentYear = new Date().getFullYear();

  // Total books read
  const totalBooksRead = readBooks.length;

  // Total pages read (sum of all progress)
  const totalPagesRead = shelves.reduce((sum, shelf) => sum + (shelf.progress || 0), 0);

  // Books read this year
  const booksThisYear = readBooks.filter(shelf => {
    const shelfYear = new Date(shelf.updatedAt).getFullYear();
    return shelfYear === currentYear;
  }).length;

  // Average rating (would need review data - placeholder for now)
  const averageRating = 0;

  // Favorite genres (would need populated genre data)
  const favoriteGenres: string[] = [];

  // Reading streak
  const readingStreak = calculateReadingStreak(shelves);

  return {
    totalBooksRead,
    totalPagesRead,
    averageRating,
    favoriteGenres,
    readingStreak,
    booksThisYear,
  };
}

/**
 * Serializes MongoDB documents to plain objects
 * @param obj - The object to serialize
 * @returns Serialized object
 */
export function serialize<T>(obj: T): Serialized<T> {
  return JSON.parse(JSON.stringify(obj));
}

/**
 * Generates a URL-friendly slug from a string
 * @param text - The text to slugify
 * @returns URL-friendly slug
 */
export function slugify(text: string): string {
  return text
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Truncates text to a specified length
 * @param text - The text to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add (default: '...')
 * @returns Truncated text
 */
export function truncate(text: string, maxLength: number, suffix = '...'): string {
  if (text.length <= maxLength) return text;
  return text.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Gets the month name abbreviation for a given month offset
 * @param monthOffset - Number of months to offset from current month (negative for past)
 * @returns Month abbreviation (e.g., 'Jan', 'Feb')
 */
export function getMonthName(monthOffset: number): string {
  const currentDate = new Date();
  currentDate.setMonth(currentDate.getMonth() + monthOffset);
  return currentDate.toLocaleString('default', { month: 'short' });
}
