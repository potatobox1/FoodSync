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

export const getUserIdByFoodbankId = async (foodbankId: string) => {
  try {
    const response = await API.get(`/api/foodbanks/user/${foodbankId}`);
    return response.data.user_id;
  } catch (error) {
    console.error("Error fetching user ID by foodbank ID:", error);
    throw error;
  }
};

export default API;
