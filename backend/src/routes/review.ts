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

export default router;