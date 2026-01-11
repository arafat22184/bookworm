import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IBook extends Document {
  title: string;
  author: string;
  description: string;
  coverImage: string;
  genres: mongoose.Types.ObjectId[];
  avgRating: number;
  totalRatings: number;
  createdAt: Date;
  updatedAt: Date;
}

const BookSchema: Schema<IBook> = new Schema({
  title: { type: String, required: [true, 'Title is required'] },
  author: { type: String, required: [true, 'Author is required'] },
  description: { type: String, required: [true, 'Description is required'] },
  coverImage: { type: String, required: [true, 'Cover image is required'] },
  genres: [{ type: Schema.Types.ObjectId, ref: 'Genre' }],
  avgRating: { type: Number, default: 0 },
  totalRatings: { type: Number, default: 0 },
}, { timestamps: true });

const Book: Model<IBook> = mongoose.models.Book || mongoose.model<IBook>('Book', BookSchema);
export default Book;
