const mongoose = require('mongoose');
const { User, Location, FoodBank, Restaurant, FoodItem, DonationRequest, CompletedOrder, Review } = require('./init_schema.js');

let uri = "mongodb+srv://foodsync:foodsyncpakistan123@foodsync.j0pshvy.mongodb.net/FoodsyncDB?retryWrites=true&w=majority&appName=foodsync";

// Connect to MongoDB
mongoose.connect(uri)
  .then(() => console.log('Connected to MongoDB Atlas'))
  .catch(err => console.error('MongoDB connection error:', err));

async function seedDatabase() {
  try {
    await mongoose.connection.dropDatabase();

    // Create Locations
    const location1 = await Location.create({ address: "123 Main St", city: "Lahore", country: "Pakistan", latitude: 31.5497, longitude: 74.3436 });
    const location2 = await Location.create({ address: "456 Food Bank Rd", city: "Karachi", country: "Pakistan", latitude: 24.8607, longitude: 67.0011 });

    // Create Users
    const restaurantUser = await User.create({ name: "Tasty Bites", email: "tasty@example.com", password: "hashedpassword", user_type: "restaurant", location_id: location1._id });
    const foodBankUser = await User.create({ name: "Hunger Relief", email: "hungerrelief@example.com", password: "hashedpassword", user_type: "food_bank", location_id: location2._id });

    // Create Restaurant & Food Bank
    const restaurant = await Restaurant.create({ user_id: restaurantUser._id, total_donations: 10, cuisine_type: "Pakistani", average_rating: 4.5 });
    const foodBank = await FoodBank.create({ user_id: foodBankUser._id, transportation_notes: "Requires refrigerated storage" });

    // Create Food Items
    const foodItem1 = await FoodItem.create({ restaurant_id: restaurant._id, quantity: 50, expiration_date: new Date('2025-04-10'), name: "Chicken Biryani", category: "Rice", status: "available" });
    const foodItem2 = await FoodItem.create({ restaurant_id: restaurant._id, quantity: 30, expiration_date: new Date('2025-04-12'), name: "Vegetable Curry", category: "Curry", status: "available" });

    // Create Donation Requests
    const donationRequest = await DonationRequest.create({
      foodbank_id: foodBank._id,
      food_id: foodItem1._id,
      requested_quantity: 20,
      status: "accepted"
    });

    // Create Completed Order
    const completedOrder = await CompletedOrder.create({
      restaurant_id: restaurant._id,
      food_id: foodItem1._id,
      quantity: 20
    });

    // Create Review
    await Review.create({
      foodbank_id: foodBank._id,
      restaurant_id: restaurant._id,
      request_id: donationRequest._id,
      rating: 5,
      feedback: "Excellent service! Fresh food delivered on time."
    });

    console.log("Dummy data inserted successfully!");
    mongoose.connection.close(); // Close connection after seeding
  } catch (err) {
    console.error("Error inserting dummy data:", err);
  }
}

// Run seeding function
seedDatabase();
