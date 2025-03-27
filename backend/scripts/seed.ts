import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user";

dotenv.config(); // Load .env variables

const MONGO_URI = process.env.MONGO_URI || "your_mongo_uri_here";

// Dummy user data
const users = [
  {
    name: "Restaurant One",
    email: "restaurant1@example.com",
    password: "hashedpassword1",
    contact_no: "1234567890",
    user_type: "restaurant",
    location_id: new mongoose.Types.ObjectId(),
  },
  {
    name: "Food Bank One",
    email: "foodbank1@example.com",
    password: "hashedpassword2",
    contact_no: "0987654321",
    user_type: "food_bank",
    location_id: new mongoose.Types.ObjectId(),
  },
];

const seedUsers = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");

    await User.deleteMany();
    console.log("Existing users removed");

    await User.insertMany(users);
    console.log("Users Seeded!");

    mongoose.connection.close();
  } catch (error) {
    console.error("Error:", error);
    mongoose.connection.close();
  }
};

seedUsers();
