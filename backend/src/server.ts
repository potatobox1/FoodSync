import express from 'express';
import dotenv from 'dotenv';
import connectDB from './db';
import cors from "cors";
import { createServer } from 'http'; 
import { Server } from 'socket.io';  

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
import reviewRoutes from "./routes/review"
import chatbotRoutes from "./routes/chatbotRoutes"
import analyticsRoutes from "./routes/analyticsRoutes"; // 👈 add this at the top
import emailRoutes from './routes/email';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI as string;

// Middleware
app.use(express.json()); // For parsing JSON request bodies
app.use(cors());

// Create HTTP server and Socket.IO server
const httpServer = createServer(app);
const io = new Server(httpServer, {
  cors: {
    origin: "*", // Or specify your frontend URL
    methods: ["GET", "POST"]
  }
});

// Store socket connections per restaurant
const restaurantSockets = new Map<string, string>(); // restaurantId -> socket.id

io.on("connection", (socket) => {
  console.log(`🔌 New socket connected: ${socket.id}`);

  // Optional: Join restaurant room
  socket.on("joinRestaurantRoom", (restaurantId: string) => {
    socket.join(restaurantId);
    restaurantSockets.set(restaurantId, socket.id);
    console.log(`🍽️ Restaurant ${restaurantId} joined room`);
  });
  socket.on("joinFoodbankRoom", (foodbankId: string) => {
    socket.join(`foodbank-${foodbankId}`);
    console.log(`🏦 Foodbank ${foodbankId} joined room foodbank-${foodbankId}`);
  });

  socket.on("disconnect", () => {
    console.log(`❌ Socket disconnected: ${socket.id}`);
    // Optionally clean up restaurantSockets map
    for (const [rid, sid] of restaurantSockets.entries()) {
      if (sid === socket.id) {
        restaurantSockets.delete(rid);
        break;
      }
    }
  });
});

// Export io to use in donation request route/controller
export { io };

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
app.use('/api/review',reviewRoutes)
app.use("/api/chat", chatbotRoutes)
app.use("/api/analytics", analyticsRoutes);
app.use('/api/email',emailRoutes)

// Start the server
// app.listen(PORT, () => {
//     console.log(`🚀 Server is running on port ${PORT}`);
// });

// use this now
httpServer.listen(PORT, () => {
    console.log(`🚀 Server with Socket.IO running on port ${PORT}`);
  });
