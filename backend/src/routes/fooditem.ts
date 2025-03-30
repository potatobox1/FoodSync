import express, { Request, Response } from "express";
import mongoose from "mongoose";
import { FoodItem } from "../models/foodItem"; // Import the FoodItem model

const router = express.Router();

// GET all food items for a given restaurant ID
router.get("/:restaurantId", async (req: any, res: any) => {
  try {
    const { restaurantId } = req.params;

    // Validate restaurantId
    if (!restaurantId) {
      return res.status(400).json({ error: "Restaurant ID is required." });
    }

    // Fetch all food items where restaurant_id matches
    const foodItems = await FoodItem.find({ restaurant_id: restaurantId });

    // Return response
    res.json(foodItems);
  } catch (error) {
    console.error("Error fetching food items:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});



// Create a new food item
router.post("/additem", async (req:any, res:any) => {
  try {
    const { restaurant_id, quantity, expiration_date, name, category } = req.body;

    // Validate required fields
    if (!restaurant_id || !quantity || !expiration_date || !name || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }
    // Convert restaurant_id to ObjectId
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurant_id);

    // Create new food item (status is always 'available')
    const newFoodItem = new FoodItem({
      restaurant_id: restaurantObjectId, // Store as ObjectId
      quantity,
      expiration_date: new Date(expiration_date), // Ensure date is correctly formatted
      name,
      category,
      status: "available", // Manually setting the status
    });

    // Save to database
    const savedItem = await newFoodItem.save();

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error saving food item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
