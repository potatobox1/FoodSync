import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchInventory = async (available?: boolean) => {
  try {
    const response = await API.get("/api/inventory", {
      params: available ? { available: "true" } : {},
    });
    return response.data;
  } catch (error) {
    console.error("Error fetching inventory:", error);
    throw error;
  }
};

export default API;
