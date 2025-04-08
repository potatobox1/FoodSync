import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const signUp = async (userData: {
  uid: string; // Added Firebase UID
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


// Registers a restaurant in the database.
export const registerRestaurant = async (restaurantData: {
  uid: string; // Firebase UID
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

 //Registers a food bank in the database. 
export const registerFoodBank = async (foodBankData: {
  uid: string; // Firebase UID
  transportation_notes?: string; // Optional
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
    return response.data.user; // returns user object
  } catch (error) {
    console.error("Error fetching user by UID:", error);
    throw error;
  }
};



export default API;
