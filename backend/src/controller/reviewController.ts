// controllers/reviewController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Review } from '../models/review';

// POST /api/review/addreview - Create a new review
export const addReview = async (req: any, res: any) => {
  const { foodbank_id, restaurant_id, food_id, rating, feedback } = req.body;
  try {
    if (!food_id || rating === undefined || !feedback) {
      return res.status(400).json({ message: 'Required fields: food_id, rating, feedback' });
    }
    const review = new Review({
      foodbank_id: new mongoose.Types.ObjectId(foodbank_id),
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
      food_id: new mongoose.Types.ObjectId(food_id),
      rating,
      feedback,
      created_at: new Date()
    });
    const savedReview = await review.save();
    return res.status(201).json(savedReview);
  } catch (err) {
    console.error('Error creating review:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/review/restaurant/:id - Get reviews by restaurant_id
export const getReviewsByRestaurant = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const reviews = await Review.find({ restaurant_id: id });
    return res.status(200).json(reviews);
  } catch (err) {
    console.error('Error fetching reviews by restaurant_id:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/review/check?foodbank_id=...&food_id=... - Check if review exists
export const checkReviewExists = async (req: any, res: any) => {
  const { foodbank_id, food_id } = req.query;
  try {
    const review = await Review.findOne({
      foodbank_id: new mongoose.Types.ObjectId(foodbank_id as string),
      food_id: new mongoose.Types.ObjectId(food_id as string)
    });
    if (review) {
      return res.json({ exists: true, rating: review.rating });
    } else {
      return res.json({ exists: false });
    }
  } catch (err) {
    console.error('Error checking review:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


