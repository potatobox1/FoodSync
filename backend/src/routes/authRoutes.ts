import { Router, Request, Response, NextFunction } from 'express';
import mongoose from 'mongoose';
import {User} from '../models/user';
import { Location } from '../models/location';

const router = Router();

router.post('/signup', async (req: any, res: any) => {
  try {
    const { 
      name, 
      email, 
      password, 
      contact_no, 
      user_type, 
      location_id 
    } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ 
        message: 'User with this email already exists',
        error: true 
      });
    }
    const defaultLocation = await Location.findOne();
    if (!defaultLocation) {
      return res.status(500).json({ message: 'No default location found', error: true });
    }
    // Create new user
    const newUser = new User({
      name,
      email,
      password,
      contact_no,
      user_type,
      location_id: defaultLocation._id // using default for now
    });

    // Save user to database
    await newUser.save();

    // Respond with success message
    res.status(201).json({
      message: 'User registered successfully',
      user: {
        id: newUser._id,
        name: newUser.name,
        email: newUser.email,
        user_type: newUser.user_type
      }
    });

  } catch (error) {
    console.error('Signup error:', error);

    // Handle validation errors
    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map(err => err.message);
      return res.status(400).json({ 
        message: 'Validation Error', 
        errors: messages 
      });
    }

    // Generic server error
    res.status(500).json({ 
      message: 'Server error during registration',
      error: true 
    });
  }
});

export default router;