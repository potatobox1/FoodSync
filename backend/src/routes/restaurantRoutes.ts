import express, { Request, Response } from "express";
import { Restaurant } from "../models/restaurant";

const router = express.Router();

// GET /api/restaurants/:id - Fetch a restaurant by ID
router.get("/:id", async (req: any, res: any) => {
    try {
        const { id } = req.params;
        const restaurant = await Restaurant.findById(id);
        
        if (!restaurant) {
            return res.status(404).json({ message: "Restaurant not found" });
        }

        res.json(restaurant);
    } catch (error) {
        console.error("Error fetching restaurant:", error);
        res.status(500).json({ message: "Server error" });
    }
});

export default router;
