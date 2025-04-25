import { Router } from 'express';
import {
  getFoodItemsByRestaurant,
  updateFoodItemQuantity,
  addFoodItem,
  updateFoodItemStatus,
  getFoodItemById
} from '../controller/foodItemController';

const router = Router();

router.get('/:restaurantId', getFoodItemsByRestaurant);
router.patch('/update-quantity/:itemId', updateFoodItemQuantity);
router.post('/additem', addFoodItem);
router.patch('/update-status/:foodItemId', updateFoodItemStatus);
router.get('/get-item/:foodId', getFoodItemById);

export default router;
