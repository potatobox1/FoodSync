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

// Get all donation requests for a specific restaurant
router.get("/restaurant/:restaurantId", async (req: any, res: any) => {
  try {
    const { restaurantId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: "Invalid restaurant ID." });
    }

    const requests = await DonationRequest.aggregate([
      {
        $lookup: {
          from: "fooditems", // collection name in MongoDB (usually plural lowercase)
          localField: "food_id",
          foreignField: "_id",
          as: "foodItem"
        }
      },
      { $unwind: "$foodItem" },
      {
        $match: {
          "foodItem.restaurant_id": new mongoose.Types.ObjectId(restaurantId)
        }
      },
      {
        $project: {
          _id: 1,
          food_id: 1,
          foodbank_id: 1,
          requested_quantity: 1,
          status: 1,
          created_at: 1,
          foodItem: 1
        }
      }
    ]);

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

// Get all donation requests for a specific foodbank
router.get("/foodbank/:foodbankId", async (req: any, res: any) => {
  try {
    const { foodbankId } = req.params;

    if (!mongoose.Types.ObjectId.isValid(foodbankId)) {
      return res.status(400).json({ message: "Invalid foodbank ID." });
    }

    const requests = await DonationRequest.find({
      foodbank_id: new mongoose.Types.ObjectId(foodbankId),
    }).populate("food_id"); // optional: populate food item details

    res.status(200).json(requests);
  } catch (error) {
    console.error("Error fetching donation requests:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
});


export default router;
