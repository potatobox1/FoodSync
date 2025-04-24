// controllers/donationRequestController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { DonationRequest } from '../models/donationRequest';

// POST /api/donations/add-request
export const addDonationRequest = async (req: any, res:any) => {
  const { foodbank_id, food_id, requested_quantity, status } = req.body;
  try {
    if (!foodbank_id || !food_id || !requested_quantity || !status) {
      return res.status(400).json({ message: 'All fields are required.' });
    }
    const fbId = new mongoose.Types.ObjectId(foodbank_id);
    const fId  = new mongoose.Types.ObjectId(food_id);
    const newReq = new DonationRequest({
      foodbank_id: fbId,
      food_id: fId,
      requested_quantity,
      status,
      created_at: new Date()
    });
    const saved = await newReq.save();
    res.status(201).json(saved);
  } catch (err) {
    console.error('Error saving donation request:', err);
    res.status(500).json({ message: 'Internal Server Error' });
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
  const { requestId } = req.params;
  const { status }     = req.body;
  try {
    if (!status || !['completed','cancelled','accepted'].includes(status)) {
      return res.status(400).json({ message: "Status must be 'completed', 'cancelled', or 'accepted'." });
    }
    const reqDoc = await DonationRequest.findById(requestId);
    if (!reqDoc) {
      return res.status(404).json({ message: 'Donation request not found.' });
    }
    reqDoc.status = status;
    await reqDoc.save();
    res.status(200).json({ message: 'Status updated.', donationRequest: reqDoc });
  } catch (err) {
    console.error('Error updating donation request status:', err);
    res.status(500).json({ message: 'Internal Server Error' });
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



