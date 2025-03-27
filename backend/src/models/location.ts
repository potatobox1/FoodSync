import mongoose, { Schema, Document } from 'mongoose';

export interface ILocation extends Document {
  address: string;
  city: string;
  country: string;
  latitude: mongoose.Types.Decimal128;
  longitude: mongoose.Types.Decimal128;
}

const LocationSchema: Schema = new Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  latitude: { type: mongoose.Types.Decimal128, required: true },
  longitude: { type: mongoose.Types.Decimal128, required: true }
});

export const Location = mongoose.model<ILocation>('Location', LocationSchema);
