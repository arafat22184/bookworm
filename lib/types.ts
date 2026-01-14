import { Types } from 'mongoose';

// JWT Payload Types
export interface JwtPayload {
  userId: string;
  role: 'user' | 'admin';
  iat?: number;
  exp?: number;
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  message: string;
  data?: T;
}

export interface ApiError {
  success: false;
  message: string;
  errors?: Record<string, string[]>;
}

// User Types
export interface UserSession {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string;
}

export interface ReadingChallenge {
  year: number;
  goal: number;
  current: number;
}

export interface ProfileResponse {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string;
  challenge: ReadingChallenge;
}


// Book Types
export interface PopulatedGenre {
  _id: string;
  name: string;
  description?: string;
  slug?: string;
}

export interface BookWithGenres {
  _id: string;
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: PopulatedGenre[];
  avgRating: number;
  totalRatings: number;
  totalPages?: number;
  publishedYear?: number;
  isbn?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface BookCardData {
  _id: string;
  title: string;
  author: string;
  coverImage: string;
  avgRating: number;
  totalPages?: number;
}

// Shelf Types
export type ShelfStatus = 'want-to-read' | 'currently-reading' | 'read';

export interface ShelfItem {
  _id: string;
  user: Types.ObjectId | string;
  book: Types.ObjectId | BookWithGenres;
  status: ShelfStatus;
  progress: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedShelfItem {
  _id: string;
  user: string;
  book: BookWithGenres;
  status: ShelfStatus;
  progress: number;
  createdAt: string;
  updatedAt: string;
}

// Review Types
export type ReviewStatus = 'pending' | 'approved' | 'rejected';

export interface ReviewData {
  _id: string;
  user: Types.ObjectId | UserSession;
  book: Types.ObjectId | BookWithGenres;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: Date;
  updatedAt: Date;
}

export interface PopulatedReview {
  _id: string;
  user: {
    _id: string;
    name: string;
    image?: string;
  };
  book: string | BookWithGenres;
  rating: number;
  comment: string;
  status: ReviewStatus;
  createdAt: string;
  updatedAt: string;
}

// Tutorial Types
export interface Tutorial {
  _id: string;
  title: string;
  description: string;
  videoUrl: string;
  createdAt: string;
  updatedAt: string;
}

// User Admin Types
export interface AdminUserData {
  _id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  image?: string;
  createdAt: string;
  updatedAt: string;
}

// Recommendation Types
export interface GenrePreference {
  genreId: string;
  genreName: string;
  count: number;
  averageRating: number;
  weight: number;
}

export interface RecommendationResult {
  book: BookWithGenres;
  score: number;
  reason: string;
}

export interface RecommendationOptions {
  limit?: number;
  excludeBookIds?: string[];
  minRating?: number;
}

// Statistics Types
export interface GenreDistribution {
  name: string;
  value: number;
}

export interface MonthlyReadingData {
  name: string;
  books: number;
}

export interface UserStats {
  genreData: GenreDistribution[];
  monthlyData: MonthlyReadingData[];
}

export interface AdminStats {
  genreData: GenreDistribution[];
  userRoleData: {
    name: string;
    value: number;
  }[];
}

export interface ReadingStats {
  totalBooksRead: number;
  totalPagesRead: number;
  averageRating: number;
  favoriteGenres: string[];
  readingStreak: number;
  booksThisYear: number;
}

export interface ChartData {
  name: string;
  value: number;
}

export interface ChartLabelProps {
  name: string;
  percent?: number;
}

// Filter & Search Types
export interface BookFilters {
  query?: string;
  genres?: string[];
  minRating?: number;
  maxRating?: number;
  sortBy?: 'rating' | 'date' | 'title' | 'author';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  pages: number;
  hasMore: boolean;
}

// Form Types
export interface LoginFormData {
  email: string;
  password: string;
}

export interface RegisterFormData {
  name: string;
  email: string;
  password: string;
  image?: string;
}

export interface BookFormData {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: string[];
  totalPages?: number;
  publishedYear?: number;
  isbn?: string;
}

export interface ReviewFormData {
  rating: number;
  comment: string;
}

export interface ChallengeFormData {
  goal: number;
}

export interface UpdateProfileFormData {
  name?: string;
  image?: string;
}

export interface ChangePasswordFormData {
  currentPassword: string;
  newPassword: string;
  confirmPassword: string;
}


// Activity Types (for future social features)
export type ActivityType =
  | 'finished_book'
  | 'rated_book'
  | 'started_book'
  | 'added_to_shelf'
  | 'wrote_review';

export interface Activity {
  _id: string;
  user: Types.ObjectId | UserSession;
  type: ActivityType;
  book?: Types.ObjectId | BookWithGenres;
  rating?: number;
  createdAt: Date;
}

// Serialized Data Types (for JSON.parse(JSON.stringify()) results)
export type Serialized<T> = T extends Date
  ? string
  : T extends Types.ObjectId
  ? string
  : T extends object
  ? { [K in keyof T]: Serialized<T[K]> }
  : T;

export type SerializedBook = Serialized<BookWithGenres>;
export type SerializedGenre = Serialized<PopulatedGenre>;
export type SerializedShelf = Serialized<PopulatedShelfItem>;
export type SerializedReview = Serialized<PopulatedReview>;
export type SerializedTutorial = Serialized<Tutorial>;
export type SerializedUser = Serialized<AdminUserData>;
