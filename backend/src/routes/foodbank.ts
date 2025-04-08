import express from 'express';
import mongoose from "mongoose";
import { FoodBank } from '../models/foodBank'; // Adjust the path if needed

const router = express.Router();

router.post('/getbyuserid', async (req:any, res:any) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const foodBank = await FoodBank.findOne({ user_id });

    if (!foodBank) {
      return res.status(404).json({ message: 'Food bank not found' });
    }

    res.json(foodBank);
  } catch (err) {
    console.error('Error fetching food bank by user ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.patch("/update-notes/:foodbankId", async (req:any, res:any) => {
  try {
    const { foodbankId } = req.params;
    const { transportation_notes } = req.body;

    if (!mongoose.Types.ObjectId.isValid(foodbankId)) {
      return res.status(400).json({ message: "Invalid FoodBank ID." });
    }

    const updated = await FoodBank.findByIdAndUpdate(
      foodbankId,
      { transportation_notes },
      { new: true }
    );

    if (!updated) return res.status(404).json({ message: "FoodBank not found." });

    res.status(200).json(updated);
  } catch (error) {
    console.error("Error updating transportation notes:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/user/:foodbankId", async (req:any, res:any) => {
  try {
    const { foodbankId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodbankId)) {
      return res.status(400).json({ message: "Invalid FoodBank ID." });
    }

    const foodbank = await FoodBank.findById(foodbankId);

    if (!foodbank) {
      return res.status(404).json({ message: "FoodBank not found." });
    }

    res.status(200).json({ user_id: foodbank.user_id });
  } catch (error) {
    console.error("Error fetching user_id by foodbank ID:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
