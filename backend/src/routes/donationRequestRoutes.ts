// routes/donationRequestRoutes.ts
import { Router } from 'express';
import {
  addDonationRequest,
  getRequestsByRestaurant,
  getRequestsByFoodbank,
  updateRequestStatus,
  getRequestById
} from '../controller/donationRequestController';

const router = Router();

router.post('/add-request', addDonationRequest);
router.get('/restaurant/:restaurantId', getRequestsByRestaurant);
router.get('/foodbank/:foodbankId', getRequestsByFoodbank);
router.patch('/update-status/:requestId', updateRequestStatus);
router.get('/:requestId', getRequestById);

export default router;