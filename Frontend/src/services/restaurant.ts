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
    const response = await API.get("/api/restaurant");
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurants:", error);
    throw error;
  }
};

export const getRestaurantByUserId = async (userId: string) => {
  try {
    const response = await API.post("/api/restaurant/getbyuserid", {
      user_id: userId,
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching restaurant:", error);
    throw error;
  }
};

export const updateTotalDonations = async (Id: string, amount: number) => {
  try {
    const response = await API.patch("/api/restaurant/updatedonations", {
      id: Id,
      amount: amount,
    });
    return response.data; // return the updated restaurant data
  } catch (error) {
    console.error("Error updating total donations:", error);
    throw error;
  }
};



export default API;
