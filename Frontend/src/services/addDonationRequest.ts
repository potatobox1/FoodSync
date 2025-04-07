import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const addDonationRequest = async (
  donation: {
    foodbank_id: string;
    food_id: string;
    requested_quantity: number;
    status: "pending" | "accepted" | "cancelled" | "completed";
  }
) => {
  try {
    const response = await API.post("/api/donation-requests/add-donation-request", donation);
    return response.data;
  } catch (error) {
    console.error("Error adding donation request:", error);
    throw error;
  }
};

export default API;
