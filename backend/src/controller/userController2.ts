
import { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User } from '../models/user';


export const getUserById = async (req: any, res: any) => {
  const { id } = req.params;
  try {
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({ message: 'Invalid user ID.' });
    }
    const user = await User.findById(id);
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    return res.json(user);
  } catch (err) {
    console.error('Error fetching user:', err);
    return res.status(500).json({ message: 'Server error' });
  }
};

export const getAllUsers = async (_req: any, res: any) => {
  try {
    const users = await User.find();
    return res.json(users);
  } catch (err) {
    console.error('Error fetching users:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};


export const testEndpoint = async (_req: any, res: any) => {
  try {
    return res.json({ message: 'Backend working' });
  } catch (err) {
    console.error('Error in testEndpoint:', err);
    return res.status(500).json({ message: 'Internal Server Error' });
  }
};



