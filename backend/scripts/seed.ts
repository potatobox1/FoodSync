import mongoose from "mongoose";
import dotenv from "dotenv";
import { User, IUser } from "../src/models/user";
import { Location, ILocation } from "../src/models/location";
import { Restaurant, IRestaurant } from "../src/models/restaurant";
import { FoodItem, IFoodItem } from "../src/models/foodItem";

dotenv.config();

const MONGO_URI = process.env.MONGO_URI || "your_mongo_uri_here";

const seedLocations = async (): Promise<ILocation[]> => {
  await Location.deleteMany({});
  console.log("Existing locations removed");

  const locations = await Location.insertMany([
    {
      address: "123 Main Street",
      city: "New York",
      country: "USA",
      latitude: new mongoose.Types.Decimal128("40.7128"),
      longitude: new mongoose.Types.Decimal128("-74.0060"),
    },
    {
      address: "456 Park Avenue",
      city: "Los Angeles",
      country: "USA",
      latitude: new mongoose.Types.Decimal128("34.0522"),
      longitude: new mongoose.Types.Decimal128("-118.2437"),
    },
    {
      address: "789 Market Street",
      city: "San Francisco",
      country: "USA",
      latitude: new mongoose.Types.Decimal128("37.7749"),
      longitude: new mongoose.Types.Decimal128("-122.4194"),
    },
    {
      address: "321 Oak Drive",
      city: "Chicago",
      country: "USA",
      latitude: new mongoose.Types.Decimal128("41.8781"),
      longitude: new mongoose.Types.Decimal128("-87.6298"),
    },
    {
      address: "654 Pine Road",
      city: "Miami",
      country: "USA",
      latitude: new mongoose.Types.Decimal128("25.7617"),
      longitude: new mongoose.Types.Decimal128("-80.1918"),
    }
  ]);

  console.log(`${locations.length} Locations Seeded!`);
  return locations;
};

const seedUsers = async (locations: ILocation[]): Promise<IUser[]> => {
  await User.deleteMany({});
  console.log("Existing users removed");
  
  // Hash a sample password
  const userData = [
    // Restaurant users
    {
      uid: "1",
      name: "Italian Bistro",
      email: "italian@example.com",
      password: "hashedPassword1",
      contact_no: "1234567890",
      user_type: "restaurant" as const,
      location_id: locations[0]._id as unknown as mongoose.Types.ObjectId,
    },
    {
      uid: "2",
      name: "Zaan",
      email: "zaan@example.com",
      password: "hashedPassword10",
      contact_no: "123134890",
      user_type: "restaurant" as const,
      location_id: locations[1]._id as unknown as mongoose.Types.ObjectId,
    },
    {
      uid: "3",
      name: "Jammin Java",
      email: "jammin@example.com",
      password: "hashedPassword9",
      contact_no: "12213140",
      user_type: "restaurant" as const,
      location_id: locations[2]._id as unknown as mongoose.Types.ObjectId,
    },
    {
      uid: "4",
      name: "Sushi Palace",
      email: "sushi@example.com",
      password: "hashedPassword2",
      contact_no: "2345678901",
      user_type: "restaurant" as const,
      location_id: locations[2]._id as unknown as mongoose.Types.ObjectId,
    },
    {
      uid: "5",
      name: "Taco Heaven",
      email: "tacos@example.com",
      password: "hashedPassword3",
      contact_no: "3456789012",
      user_type: "restaurant" as const,
      location_id: locations[1]._id as unknown as mongoose.Types.ObjectId,
    },
    // Food bank users
    {
      uid: "6",
      name: "NYC Food Bank",
      email: "nycfoodbank@example.com",
      password: "hashedPassword4",
      contact_no: "5678901234",
      user_type: "food_bank" as const,
      location_id: locations[0]._id as unknown as mongoose.Types.ObjectId,
    },
    {
      uid: "7",
      name: "LA Community Pantry",
      email: "lapantry@example.com",
      password: "hashedPassword6",
      contact_no: "6789012345",
      user_type: "food_bank" as const,
      location_id: locations[2]._id as unknown as mongoose.Types.ObjectId,
    },
    {
      uid: "8",
      name: "SF Hunger Relief",
      email: "sfrelief@example.com",
      password: "hashedPassword7",
      contact_no: "7890123456",
      user_type: "food_bank" as const,
      location_id: locations[1]._id as unknown as mongoose.Types.ObjectId,
    }
  ];

  const users = await User.insertMany(userData);
  console.log(`${users.length} Users Seeded!`);
  return users;
};

const seedRestaurants = async (users: IUser[]): Promise<IRestaurant[]> => {
  await Restaurant.deleteMany({});
  console.log("Existing restaurants removed");

  // Get the restaurant users
  const restaurantUsers = users.filter(user => user.user_type === "restaurant");
  if (restaurantUsers.length === 0) {
    throw new Error("No restaurant users found!");
  }

  const restaurantData = restaurantUsers.map(user => ({
    user_id: user._id,
    total_donations: Math.floor(Math.random() * 50) + 1,
    cuisine_type: ["Italian", "Japanese", "Mexican", "American", "Indian"][Math.floor(Math.random() * 5)],
    average_rating: (Math.random() * 3) + 2,
  }));

  // Use create instead of insertMany and explicitly cast the result
  const restaurants = await Restaurant.create(restaurantData);
  
  // Make sure we have an array by converting to array if needed
  const restaurantsArray = Array.isArray(restaurants) ? restaurants : [restaurants];
  
  console.log(`${restaurantsArray.length} Restaurants Seeded!`);
  return restaurantsArray as unknown as IRestaurant[];
};

const seedFoodItems = async (restaurants: IRestaurant[]): Promise<void> => {
  await FoodItem.deleteMany({});
  console.log("Existing food items removed");

  const categories = [
    "Beverage", "Savoury", "Sweet"
  ];
  
  const foodNames = {
    "Beverage": ["Juice", "Shake", "Coke", "Water"],
    "Savoury": ["Pulao", "Biryani", "Karahi", "Daal"],
    "Sweet": ["Cakes", "Muffin", "Pastry", "Halwa"]
  };

  const foodItemsData: Array<{
    restaurant_id: any;
    quantity: number;
    expiration_date: Date;
    name: string;
    category: string;
    status: 'available' | 'expired';
  }> = [];

  // Generate 10-15 food items per restaurant with varied statuses and expiration dates
  for (const restaurant of restaurants) {
    const numItems = Math.floor(Math.random() * 6) + 10; // 10-15 items per restaurant
    
    for (let i = 0; i < numItems; i++) {
      const category = categories[Math.floor(Math.random() * categories.length)];
      const nameOptions = foodNames[category as keyof typeof foodNames];
      const name = nameOptions[Math.floor(Math.random() * nameOptions.length)];
      
      // Generate random expiration dates (some in the past for expired items)
      const today = new Date();
      let expirationDate;
      const status = Math.random() > 0.8 ? "expired" : "available"; // 20% chance of being expired
      
      if (status === "expired") {
        // Expired items: 1-30 days in the past
        const daysAgo = Math.floor(Math.random() * 30) + 1;
        expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() - daysAgo);
      } else {
        // Available items: 1-60 days in the future
        const daysAhead = Math.floor(Math.random() * 60) + 1;
        expirationDate = new Date(today);
        expirationDate.setDate(today.getDate() + daysAhead);
      }
      
      foodItemsData.push({
        restaurant_id: restaurant._id,
        quantity: Math.floor(Math.random() * 20) + 1, // 1-20 quantity
        expiration_date: expirationDate,
        name: name,
        category: category,
        status: status as 'available' | 'expired',  // Type assertion for the enum
      });
    }
  }

  const foodItems = await FoodItem.insertMany(foodItemsData);
  console.log(`${foodItems.length} Food Items Seeded!`);
};

const seedDatabase = async () => {
  try {
    await mongoose.connect(MONGO_URI);
    console.log("MongoDB Connected...");

    const locations = await seedLocations();
    const users = await seedUsers(locations);
    const restaurants = await seedRestaurants(users);
    await seedFoodItems(restaurants);

    console.log("Database seeding completed successfully!");
  } catch (error) {
    console.error("Error during database seeding:", error);
  } finally {
    await mongoose.connection.close();
    console.log("MongoDB connection closed.");
  }
};

/* Note: This function will erase all data in the db and seed it with 
sample data, if you only want to seed a specific table, comment the
other functions e.g (seedUsers) from the seedDatabase function */
seedDatabase();