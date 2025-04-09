import express from 'express';
import { FoodItem } from '../models/foodItem';

const router = express.Router();

// GET /api/inventory - Fetch all food items or only available ones based on query
router.get("/", async (req, res) => {
    try {
        const { available } = req.query; // Read query parameter
        
        let query: any = {
            quantity: { $gt: 0 }  // Only items where quantity > 0
        };
        
        if (available === "true") {
            query.status = { $eq: "available" };  // Ensure status is explicitly "available"
        }

        const foodItems = await FoodItem.find(query);
        res.json(foodItems);
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
