import mongoose, { Schema, Document } from 'mongoose';

export interface IUser extends Document {
  uid: string; // Firebase UID
  name: string;
  email: string;
  contact_no: string;
  user_type: 'restaurant' | 'food_bank';
  location_id: mongoose.Types.ObjectId;
  created_at: Date;
}

const UserSchema: Schema = new Schema({
  uid: { type: String, required: true, unique: true }, // Firebase UID (Unique Identifier)
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  contact_no: { type: String, required: true },
  user_type: { type: String, enum: ['restaurant', 'food_bank'], required: true },
  location_id: { type: Schema.Types.ObjectId, ref: 'Location', required: true },
  created_at: { type: Date, default: Date.now }
});

export const User = mongoose.model<IUser>('User', UserSchema);
