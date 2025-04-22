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

// Update quantity of a specific food item
router.patch("/update-quantity/:itemId", async (req: any, res: any) => {
  try {
    const { itemId } = req.params;
    const { quantity } = req.body;

    // Validate inputs
    if (!itemId || quantity === undefined) {
      return res.status(400).json({ message: "Item ID and quantity are required." });
    }

    // Check if quantity is a valid number
    if (typeof quantity !== "number" || quantity < 0) {
      return res.status(400).json({ message: "Quantity must be a non-negative number." });
    }

    // Update the quantity of the food item
    const updatedItem = await FoodItem.findByIdAndUpdate(
      itemId,
      { $set: { quantity } },
      { new: true } // return the updated document
    );

    if (!updatedItem) {
      return res.status(404).json({ message: "Food item not found." });
    }

    res.status(200).json(updatedItem);
  } catch (error) {
    console.error("Error updating quantity:", error);
    res.status(500).json({ message: "Internal Server Error" });
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

router.patch("/update-status/:foodItemId", async (req: any, res: any) => {
  try {
    const { foodItemId } = req.params;
    const { status } = req.body;

    // Validate food item ID
    if (!mongoose.Types.ObjectId.isValid(foodItemId)) {
      return res.status(400).json({ message: "Invalid food item ID." });
    }

    // Validate status
    const validStatuses = ["available", "expired", "sold"];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value." });
    }

    // Update the food item's status
    const updatedFoodItem = await FoodItem.findByIdAndUpdate(
      foodItemId,
      { status },
      { new: true } // return the updated document
    );

    if (!updatedFoodItem) {
      return res.status(404).json({ message: "Food item not found." });
    }

    res.status(200).json(updatedFoodItem);
  } catch (error) {
    console.error("Error updating food item status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


// GET a specific food item by its ID
router.get("/get-item/:foodId", async (req: any, res: any) => {
  try {
    const { foodId } = req.params;

    // Validate foodId
    if (!foodId) {
      return res.status(400).json({ message: "Food item ID is required." });
    }

    // Fetch the food item by ID
    const foodItem = await FoodItem.findById(foodId);

    if (!foodItem) {
      return res.status(404).json({ message: "Food item not found." });
    }

    // Return the food item details
    res.json(foodItem);
  } catch (error) {
    console.error("Error fetching food item:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


export default router;
