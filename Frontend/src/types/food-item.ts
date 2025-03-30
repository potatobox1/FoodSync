export type FoodItem = {
  _id: string;
  restaurant_id: string;
  quantity: number;
  expiration_date: Date;
  name: string;
  category: string;
  status: "available" | "expired";
  created_at: Date;
  location?: { latitude: number; longitude: number };
  restaurantName?: string;
  expiresIn?: string;
};
