import { Router } from 'express';
import {
  getAllRestaurants,
  getRestaurantById,
  getRestaurantByUserId,
  updateTotalDonations
} from '../controller/restaurantController';

const router = Router();

router.get('/', getAllRestaurants);
router.get('/:id', getRestaurantById);
router.post('/getbyuserid', getRestaurantByUserId);
router.patch('/updatedonations', updateTotalDonations);

export default router;
