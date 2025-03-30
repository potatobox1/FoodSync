import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchFoodItemsByRestaurant = async (restaurantId: string) => {
  try {
    const response = await API.get(`/api/food-items/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw error;
  }
};

export default API;
