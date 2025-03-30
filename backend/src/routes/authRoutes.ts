import { Router, Request, Response } from "express";
import mongoose from "mongoose";
import { User } from "../models/user";
import { Location } from "../models/location";

const router = Router();

router.post("/signup", async (req: any, res: any) => {
  try {
    const {
      uid, // Firebase UID
      name,
      email,
      contact_no,
      user_type,
      address,
      city,
      country,
      latitude,
      longitude,
    } = req.body;

    if (!uid) {
      return res.status(400).json({
        message: "Firebase UID is required",
        error: true,
      });
    }

    // Check if user already exists by UID
    const existingUser = await User.findOne({ uid });
    if (existingUser) {
      return res.status(400).json({
        message: "User already registered",
        error: true,
      });
    }

    // Create a new location
    const newLocation = new Location({
      address,
      city,
      country,
      latitude,
      longitude,
    });

    await newLocation.save();

    // Create a new user with the location reference and Firebase UID
    const newUser = new User({
      uid, // Store Firebase UID
      name,
      email,
      contact_no,
      user_type,
      location_id: newLocation._id,
    });

    await newUser.save();

    return res.status(201).json({
      message: "User registered successfully",
      user: {
        id: newUser._id,
        uid: newUser.uid, // Return Firebase UID
        name: newUser.name,
        email: newUser.email,
        contact_no: newUser.contact_no,
        user_type: newUser.user_type,
        location_id: newUser.location_id,
      },
    });
  } catch (error) {
    console.error("Signup error:", error);

    if (error instanceof mongoose.Error.ValidationError) {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({
        message: "Validation Error",
        errors: messages,
      });
    }

    return res.status(500).json({
      message: "Server error during registration",
      error: true,
    });
  }
});

// Fetch user ID by Firebase UID
router.post("/getuser", async (req: any, res: any) => {
  try {
    const { uid } = req.body;

    if (!uid) {
      return res.status(400).json({
        message: "Firebase UID is required",
        error: true,
      });
    }

    // Find user by UID
    const user = await User.findOne({ uid });

    if (!user) {
      return res.status(404).json({
        message: "User not found",
        error: true,
      });
    }

    return res.status(200).json({
      message: "User found",
      user: {
        id: user._id, // Return the MongoDB user ID
        name: user.name,
        email: user.email,
        contact_no: user.contact_no,
        user_type: user.user_type,
        location_id: user.location_id,
      },
    });
  } catch (error) {
    console.error("Get User Error:", error);

    return res.status(500).json({
      message: "Server error while fetching user",
      error: true,
    });
  }
});


export default router;
