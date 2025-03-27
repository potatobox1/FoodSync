import express from "express";
import { User } from "../models/user";

const router = express.Router();

// GET all users
router.get("/", async (req, res) => {
  try {
    const users = await User.find(); // Fetches location details too
    res.json(users);
  } catch (error) {
    res.status(500).json({ error: "Internal Server Error" });
  }
});

export default router;
