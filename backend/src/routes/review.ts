import express, { Request, Response } from "express";
import { Review } from "../models/review";

const router = express.Router();

// POST /api/review - Create a new review
router.post("/addreview", async (req: any, res: any) => {
  try {
    const { foodbank_id, restaurant_id, food_item_id, rating, feedback } = req.body;

    if (!food_item_id || !rating || !feedback) {
      return res.status(400).json({ message: "Required fields: food_item_id, rating, feedback" });
    }

    const review = new Review({
      foodbank_id,
      restaurant_id,
      food_item_id,
      rating,
      feedback,
      created_at: new Date(),
    });

    const savedReview = await review.save();
    res.status(201).json(savedReview);
  } catch (error) {
    console.error("Error creating review:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// GET /api/review/restaurant/:id - Get reviews by restaurant_id
router.get("/restaurant/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const reviews = await Review.find({ restaurant_id: id }).populate("food_item_id");

    if (!reviews || reviews.length === 0) {
      return res.status(404).json({ message: "No reviews found for this restaurant" });
    }

    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews by restaurant_id:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// (Optional) GET /api/review - Get all reviews
router.get("/", async (req: Request, res: Response) => {
  try {
    const reviews = await Review.find().populate("food_item_id");
    res.json(reviews);
  } catch (error) {
    console.error("Error fetching reviews:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
