import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });


export const getFoodBankByUserId = async (userId: string) => {
    try {
      const response = await API.post("/api/foodbank/getbyuserid", {
        user_id: userId,
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching food bank:", error);
      throw error;
    }
  };
  