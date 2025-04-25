import axios from "axios";

const API = axios.create({ baseURL: import.meta.env.VITE_API_URL });


export const fetchFoodbankSummary = async (foodbankId: string) => {
  try {
    const response = await API.get(`/api/analytics/foodbank/summary/${foodbankId}`);
    return response.data;
  } catch (error) {
    console.error("Error fetching foodbank summary:", error);
    throw error;
  }
};

export const fetchTopRestaurants = async (foodbankId: string) => {
    const response = await API.get(`/api/analytics/foodbank/top-restaurants/${foodbankId}`)
    return response.data
  }

export const fetchCategoryBreakdown = async (foodbankId: string) => {
    const response = await API.get(`/api/analytics/foodbank/category-breakdown/${foodbankId}`)
    return response.data 
}

export const fetchDonationsChartData = async (foodbankId: string, range: string) => {
    try {
      const response = await API.get(`/api/analytics/foodbank/donations-chart/${foodbankId}`, {
        params: { range }
      });
      return response.data;
    } catch (error) {
      console.error("Error fetching donations chart data:", error);
      throw error;
    }
  };


export const fetchReviewTrends = async (foodbankId: string, range: string) => {
    const response = await API.get(`/api/analytics/foodbank/reviews-chart/${foodbankId}?range=${range}`);
    return response.data;
    };

export const fetchPickupMapData = async (foodbankId: string) => {
    const response = await API.get(`/api/analytics/foodbank/pickup-map/${foodbankId}`);
    return response.data;
    };


export const fetchRestaurantSummary = async (restaurantId: string) => {
  const response = await API.get(`/api/analytics/restaurant/summary/${restaurantId}`);
  return response.data;
};


export const fetchRestaurantCategoryBreakdown = async (restaurantId: string) => {
  const response = await API.get(`/api/analytics/restaurant/category-breakdown/${restaurantId}`);
  return response.data;
};

export const fetchRestaurantOrdersChart = async (restaurantId: string, range: string) => {
  const response = await API.get(`/api/analytics/restaurant/orders-chart/${restaurantId}`, {
    params: { range },
  });
  return response.data;
};

export const fetchTopFoodbanks = async (restaurantId: string) => {
  const response = await API.get(`/api/analytics/restaurant/top-foodbanks/${restaurantId}`);
  return response.data;
};

export const fetchRestaurantPickupMapData = async (restaurantId: string) => {
  const response = await API.get(`/api/analytics/restaurant/pickup-map/${restaurantId}`);
  return response.data;
};

export const fetchRestaurantReviewTrends = async (restaurantId: string, range: string) => {
  const response = await API.get(`/api/analytics/restaurant/reviews-chart/${restaurantId}?range=${range}`);
  return response.data;
};