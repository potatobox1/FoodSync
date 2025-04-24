// controllers/restaurantController.ts
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Restaurant } from '../models/restaurant';

// GET /api/restaurant - Fetch all restaurants
export const getAllRestaurants = async (req:any, res: any) => {
  try {
    const restaurants = await Restaurant.find();
    return res.json(restaurants);
  } catch (err) {
    console.error('Error fetching restaurants:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// GET /api/restaurant/:id - Fetch a restaurant by ID
export const getRestaurantById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid restaurant ID.' });
    }
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    return res.json(restaurant);
  } catch (err) {
    console.error('Error fetching restaurant:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// POST /api/restaurant/getbyuserid - Fetch a restaurant by user ID
export const getRestaurantByUserId = async (req: any, res: any) => {
  const { user_id } = req.body;
  try {
    if (!user_id) {
      return res.status(400).json({ message: 'user_id is required' });
    }
    const restaurant = await Restaurant.findOne({ user_id });
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    return res.json(restaurant);
  } catch (err) {
    console.error('Error fetching restaurant by user ID:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

// PATCH /api/restaurant/updatedonations - Update total donations
export const updateTotalDonations = async (req: any, res: any) => {
  const { id, amount } = req.body;
  try {
    if (!id || typeof amount !== 'number' || amount <= 0) {
      return res.status(400).json({ message: 'Valid id and positive amount are required' });
    }
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid restaurant ID.' });
    }
    const restaurant = await Restaurant.findById(id);
    if (!restaurant) {
      return res.status(404).json({ message: 'Restaurant not found' });
    }
    restaurant.total_donations = (restaurant.total_donations || 0) + amount;
    await restaurant.save();
    return res.json({ message: 'Total donations updated', restaurant });
  } catch (err) {
    console.error('Error updating total donations:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};



