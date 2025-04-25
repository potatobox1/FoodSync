import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const signUp = async (userData: {
  uid: string; 
  name: string;
  email: string;
  contact_no: string;
  user_type: "restaurant" | "food_bank";
  address: string;
  city: string;
  country: string;
  latitude: number;
  longitude: number;
}) => {
  try {
    const response = await API.post("/api/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};



export const registerRestaurant = async (restaurantData: {
  uid: string; 
  cuisine_type: string;
}) => {
  try {
    const response = await API.post("/api/auth/addrestaurant", restaurantData);
    return response.data;
  } catch (error) {
    console.error("Error registering restaurant:", error);
    throw error;
  }
};

 
export const registerFoodBank = async (foodBankData: {
  uid: string;
  transportation_notes?: string; 
}) => {
  try {
    const response = await API.post("/api/auth/addfoodbank", foodBankData);
    return response.data;
  } catch (error) {
    console.error("Error registering food bank:", error);
    throw error;
  }
};

export const getUserByFirebaseUID = async (uid: string) => {
  try {
    const response = await API.post("/api/auth/getuser", { uid });
    return response.data.user; 
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    throw error;
  }
};



export default API;
