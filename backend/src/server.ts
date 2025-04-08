import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import cors from "cors";
import userRoutes from "./routes/userRoutes";
import authRoutes from "./routes/authRoutes"; // New import for auth routes
import inventoryRoutes from "./routes/inventoryRoutes"
import restaurantRoutes from "./routes/restaurantRoutes"
import userbyID from "./routes/userByID";
import locationRoutes from "./routes/locationRoutes";
import footitem from "./routes/fooditem"
import donationRequestRoutes from "./routes/donationRequestRoutes";
import foodbankRoutes from './routes/foodbank'; // path depends on your folder structure
import completedorders from "./routes/completedOrders"
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

// Routes
app.use("/api/users", userRoutes); // Attach user routes
app.use("/api/auth", authRoutes); // Add auth routes
app.use("/api/inventory", inventoryRoutes) // Inventory routes
app.use("/api/restaurant", restaurantRoutes) // Inventory routes
app.use("/api/user", userbyID);
app.use("/api/location", locationRoutes);
app.use("/api/fooditems", footitem)
app.use("/api/donation-requests", donationRequestRoutes)
app.use('/api/foodbank', foodbankRoutes);
app.use('/api/completed-orders', completedorders)
// Start the server
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
});
