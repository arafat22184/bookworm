import mongoose, { Schema, Document, Model } from 'mongoose';

export interface ITutorial extends Document {
  title: string;
  videoUrl: string;
  description: string;
  createdAt: Date;
  updatedAt: Date;
}

const TutorialSchema: Schema<ITutorial> = new Schema({
  title: { type: String, required: true },
  videoUrl: { type: String, required: true },
  description: { type: String },
}, { timestamps: true });

const Tutorial: Model<ITutorial> = mongoose.models.Tutorial || mongoose.model<ITutorial>('Tutorial', TutorialSchema);
export default Tutorial;
