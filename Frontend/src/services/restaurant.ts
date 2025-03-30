import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchRestaurantById = async (restaurantId: string) => {
  try {
    const response = await API.get(`/api/restaurant/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    throw error;
  }
};

export const fetchRestaurants = async () => {
  try {
    const response = await API.get("/api/restaurants");
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export default API;
