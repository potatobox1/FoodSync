import express, { Request, Response } from "express";
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

export default router;
