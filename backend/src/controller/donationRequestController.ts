// controllers/donationRequestController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { DonationRequest } from '../models/donationRequest';
import { FoodItem } from "../models/foodItem";
import { io } from "../server";


// POST /api/donations/add-request
export const addDonationRequest = async (req: any, res: any) => {
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

    const foodItem = await FoodItem.findById(foodObjectId);
    const restaurantId = foodItem?.restaurant_id?.toString();

    if (restaurantId) {
      io.to(restaurantId).emit("newDonationRequest", {
        request: savedRequest,
        foodItem,
      });
    }

    res.status(201).json(savedRequest);
  } catch (error) {
    console.error("Error saving donation request:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/donations/restaurant/:restaurantId
export const getRequestsByRestaurant = async (req: any, res: any) => {
  const { restaurantId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(restaurantId)) {
      return res.status(400).json({ message: 'Invalid restaurant ID.' });
    }
    const requests = await DonationRequest.aggregate([
      { $lookup: {
          from: 'fooditems', localField: 'food_id', foreignField: '_id', as: 'foodItem'
        }
      },
      { $unwind: '$foodItem' },
      { $match: { 'foodItem.restaurant_id': new mongoose.Types.ObjectId(restaurantId) } },
      { $project: { _id: 1, food_id:1, foodbank_id:1, requested_quantity:1, status:1, created_at:1, foodItem:1 } }
    ]);
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching donation requests:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// GET /api/donations/foodbank/:foodbankId
export const getRequestsByFoodbank = async (req: any, res: any) => {
  const { foodbankId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(foodbankId)) {
      return res.status(400).json({ message: 'Invalid foodbank ID.' });
    }
    const requests = await DonationRequest.find({
      foodbank_id: new mongoose.Types.ObjectId(foodbankId)
    }).populate('food_id');
    res.status(200).json(requests);
  } catch (err) {
    console.error('Error fetching donation requests:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};

// PATCH /api/donations/update-status/:requestId
export const updateRequestStatus = async (req: any, res: any) => {
  try {
    const { requestId } = req.params;
    const { status } = req.body;

    if (!status || !['completed', 'cancelled', 'accepted'].includes(status)) {
      return res.status(400).json({
        message: "Invalid status. Status must be one of 'completed', 'cancelled', or 'accepted'."
      });
    }
    const donationRequest = await DonationRequest.findById(requestId);

    if (!donationRequest) {
      return res.status(404).json({ message: "Donation request not found." });
    }

    donationRequest.status = status;
    await donationRequest.save();

    const foodbankId = donationRequest.foodbank_id.toString(); 
    io.to(`foodbank-${foodbankId}`).emit("donationStatusUpdated", {
      requestId: donationRequest._id,
      newStatus: donationRequest.status,
    });

    res.status(200).json({
      message: "Donation request status updated successfully.",
      donationRequest,
    });
  } catch (error) {
    console.error("Error updating donation request status:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

// GET /api/donations/:requestId
export const getRequestById = async (req: any, res: any) => {
  const { requestId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(requestId)) {
      return res.status(400).json({ message: 'Invalid donation request ID.' });
    }
    const reqDoc = await DonationRequest.findById(requestId).populate('food_id');
    if (!reqDoc) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }
    res.status(200).json(reqDoc);
  } catch (err) {
    console.error('Error fetching donation request:', err);
    res.status(500).json({ message: 'Internal Server Error' });
  }
};



