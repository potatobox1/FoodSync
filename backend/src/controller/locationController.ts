// controllers/locationController.ts
import { Request, Response } from 'express';
import { Location } from '../models/location';

// GET /api/locations/:id
export const getLocationById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    const location = await Location.findById(id);
    if (!location) {
      return res.status(404).json({ message: 'Location not found' });
    }
    return res.json(location);
  } catch (err) {
    console.error('Error fetching location:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};


