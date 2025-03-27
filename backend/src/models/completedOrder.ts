import mongoose, { Schema, Document } from 'mongoose';

export interface ICompletedOrder extends Document {
  restaurant_id: mongoose.Types.ObjectId;
  food_id: mongoose.Types.ObjectId;
  quantity: number;
  completed_at: Date;
}

const CompletedOrderSchema: Schema = new Schema({
  restaurant_id: { type: Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  food_id: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  quantity: { type: Number, required: true },
  completed_at: { type: Date, default: Date.now }
});

export const CompletedOrder = mongoose.model<ICompletedOrder>('CompletedOrder', CompletedOrderSchema);
