import { Request, Response, NextFunction } from "express";
import mongoose from "mongoose";
import { CompletedOrder } from "../models/completedOrder";

export const addCompletedOrder = async (
  req: any,
  res: any,
  next: NextFunction
) => {
  try {
    const { restaurant_id, food_id, quantity } = req.body;
    if (!restaurant_id || !food_id || !quantity) {
      return res
        .status(400)
        .json({ message: "All fields are required." });
    }

    const newOrder = new CompletedOrder({
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
      food_id:      new mongoose.Types.ObjectId(food_id),
      quantity,
      completed_at: new Date(),
    });

    const saved = await newOrder.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error("Error in addCompletedOrder:", err);
    next(err);
  }
};