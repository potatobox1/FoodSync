import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user";
import { Location } from "../src/models/location";
import { Restaurant } from "../src/models/restaurant";
import { FoodItem } from "../src/models/foodItem";
import { IUser } from "../src/models/user"; // Ensure this is correctly imported

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "your_mongo_uri_here";

const seedLocations = async () => {
  await Location.deleteMany();
  console.log("Existing locations removed");

  const location = await Location.create({
    address: "123 Main Street",
    city: "Sample City",
    country: "Sample Country",
    latitude: new mongoose.Types.Decimal128("40.7128"),
    longitude: new mongoose.Types.Decimal128("-74.0060"),
  });

  console.log("Location Seeded:", location);
  return location;
};

const seedUsers = async (location: mongoose.Document) => {
  await User.deleteMany();
  console.log("Existing users removed");

  const users = await User.insertMany([
    {
      name: "Restaurant One",
      email: "restaurant1@example.com",
      password: "hashedpassword1",
      contact_no: "1234567890",
      user_type: "restaurant",
      location_id: location._id,
    },
    {
      name: "Food Bank One",
      email: "foodbank1@example.com",
      password: "hashedpassword2",
      contact_no: "0987654321",
      user_type: "food_bank",
      location_id: location._id,
    },
  ]);

  console.log("Users Seeded!");
  return users;
};

const seedRestaurants = async (users: IUser[]) => {
  await Restaurant.deleteMany();
  console.log("Existing restaurants removed");

  // Get the restaurant user
  const restaurantUser = users.find((user) => user.user_type === "restaurant");
  if (!restaurantUser) {
    throw new Error("No restaurant user found!");
  }

  const restaurant = await Restaurant.create({
    user_id: restaurantUser._id,
    total_donations: 10,
    cuisine_type: "Italian",
    average_rating: 4.5,
  });

  console.log("Restaurant Seeded:", restaurant);
  return restaurant;
};

const seedFoodItems = async (restaurant: mongoose.Document) => {
  await FoodItem.deleteMany();
  console.log("Existing food items removed");

  const foodItems = await FoodItem.insertMany([
    {
      restaurant_id: restaurant._id,
      quantity: 10,
      expiration_date: new Date("2025-12-01"),
      name: "Pasta",
      category: "Grains",
      status: "available",
    },
    {
      restaurant_id: restaurant._id,
      quantity: 5,
      expiration_date: new Date("2025-11-15"),
      name: "Tomato Sauce",
      category: "Condiments",
      status: "available",
    },
    {
      restaurant_id: restaurant._id,
      quantity: 8,
      expiration_date: new Date("2025-10-10"),
      name: "Mozzarella Cheese",
      category: "Dairy",
      status: "available",
    },
    {
      restaurant_id: restaurant._id,
      quantity: 6,
      expiration_date: new Date("2025-09-30"),
      name: "Breadsticks",
      category: "Bakery",
      status: "available",
    },
    {
      restaurant_id: restaurant._id,
      quantity: 3,
      expiration_date: new Date("2025-08-25"),
      name: "Mushrooms",
      category: "Vegetables",
      status: "expired",
    },
  ]);

  console.log("Food Items Seeded!");
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");

    const location = await seedLocations();
    const users = await seedUsers(location);
    const users1 = await User.find().lean();
    const restaurant = await seedRestaurants(users1);
    await seedFoodItems(restaurant);

    mongoose.connection.close();
    console.log("Seeding completed!");
  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
};

/* Note: This function will erase all data in the db and seed it with 
sample data, if you only want to seed a specific table, comment the
other functions e.g (seedUsers) from the seedDatabase function */
seedDatabase();