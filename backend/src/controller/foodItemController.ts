import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { FoodItem } from '../models/foodItem';
import { io } from '../server';

export const getFoodItemsByRestaurant = async (req: any, res:any) => {
  const { restaurantId } = req.params;
  try {
    if (!restaurantId) {
      return res.status(400).json({ error: 'Restaurant ID is required.' });
    }
    const items = await FoodItem.find({ restaurant_id: restaurantId });
    return res.json(items);
  } catch (err) {
    console.error('Error fetching food items:', err);
    return res.status(500).json({ error: 'Internal server error' });
  }
};

export const updateFoodItemQuantity = async (req: any, res: any) => {
  const { itemId } = req.params;
  const { quantity } = req.body;
  try {
    if (!itemId || quantity === undefined) {
      return res.status(400).json({ message: 'Item ID and quantity are required.' });
    }
    if (typeof quantity !== 'number' || quantity < 0) {
      return res.status(400).json({ message: 'Quantity must be a non-negative number.' });
    }
    const updated = await FoodItem.findByIdAndUpdate(
      itemId,
      { $set: { quantity } },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Food item not found.' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error updating quantity:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const addFoodItem = async (req: any, res: any) => {
  try {
    const { restaurant_id, quantity, expiration_date, name, category } = req.body;

    if (!restaurant_id || !quantity || !expiration_date || !name || !category) {
      return res.status(400).json({ message: "All fields are required." });
    }
    const restaurantObjectId = new mongoose.Types.ObjectId(restaurant_id);

    const newFoodItem = new FoodItem({
      restaurant_id: restaurantObjectId,
      quantity,
      expiration_date: new Date(expiration_date),
      name,
      category,
      status: "available",
    });

    const savedItem = await newFoodItem.save();

    // io.emit("newFoodItemAvailable", savedItem);

    res.status(201).json(savedItem);
  } catch (error) {
    console.error("Error saving food item:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};

export const updateFoodItemStatus = async (req: any, res: any) => {
  const { foodItemId } = req.params;
  const { status } = req.body;
  try {
    if (!mongoose.Types.ObjectId.isValid(foodItemId)) {
      return res.status(400).json({ message: 'Invalid food item ID.' });
    }
    const validStatuses = ['available', 'expired', 'sold'];
    if (!validStatuses.includes(status)) {
      return res.status(400).json({ message: 'Invalid status value.' });
    }
    const updated = await FoodItem.findByIdAndUpdate(
      foodItemId,
      { status },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Food item not found.' });
    }
    return res.json(updated);
  } catch (err) {
    console.error('Error updating food item status:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};

export const getFoodItemById = async (req: any, res: any) => {
  const { foodId } = req.params;
  try {
    if (!foodId) {
      return res.status(400).json({ message: 'Food item ID is required.' });
    }
    const item = await FoodItem.findById(foodId);
    if (!item) {
      return res.status(404).json({ message: 'Food item not found.' });
    }
    return res.json(item);
  } catch (err) {
    console.error('Error fetching food item:', err);
    return res.status(500).json({ message: 'Internal server error' });
  }
};