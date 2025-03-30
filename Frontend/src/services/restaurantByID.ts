import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchRestaurantById = async (restaurantId: string) => {
  try {
    const response = await API.get(`/api/restaurantbyid/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    throw error;
  }
};

export default API;
