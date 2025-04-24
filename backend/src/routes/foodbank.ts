// routes/foodBankRoutes.ts
import { Router } from 'express';
import {
  getFoodBankByUserId,
  updateTransportationNotes,
  getUserIdByFoodBank
} from '../controller/foodBankController';

const router = Router();

// Retrieve a food bank by user ID
router.post('/getbyuserid', getFoodBankByUserId);

// Update transportation notes for a food bank
router.patch('/update-notes/:foodbankId', updateTransportationNotes);

// Fetch the user_id for a given food bank ID
router.get('/user/:foodbankId', getUserIdByFoodBank);

export default router;