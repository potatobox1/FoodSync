import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const signUp = async (userData: {
  name: string;
  email: string;
  password: string;
  contact_no: string;
  user_type: "restaurant" | "food_bank";
  location_id: string;
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
