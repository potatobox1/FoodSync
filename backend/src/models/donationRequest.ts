import mongoose, { Schema, Document } from 'mongoose';

export interface IDonationRequest extends Document {
  foodbank_id: mongoose.Types.ObjectId;
  food_id: mongoose.Types.ObjectId;
  requested_quantity: number;
  status: 'pending' | 'completed' | 'cancelled' | 'accepted';
  created_at: Date;
}

const DonationRequestSchema: Schema = new Schema({
  foodbank_id: { type: Schema.Types.ObjectId, ref: 'FoodBank', required: true },
  food_id: { type: Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  requested_quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'cancelled', 'completed'], required: true },
  created_at: { type: Date, default: Date.now }
});

export const DonationRequest = mongoose.model<IDonationRequest>('DonationRequest', DonationRequestSchema);
