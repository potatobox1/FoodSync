// routes/authRoutes.ts
import { Router } from 'express';
import { signup, getUser, addRestaurant, addFoodBank } from '../controller/authRoutesController' ;

const router = Router();

router.post('/signup', signup);
router.post('/getuser', getUser);
router.post('/addrestaurant', addRestaurant);
router.post('/addfoodbank', addFoodBank);

export default router;
