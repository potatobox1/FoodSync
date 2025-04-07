import express from "express";
import mongoose from "mongoose";
import { DonationRequest } from "../models/donationRequest";

const router = express.Router();

// Add a new donation request
router.post("/add-donation-request", async (req: any, res: any) => {
  try {
    const { foodbank_id, food_id, requested_quantity, status } = req.body;

    // Validate required fields
    if (!foodbank_id || !food_id || !requested_quantity || !status) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Convert IDs to ObjectId
    const foodbankObjectId = new mongoose.Types.ObjectId(foodbank_id);
    const foodObjectId = new mongoose.Types.ObjectId(food_id);

    // Create a new donation request
    const newDonationRequest = new DonationRequest({
      foodbank_id: foodbankObjectId,
      food_id: foodObjectId,
      requested_quantity,
      status,
      created_at: new Date(),
    });

    // Save to database
    const savedRequest = await newDonationRequest.save();

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error saving donation request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

export default router;
