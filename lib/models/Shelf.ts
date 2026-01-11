import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IShelf extends Document {
  user: mongoose.Types.ObjectId;
  book: mongoose.Types.ObjectId;
  status: 'want-to-read' | 'currently-reading' | 'read';
  progress: number; // Pages read
  createdAt: Date;
  updatedAt: Date;
}

const ShelfSchema: Schema<IShelf> = new Schema({
  user: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  book: { type: Schema.Types.ObjectId, ref: 'Book', required: true },
  status: { type: String, enum: ['want-to-read', 'currently-reading', 'read'], required: true },
  progress: { type: Number, default: 0 },
}, { timestamps: true });

// Ensure a user can only have one entry per book
ShelfSchema.index({ user: 1, book: 1 }, { unique: true });

const Shelf: Model<IShelf> = mongoose.models.Shelf || mongoose.model<IShelf>('Shelf', ShelfSchema);
export default Shelf;
