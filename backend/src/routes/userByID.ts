import express from "express";
import { User } from "../models/user";

const router = express.Router();

// GET /api/users/:id - Fetch a user by ID
router.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const user = await User.findById(id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user);
  } catch (error) {
    console.error("Error fetching user:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
