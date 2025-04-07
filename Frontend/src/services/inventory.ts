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

    // Filter out items that already have a donation request from the given foodbank
    const filteredItems = inventoryData.filter((item: any) => {
      // Check if the food item already has a donation request for this foodbank
      return !donationRequests.some(
        (request: any) => request.food_id === item._id
      );
    });

    return filteredItems; // Return filtered items
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export default API;
