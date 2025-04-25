// routes/restaurantRoutes.ts
import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantByUserId,
  updateTotalDonations
} from '../controller/restaurantController';

const router = Router();

// Fetch all restaurants
router.get('/', getAllRestaurants);

// Fetch a restaurant by ID
router.get('/:id', getRestaurantById);

// Fetch a restaurant by user ID
router.post('/getbyuserid', getRestaurantByUserId);

// Update total donations
router.patch('/updatedonations', updateTotalDonations);

export default router;
