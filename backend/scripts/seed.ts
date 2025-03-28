import mongoose from "mongoose";
import dotenv from "dotenv";
import { User } from "../src/models/user";
import { Location } from "../src/models/location";

dotenv.config(); // Load .env variables

const MONGO_URI = process.env.MONGO_URI || "your_mongo_uri_here";

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");

    // Create a default location
    let defaultLocation = await Location.findOne();
    if (!defaultLocation) {
      defaultLocation = await Location.create({
        address: "123 Main Street",
        city: "Sample City",
        country: "Sample Country",
        latitude: new mongoose.Types.Decimal128("40.7128"),
        longitude: new mongoose.Types.Decimal128("-74.0060"),
      });
      console.log("Default location created:", defaultLocation);
    }

    // Dummy user data with valid location_id
    const users = [
      {
        name: "Restaurant One",
        email: "restaurant1@example.com",
        password: "hashedpassword1",
        contact_no: "1234567890",
        user_type: "restaurant",
        location_id: defaultLocation._id,
      },
      {
        name: "Food Bank One",
        email: "foodbank1@example.com",
        password: "hashedpassword2",
        contact_no: "0987654321",
        user_type: "food_bank",
        location_id: defaultLocation._id,
      },
    ];

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

seedDatabase();
