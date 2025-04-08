import express from 'express';
import { FoodBank } from '../models/foodBank'; // Adjust the path if needed

const router = express.Router();

router.post('/getbyuserid', async (req:any, res:any) => {
  try {
    const { user_id } = req.body;

    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const foodBank = await FoodBank.findOne({ user_id });

    if (!foodBank) {
      return res.status(404).json({ message: 'Food bank not found' });
    }

    res.json(foodBank);
  } catch (err) {
    console.error('Error fetching food bank by user ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
