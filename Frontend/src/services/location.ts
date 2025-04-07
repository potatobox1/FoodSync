import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchLocationById = async (locationId: string) => {
  try {
    const response = await API.get(`/api/location/${locationId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching location:", error);
    throw error;
  }
};

export default API;
