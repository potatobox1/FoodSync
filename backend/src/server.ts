import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes"; // New import for auth routes

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors());

// Connect to MongoDB
if (!MONGO_URI) {
    console.error("❌ MongoDB URI is missing in the environment variables.");
    process.exit(1);
}

connectDB(MONGO_URI);

// Sample route
app.use("/api/users", userRoutes); // Attach user routes
app.use("/api/auth", authRoutes); // Add auth routes

// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
