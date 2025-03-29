import express from 'express';
import { FoodItem } from '../models/foodItem';

const router = express.Router();

// GET /api/inventory - Fetch all food items or only available ones based on query
router.get("/", async (req, res) => {
    try {
        const { available } = req.query; // Read query parameter
        
        let query = {};
        if (available === "true") {
            query = { status: "available" };
        }

        const foodItems = await FoodItem.find(query);
        res.json(foodItems);
    } catch (error) {
        console.error("Error fetching food items:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
