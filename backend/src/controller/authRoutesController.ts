import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user';
import { Location } from '../models/location';
import { Restaurant } from '../models/restaurant';
import { FoodBank } from '../models/foodBank';

export const signup = async (req: any, res: any) => {
  const {
    uid,
    name,
    email,
    contact_no,
    user_type,
    address,
    city,
    country,
    latitude,
    longitude
  } = req.body;
  try {
    if (!uid) return res.status(400).json({ message: 'Firebase UID is required', error: true });
    const existing = await User.findOne({ uid });
    if (existing) return res.status(400).json({ message: 'User already registered', error: true });

    const location = new Location({ address, city, country, latitude, longitude });
    await location.save();

    const user = new User({ uid, name, email, contact_no, user_type, location_id: location._id });
    await user.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: user._id,
        uid: user.uid,
        name: user.name,
        email: user.email,
        contact_no: user.contact_no,
        user_type: user.user_type,
        location_id: user.location_id
      }
    });
  } catch (err) {
    console.error('Signup error:', err);
    if (err instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(err.errors).map(e => e.message);
      return res.status(400).json({ message: 'Validation Error', errors: messages });
    }
    return res.status(500).json({ message: 'Server error during registration', error: true });
  }
};

export const getUser = async (req: any, res: any) => {
  const { uid } = req.body;
  try {
    if (!uid) return res.status(400).json({ message: 'Firebase UID is required', error: true });
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found', error: true });
    return res.status(200).json({
      message: 'User found',
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        contact_no: user.contact_no,
        user_type: user.user_type,
        location_id: user.location_id
      }
    });
  } catch (err) {
    console.error('Get User Error:', err);
    return res.status(500).json({ message: 'Server error while fetching user', error: true });
  }
};

export const addRestaurant = async (req: any, res: any) => {
  const { uid, cuisine_type } = req.body;
  try {
    if (!uid || !cuisine_type) return res.status(400).json({ message: 'Firebase UID and cuisine type are required', error: true });
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found', error: true });
    if (user.user_type !== 'restaurant') return res.status(403).json({ message: 'User is not a restaurant', error: true });
    const exists = await Restaurant.findOne({ user_id: user._id });
    if (exists) return res.status(400).json({ message: 'Restaurant already exists', error: true });

    const restaurant = new Restaurant({ user_id: user._id, cuisine_type, total_donations: 0, average_rating: 0 });
    await restaurant.save();

    return res.status(201).json({
      message: 'Restaurant registered successfully',
      restaurant: {
        id: restaurant._id,
        user_id: restaurant.user_id,
        cuisine_type: restaurant.cuisine_type,
        total_donations: restaurant.total_donations,
        average_rating: restaurant.average_rating
      }
    });
  } catch (err) {
    console.error('Add Restaurant Error:', err);
    return res.status(500).json({ message: 'Server error while adding restaurant', error: true });
  }
};

export const addFoodBank = async (req:any, res: any) => {
  const { uid, transportation_notes } = req.body;
  try {
    if (!uid) return res.status(400).json({ message: 'Firebase UID is required', error: true });
    const user = await User.findOne({ uid });
    if (!user) return res.status(404).json({ message: 'User not found', error: true });
    if (user.user_type !== 'food_bank') return res.status(400).json({ message: 'User is not a food bank', error: true });
    const exists = await FoodBank.findOne({ user_id: user._id });
    if (exists) return res.status(400).json({ message: 'Food bank already registered', error: true });

    const foodBank = new FoodBank({ user_id: user._id, transportation_notes: transportation_notes || '' });
    await foodBank.save();

    return res.status(201).json({
      message: 'Food bank registered successfully',
      foodbank: {
        id: foodBank._id,
        user_id: foodBank.user_id,
        transportation_notes: foodBank.transportation_notes
      }
    });
  } catch (err) {
    console.error('FoodBank registration error:', err);
    return res.status(500).json({ message: 'Server error during food bank registration', error: true });
  }
};