import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const addReview = async ({
  foodbank_id,
  restaurant_id,
  food_item_id,
  rating,
  feedback,
}: {
  foodbank_id?: string;
  restaurant_id?: string;
  food_item_id: string;
  rating: number;
  feedback: string;
}) => {
  try {
    const response = await API.post("/api/review/addreview", {
      foodbank_id,
      restaurant_id,
      food_item_id,
      rating,
      feedback,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export default API;
