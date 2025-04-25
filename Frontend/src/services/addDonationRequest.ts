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

export const fetchDonationRequestsForRestaurant = async (restaurantId: string) => {
  try {
    const response = await API.get(`/api/donation-requests/restaurant/${restaurantId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching donation requests for restaurant:", error);
    throw error;
  }
};

export const fetchDonationRequestsForFoodbank = async (foodbankId: string) => {
  try {
    const response = await API.get(`/api/donation-requests/foodbank/${foodbankId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching donation requests for foodbank:", error);
    throw error;
  }
};

export const getDonationRequestById = async (requestId: string) => {
  try {
    const response = await API.get(`/api/donation-requests/getReq/${requestId}`);
    return response.data; 
  } catch (error) {
    console.error("Error fetching donation request by ID:", error);
    throw error;
  }
};


export const updateDonationRequestStatus = async (
  requestId: string,
  status: "completed" | "cancelled" | "accepted"
) => {
  try {
    const response = await API.patch(`/api/donation-requests/update-status/${requestId}`, { status });
    return response.data; 
  } catch (error) {
    console.error("Error updating donation request status:", error);
    throw error;
  }
};



export default API;
