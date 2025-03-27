import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodItem extends Document {
  restaurant_id: mongoose.Types.ObjectId;
  quantity: number;
  expiration_date: Date;
  name: string;
  category: string;
  status: 'available' | 'expired';
  created_at: Date;
}

const FoodItemSchema: Schema = new Schema({
  restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, required: true },
  expiration_date: { type: Date, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['available', 'expired'], required: true },
  created_at: { type: Date, default: Date.now }
});

export const FoodItem = mongoose.model<IFoodItem>('FoodItem', FoodItemSchema);
