import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user";
import { Location } from "../models/location";
import { Restaurant } from "../models/restaurant"; // Import the Restaurant model
import { FoodBank } from "../models/foodBank"; // Import the FoodBank model

const router = Router();

router.post("/signup", async (req: any, res: any) => {
  try {
    const {
      uid, // Firebase UID
      name,
      email,
      contact_no,
      user_type,
      address,
      city,
      country,
      latitude,
      longitude,
    } = req.body;

    if (!uid) {
      return res.status(400).json({
        message: "Firebase UID is required",
        error: true,
      });
    }

    // Check if user already exists by UID
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
        error: true,
      });
    }

    // Create a new location
    const newLocation = new Location({
      address,
      city,
      country,
      latitude,
      longitude,
    });

    await newLocation.save();

    // Create a new user with the location reference and Firebase UID
    const newUser = new User({
      uid, // Store Firebase UID
      name,
      email,
      contact_no,
      user_type,
      location_id: newLocation._id,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        uid: newUser.uid, // Return Firebase UID
        name: newUser.name,
        email: newUser.email,
        contact_no: newUser.contact_no,
        user_type: newUser.user_type,
        location_id: newUser.location_id,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    return res.status(500).json({
      message: "Server error during registration",
      error: true,
    });
  }
});

// Fetch user ID by Firebase UID
router.post("/getuser", async (req: any, res: any) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({
        message: "Firebase UID is required",
        error: true,
      });
    }

    // Find user by UID
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "User found",
      user: {
        id: user._id, // Return the MongoDB user ID
        name: user.name,
        email: user.email,
        contact_no: user.contact_no,
        user_type: user.user_type,
        location_id: user.location_id,
      },
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      message: "Server error while fetching user",
      error: true,
    });
  }
});

router.post("/addrestaurant", async (req: any, res: any) => {
  try {
    const { uid, cuisine_type } = req.body;

    if (!uid || !cuisine_type) {
      return res.status(400).json({ message: "Firebase UID and cuisine type are required", error: true });
    }

    // Find the user by Firebase UID
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({ message: "User not found", error: true });
    }

    if (user.user_type !== "restaurant") {
      return res.status(403).json({ message: "User is not a restaurant", error: true });
    }

    // Check if the restaurant already exists
    const existingRestaurant = await Restaurant.findOne({ user_id: user._id });
    if (existingRestaurant) {
      return res.status(400).json({ message: "Restaurant already exists", error: true });
    }

    // Create a new restaurant entry
    const newRestaurant = new Restaurant({
      user_id: user._id,
      cuisine_type,
      total_donations: 0,
      average_rating: 0
    });

    await newRestaurant.save();

    return res.status(201).json({
      message: "Restaurant registered successfully",
      restaurant: {
        id: newRestaurant._id,
        user_id: newRestaurant.user_id,
        cuisine_type: newRestaurant.cuisine_type,
        total_donations: newRestaurant.total_donations,
        average_rating: newRestaurant.average_rating
      }
    });

  } catch (error) {
    console.error("Add Restaurant Error:", error);
    return res.status(500).json({ message: "Server error while adding restaurant", error: true });
  }
});

router.post("/addfoodbank", async (req: any, res: any) => {
  try {
    const { uid, transportation_notes } = req.body;

    if (!uid) {
      return res.status(400).json({
        message: "Firebase UID is required",
        error: true,
      });
    }

    // Fetch the user by Firebase UID
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    // Check if the user is a food bank
    if (user.user_type !== "food_bank") {
      return res.status(400).json({
        message: "User is not a food bank",
        error: true,
      });
    }

    // Check if food bank already exists
    const existingFoodBank = await FoodBank.findOne({ user_id: user._id });
    if (existingFoodBank) {
      return res.status(400).json({
        message: "Food bank already registered",
        error: true,
      });
    }

    // Create a new FoodBank entry
    const newFoodBank = new FoodBank({
      user_id: user._id,
      transportation_notes: transportation_notes || "", // Default to empty string
    });

    await newFoodBank.save();

    return res.status(201).json({
      message: "Food bank registered successfully",
      foodbank: {
        id: newFoodBank._id,
        user_id: newFoodBank.user_id,
        transportation_notes: newFoodBank.transportation_notes,
      },
    });
  } catch (error) {
    console.error("FoodBank registration error:", error);

    return res.status(500).json({
      message: "Server error during food bank registration",
      error: true,
    });
  }
});



export default router;
