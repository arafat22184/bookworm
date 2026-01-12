import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGenre extends Document {
  name: string;
  slug: string;
  description?: string;
  createdAt: Date;
  updatedAt: Date;
}

const GenreSchema: Schema<IGenre> = new Schema({
  name: { type: String, required: true, unique: true, trim: true },
  slug: { type: String, required: true, unique: true, lowercase: true, trim: true },
  description: { type: String },
}, { timestamps: true });

// Index for faster lookups

const Genre: Model<IGenre> = mongoose.models.Genre || mongoose.model<IGenre>('Genre', GenreSchema);
export default Genre;

