import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const fetchUserById = async (userId: string) => {
  try {
    const response = await API.get(`/api/user/${userId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching user:", error);
    throw error;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await API.get("/api/users");
    return response.data;
  } catch (error) {
    console.error("Error fetching data:", error);
    return [];
  }
};

export default API;
