import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

// Fetch food items by restaurant ID
interface FoodItemRequest {
    restaurant_id: string;
    quantity: number;
    expiration_date: string; // Keeping it as string to ensure correct formatting when sending JSON
    name: string;
    category: string;
   
  }

export const fetchFoodItemsByRestaurant = async (restaurantId: string) => {
  try {
    const response = await API.get(`/api/fooditems/${restaurantId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching food items:", error);
    throw error;
  }
};

// Add a new food item
export const addFoodItem = async (foodItemData:FoodItemRequest) => {
  try {
    const response = await API.post("/api/fooditems/additem", foodItemData);
    return response.data;
  } catch (error) {
    console.error("Error adding food item:", error);
    throw error;
  }
};

export const updateFoodItemQuantity = async (itemId: string, quantity: number) => {
  try {
    const response = await API.patch(`/api/fooditems/update-quantity/${itemId}`, {
      quantity,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating food item quantity:", error);
    throw error;
  }
};

export const updateFoodItemStatus = async (
  itemId: string,
  status: "available" | "expired" | "sold"
) => {
  try {
    const response = await API.patch(`/api/fooditems/update-status/${itemId}`, {
      status,
    });
    return response.data;
  } catch (error) {
    console.error("Error updating food item status:", error);
    throw error;
  }
};

export const fetchFoodItemById = async (itemId: string) => {
  try {
    const response = await API.get(`/api/fooditems/get-item/${itemId}`);  
    return response.data;
  } catch (error) {
    console.error("Error fetching food item by ID:", error);
    throw error;
  }
};

export default API;
