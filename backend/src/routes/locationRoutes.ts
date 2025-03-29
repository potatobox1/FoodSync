import express from "express";
import { Location } from "../models/location";

const router = express.Router();

// GET /api/locations/:id - Fetch a location by ID
router.get("/:id", async (req: any, res: any) => {
  try {
    const { id } = req.params;
    const location = await Location.findById(id);

    if (!location) {
      return res.status(404).json({ message: "Location not found" });
    }

    res.json(location);
  } catch (error) {
    console.error("Error fetching location:", error);
    res.status(500).json({ message: "Server error" });
  }
});

export default router;
