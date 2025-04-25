import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { FoodBank } from '../models/foodBank';

export const getFoodBankByUserId = async (req: any, res: any) => {
  const { user_id } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }

    const foodBank = await FoodBank.findOne({ user_id });
    if (!foodBank) {
      return res.status(404).json({ message: 'Food bank not found' });
    }

    return res.json(foodBank);
  } catch (err) {
    console.error('Error fetching food bank by user ID:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const updateTransportationNotes = async (req: any, res: any) => {
  const { foodbankId } = req.params;
  const { transportation_notes } = req.body;

  try {
    if (!mongoose.Types.ObjectId.isValid(foodbankId)) {
      return res.status(400).json({ message: 'Invalid FoodBank ID.' });
    }

    const updated = await FoodBank.findByIdAndUpdate(
      foodbankId,
      { transportation_notes },
      { new: true }
    );

    if (!updated) {
      return res.status(404).json({ message: 'FoodBank not found.' });
    }

    return res.status(200).json(updated);
  } catch (err) {
    console.error('Error updating transportation notes:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getUserIdByFoodBank = async (req: any, res: any) => {
  const { foodbankId } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(foodbankId)) {
      return res.status(400).json({ message: 'Invalid FoodBank ID.' });
    }

    const foodBank = await FoodBank.findById(foodbankId);
    if (!foodBank) {
      return res.status(404).json({ message: 'FoodBank not found.' });
    }

    return res.status(200).json({ user_id: foodBank.user_id });
  } catch (err) {
    console.error('Error fetching user_id by foodbank ID:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};