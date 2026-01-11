import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IGenre extends Document {
  name: string;
}

const GenreSchema: Schema<IGenre> = new Schema({
  name: { type: String, required: true, unique: true },
});

const Genre: Model<IGenre> = mongoose.models.Genre || mongoose.model<IGenre>('Genre', GenreSchema);
export default Genre;
