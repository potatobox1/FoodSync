const mongoose = require('mongoose');

let uri = "mongodb+srv://foodsync:foodsyncpakistan123@foodsync.j0pshvy.mongodb.net/FoodsyncDB?retryWrites=true&w=majority&appName=foodsync";

// Connect to MongoDB Atlas
mongoose.connect(uri)
  .then(() => console.log('MongoDB Atlas Connected!'))
  .catch(err => console.error('MongoDB Connection Error:', err));

// Define User Schema
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  contact_no: { type: String, required: true},
  user_type: { type: String, enum: ['restaurant', 'food_bank'], required: true },
  location_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Location', required: true },
  created_at: { type: Date, default: Date.now }
});

const LocationSchema = new mongoose.Schema({
  address: { type: String, required: true },
  city: { type: String, required: true },
  country: { type: String, required: true },
  latitude: { type: mongoose.Types.Decimal128, required: true},
  longitude: { type: mongoose.Types.Decimal128, required: true}
});

const FoodBankSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  transportation_notes: { type: String, required: true}
});

const RestaurantSchema = new mongoose.Schema({
  user_id: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  total_donations: { type: Number, default: 0 },
  cuisine_type: { type: String ,required: true},
  average_rating: { type: Number, default: 0 ,required: true}
});

const FoodItemSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  quantity: { type: Number, required: true },
  expiration_date: { type: Date, required: true },
  name: { type: String, required: true },
  category: { type: String, required: true },
  status: { type: String, enum: ['available', 'expired'], required: true },
  created_at: { type: Date, default: Date.now }
});

const DonationRequestSchema = new mongoose.Schema({
  foodbank_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodBank', required: true },
  food_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  requested_quantity: { type: Number, required: true },
  status: { type: String, enum: ['pending', 'accepted', 'cancelled', 'completed'], required: true },
  created_at: { type: Date, default: Date.now }
});

const CompletedOrderSchema = new mongoose.Schema({
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant', required: true },
  food_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodItem', required: true },
  quantity: { type: Number, required: true },
  completed_at: { type: Date, default: Date.now }
});

const ReviewSchema = new mongoose.Schema({
  foodbank_id: { type: mongoose.Schema.Types.ObjectId, ref: 'FoodBank' },
  restaurant_id: { type: mongoose.Schema.Types.ObjectId, ref: 'Restaurant' },
  request_id: { type: mongoose.Schema.Types.ObjectId, ref: 'DonationRequest' },
  rating: { type: Number, min: 1, max: 5, required: true },
  feedback: { type: String,required: true },
  created_at: { type: Date, default: Date.now }
});

// Create Models
const User = mongoose.model('User', UserSchema);
const Location = mongoose.model('Location', LocationSchema);
const FoodBank = mongoose.model('FoodBank', FoodBankSchema);
const Restaurant = mongoose.model('Restaurant', RestaurantSchema);
const FoodItem = mongoose.model('FoodItem', FoodItemSchema);
const DonationRequest = mongoose.model('DonationRequest', DonationRequestSchema);
const CompletedOrder = mongoose.model('CompletedOrder', CompletedOrderSchema);
const Review = mongoose.model('Review', ReviewSchema);

// Export models
module.exports = {
  User,
  Location,
  FoodBank,
  Restaurant,
  FoodItem,
  DonationRequest,
  CompletedOrder,
  Review
};
