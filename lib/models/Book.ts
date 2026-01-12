import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: mongoose.Types.ObjectId[];
  avgRating: number;
  totalRatings: number;
  totalPages?: number;
  publishedYear?: number;
  isbn?: string;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema<IBook> = new Schema({
  title: { type: String, required: [true, 'Title is required'], index: true },
  author: { type: String, required: [true, 'Author is required'], index: true },
  description: { type: String, required: [true, 'Description is required'] },
  coverImage: { type: String, required: [true, 'Cover image is required'] },
  genres: [{ type: Schema.Types.ObjectId, ref: 'Genre', index: true }],
  avgRating: { type: Number, default: 0, min: 0, max: 5 },
  totalRatings: { type: Number, default: 0, min: 0 },
  totalPages: { type: Number, min: 1 },
  publishedYear: { type: Number, min: 1000, max: new Date().getFullYear() + 1 },
  isbn: { type: String, unique: true, sparse: true },
}, { timestamps: true });

// Indexes for better query performance
BookSchema.index({ title: 'text', author: 'text' });
BookSchema.index({ avgRating: -1, totalRatings: -1 });
BookSchema.index({ createdAt: -1 });

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
export default Book;

