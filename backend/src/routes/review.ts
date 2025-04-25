
import express, { Request, Response } from "express";
import { Review } from "../models/review";
import { io } from "../server";

// routes/reviewRoutes.ts
import { Router } from 'express';
import {
  addReview,
  getReviewsByRestaurant,
  checkReviewExists
} from '../controller/reviewController';


const router = Router();

// Create a new review
router.post('/addreview', addReview);

// Get reviews by restaurant ID
router.get('/restaurant/:id', getReviewsByRestaurant);

// Check if a review exists for a given foodbank & food
router.get('/check', checkReviewExists);


    const review = new Review({
      foodbank_id: new mongoose.Types.ObjectId(foodbank_id),
      restaurant_id: new mongoose.Types.ObjectId(restaurant_id),
      food_id: new mongoose.Types.ObjectId(food_id),
      rating,
      feedback,
      created_at: new Date(),
    });

    const savedReview = await review.save();
    // const restaurantRoom = `restaurant-${restaurant_id}`;
    console.log("sending to",restaurant_id)
    io.to(restaurant_id).emit("newReview", {
      review: savedReview,
});
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
});


// GET /api/review/restaurant/:id - Get reviews by restaurant_id
router.get("/restaurant/:id", async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const reviews = await Review.find({ restaurant_id: id });

    res.status(200).json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by restaurant_id:", error);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/check", async (req: any, res: any) => {
  const { foodbank_id, food_id } = req.query;

  try {
    const review = await Review.findOne({ foodbank_id, food_id });

    if (review) {
      return res.json({ exists: true, rating: review.rating });
    } else {
      return res.json({ exists: false });
    }
  } catch (error) {
    console.error("Error checking review:", error);
    return res.status(500).json({ message: "Server error" });
  }
});

export default router;

