import axios from "axios";
import { fetchDonationRequestsForFoodbank } from "./donationRequests";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchInventory = async (foodbankId: string, available?: boolean) => {
  try {
    const params: any = {};
    if (available) params.available = "true"; 
    params.quantity_gt = 0; 

    
    const response = await API.get("/api/inventory", { params });
    const inventoryData = response.data;
    console.log("response: ", response.data)

    const donationRequests = await fetchDonationRequestsForFoodbank(foodbankId);
   
    const filteredItems = inventoryData.filter((item: any) => {
      return !donationRequests.some(
        (request: any) =>
          request.food_id && request.food_id._id?.toString() === item._id?.toString()
      );
    });
    

    return filteredItems; 
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export default API;
