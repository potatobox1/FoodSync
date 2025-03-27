import mongoose, { Schema, Document } from 'mongoose';

export interface IRestaurant extends Document {
  user_id: mongoose.Types.ObjectId;
  total_donations: number;
  cuisine_type: string;
  average_rating: number;
}

const RestaurantSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  total_donations: { type: Number, default: 0 },
  cuisine_type: { type: String, required: true },
  average_rating: { type: Number, default: 0, required: true }
});

export const Restaurant = mongoose.model<IRestaurant>('Restaurant', RestaurantSchema);
