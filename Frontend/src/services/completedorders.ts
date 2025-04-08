import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const addCompletedOrder = async (order: {
  restaurant_id: string;
  food_id: string;
  quantity: number;
}) => {
  try {
    const response = await API.post("/api/completed-orders/add", order);
    return response.data;
  } catch (error) {
    console.error("Error adding completed order:", error);
    throw error;
  }
};
