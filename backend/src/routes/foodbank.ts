import { Router } from 'express';
import {
  getFoodBankByUserId,
  updateTransportationNotes,
  getUserIdByFoodBank
} from '../controller/foodBankController';

const router = Router();

router.post('/getbyuserid', getFoodBankByUserId);
router.patch('/update-notes/:foodbankId', updateTransportationNotes);
router.get('/user/:foodbankId', getUserIdByFoodBank);

export default router;