import axios from "axios";
import { fetchDonationRequestsForFoodbank } from "./addDonationRequest";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchInventory = async (foodbankId: string, available?: boolean) => {
  try {
    const params: any = {};
    if (available) params.available = "true"; // Filter by availability
    params.quantity_gt = 0; // Only items with quantity greater than 0

    // Fetch inventory
    const response = await API.get("/api/inventory", { params });
    const inventoryData = response.data;

    // Fetch all donation requests for the given foodbank
    const donationRequests = await fetchDonationRequestsForFoodbank(foodbankId);
    console.log("Inventory Data:", inventoryData); // Log inventory data
    console.log("Donation Requests:", donationRequests); // Log donation requests
    console.log("foodbankId:", foodbankId); // Log foodbank ID
    // Filter out items that already have a donation request from the given foodbank
    const filteredItems = inventoryData.filter((item: any) => {
      // Ensure proper comparison between food_id._id and item._id
      return !donationRequests.some(
        (request: any) => request.food_id._id.toString() === item._id.toString()
      );
    });

    return filteredItems; // Return filtered items
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export default API;
