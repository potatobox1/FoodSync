import mongoose, { Schema, Document } from 'mongoose';

export interface IFoodBank extends Document {
  user_id: mongoose.Types.ObjectId;
  transportation_notes: string;
}

const FoodBankSchema: Schema = new Schema({
  user_id: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  transportation_notes: { type: String, required: true }
});

export const FoodBank = mongoose.model<IFoodBank>('FoodBank', FoodBankSchema);
