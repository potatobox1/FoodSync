import express, { Request, Response } from "express";
import { Restaurant } from "../models/restaurant";

const router = express.Router();

// GET api/restaurant
router.get("/", async (req: Request, res: Response) => {
    try {
        const restaurants = await Restaurant.find();
        res.json(restaurants);
    } catch (error) {
        console.error("Error fetching restaurants:", error);
        res.status(500).json({ message: "Server error" });
    }
});

// GET /api/restaurant/:id - Fetch a restaurant by ID
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


router.post('/getbyuserid', async (req:any, res:any) => {
    try {
      const { user_id } = req.body;
  
      if (!user_id) {
        return res.status(400).json({ message: 'user_id is required' });
      }
  
      const restaurant = await Restaurant.findOne({ user_id });
  
      if (!restaurant) {
        return res.status(404).json({ message: 'Restaurant not found' });
      }
  
      res.json(restaurant);
    } catch (err) {
      console.error('Error fetching restaurant by user ID:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

export default router;
