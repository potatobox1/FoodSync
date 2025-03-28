import { Router, Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user';
import { Location } from '../models/location';

const router = Router();

router.post('/signup', async (req: any, res: any) => {
  try {
    const { 
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

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists',
        error: true 
      });
    }

    // Create a new location
    const newLocation = new Location({
      address,
      city,
      country,
      latitude,
      longitude
    });

    await newLocation.save();

    // Create a new user with the location reference
    const newUser = new User({
      name,
      email,
      contact_no,
      user_type,
      location_id: newLocation._id
    });

    await newUser.save();

    return res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        contact_no: newUser.contact_no,
        user_type: newUser.user_type,
        location_id: newUser.location_id
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: messages 
      });
    }

    return res.status(500).json({ 
      message: 'Server error during registration',
      error: true 
    });
  }
});

export default router;
