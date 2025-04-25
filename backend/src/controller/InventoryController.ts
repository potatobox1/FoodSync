
import { Request, Response } from 'express';
import { FoodItem } from '../models/foodItem';


export const getInventory = async (req: any, res:any) => {
  try {
    const { available } = req.query;
    
    const query: any = { quantity: { $gt: 0 } };
    if (available === 'true') {
      query.status = 'available';
    }

    const items = await FoodItem.find(query);
    return res.json(items);
  } catch (err) {
    console.error('Error fetching food items:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


