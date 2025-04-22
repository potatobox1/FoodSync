import mongoose, { Schema, Document } from 'mongoose';

export interface IReview extends Document {
  foodbank_id?: mongoose.Types.ObjectId;
  restaurant_id?: mongoose.Types.ObjectId;
  food_id: mongoose.Types.ObjectId;
  rating: number;
  feedback: string;
  created_at: Date;
}

const ReviewSchema: Schema = new Schema({
  foodbank_id: { type: Schema.Types.ObjectId, ref: 'FoodBank' },
  restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant' },
  food_id: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String, required: true },
  created_at: { type: Date, default: Date.now }
});

export const Review = mongoose.model<IReview>('Review', ReviewSchema);
