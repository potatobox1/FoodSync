// routes/completedOrders.ts
import express from "express";
import mongoose from "mongoose";
import { CompletedOrder } from "../models/completedOrder";

const router = express.Router();

// Add a new completed order
router.post("/add", async (req:any, res:any) => {
  try {
    const { restaurant_id, food_id, quantity } = req.body;

    if (!restaurant_id || !food_id || !quantity) {
      return res.status(400).json({ message: "All fields are required." });
    }

    const newCompletedOrder = new CompletedOrder({
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
      food_id: new mongoose.Types.ObjectId(food_id),
      quantity,
      completed_at: new Date(),
    });

    const savedOrder = await newCompletedOrder.save();
    res.status(201).json(savedOrder);
  } catch (error) {
    console.error("Error adding completed order:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
