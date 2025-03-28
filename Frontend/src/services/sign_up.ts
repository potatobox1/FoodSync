import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const signUp = async (userData: {
  name: string;
  email: string;
  contact_no: string;
  user_type: "restaurant" | "food_bank";
  address: string,
  city: string,
  country: string,
  latitude: number,
  longitude: number,
}) => {
  try {
    const response = await API.post("/api/auth/signup", userData);
    return response.data;
  } catch (error) {
    console.error("Error signing up:", error);
    throw error;
  }
};

export default API;
