import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });

export const addReview = async ({
  foodbank_id,
  restaurant_id,
  food_id,
  rating,
  feedback,
}: {
  foodbank_id?: string;
  restaurant_id?: string;
  food_id: string;
  rating: number;
  feedback: string;
}) => {
  try {
    const response = await API.post("/api/review/addreview", {
      foodbank_id,
      restaurant_id,
      food_id,
      rating,
      feedback,
    });

    return response.data;
  } catch (error) {
    console.error("Error adding review:", error);
    throw error;
  }
};

export const fetchReviewsByRestaurant = async (restaurantId: string) => {
    try {
      const response = await API.get(`/api/review/restaurant/${restaurantId}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching reviews by restaurant ID:", error);
      throw error;
    }
  };

export const getExistingReview = async (foodbank_id: string, food_id: string) => {
  try {
    const response = await API.get(`/api/review/check`, {
      params: { foodbank_id, food_id },
    })
    return response.data 
  } catch (error) {
    console.error("Error checking review:", error)
    return { exists: false, rating: 0 }
  }
}
  

export default API;
