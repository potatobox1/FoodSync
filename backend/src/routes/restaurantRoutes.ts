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

  // PATCH /api/restaurant/updatedonations - Update total donations
router.patch('/updatedonations', async (req: any, res: any) => {
  try {
      const { id, amount } = req.body;

      // Validate inputs
      // if (!id || !amount || typeof amount !== 'number' || amount <= 0) {
      //     return res.status(400).json({ message: 'Valid user_id and amount are required' });
      // }

      // Find the restaurant by user_id
      const restaurant = await Restaurant.findById(id)

      if (!restaurant) {
          return res.status(404).json({ message: 'Restaurant not found' });
      }

      // Update the total donations
      restaurant.total_donations += amount;

      // Save the updated restaurant record
      await restaurant.save();

      // Respond with the updated restaurant data
      res.json({ message: 'Total donations updated', restaurant });
  } catch (err) {
      console.error('Error updating total donations:', err);
      res.status(500).json({ message: 'Server error' });
  }
});


export default router;
