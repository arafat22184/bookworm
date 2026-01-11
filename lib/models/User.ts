import mongoose, { Schema, Document, Model } from 'mongoose';

export interface IUser extends Document {
  name: string;
  email: string;
  password?: string;
  role: 'user' | 'admin';
  image?: string;
  challenge: {
    year: number;
    goal: number;
    current: number;
  };
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema: Schema<IUser> = new Schema({
  name: { type: String, required: [true, 'Name is required'] },
  email: { type: String, required: [true, 'Email is required'], unique: true },
  password: { type: String, required: [true, 'Password is required'] },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  image: { type: String },
  challenge: {
    year: { type: Number, default: new Date().getFullYear() },
    goal: { type: Number, default: 0 },
    current: { type: Number, default: 0 },
  },
}, { timestamps: true });

const User: Model<IUser> = mongoose.models.User || mongoose.model<IUser>('User', UserSchema);
export default User;
