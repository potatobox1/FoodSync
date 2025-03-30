"use client"
import "../styles/main_inventory.css"; // Import the new CSS file

import { useState, useEffect } from "react"
import Header from "../components/header"
import CategoryFilter from "../components/category-filter"
import FoodListings from "../components/food-listings"
import FilterSidebar from "../components/filter-sidebar"
import type { FoodItem } from "../types/food-item"
import { fetchInventory } from "../services/inventory";
import { fetchRestaurantById } from "../services/restaurantByID";
import { fetchUserById } from "../services/userByID";
import { fetchLocationById } from "../services/locationByID";


export default function MainInventory() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [sortByLocation, setSortByLocation] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 40.7128,
    longitude: -74.006,
  });

  // Get user's location on component mount
  useEffect(() => {
    const fetchData = async () => {
      try {
        const inventory = await fetchInventory(true);
        const itemsWithLocation = await Promise.all(
          inventory.map(async (item: FoodItem) => {
            const location = await fetchLocationByFoodItem(item.restaurant_id);
            return { ...item, location };
          })
        );
        setFoodItems(itemsWithLocation);
      } catch (error) {
        console.error("Error fetching food items:", error);
      }
    };
    fetchData();
  }, []);

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        });
      });
    }
  }, []);

  const fetchLocationByFoodItem = async (restaurantId: string) => {
    try {
      const restaurant = await fetchRestaurantById(restaurantId);
      const user = await fetchUserById(restaurant.user_id);
      const location = await fetchLocationById(user.location_id);
      return { 
        latitude: location?.latitude || 0, 
        longitude: location?.longitude || 0 
      };
      } catch (error) {
      console.error("Error fetching location:", error);
      return { latitude: 0, longitude: 0 };
    }
  };

  // Filter items based on selected category and minimum quantity
  const filteredItems = foodItems
    .filter((item) => item.status === "available")
    .filter((item) => selectedCategory === "All Items" || item.category === selectedCategory)
    .filter((item) => item.quantity >= minQuantity);

  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortByLocation) return 0;
    return calculateDistance(userLocation, a.location) - calculateDistance(userLocation, b.location);
  });

  function calculateDistance(userLoc: { latitude: number; longitude: number }, loc?: { latitude: number; longitude: number }) {
    if (!loc) return Number.MAX_SAFE_INTEGER;
    const R = 6371;
    const dLat = deg2rad(loc.latitude - userLoc.latitude);
    const dLon = deg2rad(loc.longitude - userLoc.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLoc.latitude)) * Math.cos(deg2rad(loc.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180);
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Available Food Donations</h1>

        <div className="flex flex-col md:flex-row gap-6">
          {isFilterOpen && (
            <FilterSidebar
              minQuantity={minQuantity}
              setMinQuantity={setMinQuantity}
              sortByLocation={sortByLocation}
              setSortByLocation={setSortByLocation}
            />
          )}

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6">
              <CategoryFilter selectedCategory={selectedCategory} setSelectedCategory={setSelectedCategory} />
              <button
                onClick={() => setIsFilterOpen(!isFilterOpen)}
                className="flex items-center gap-2 px-4 py-2 rounded-md bg-gray-100 hover:bg-gray-200"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="24"
                  height="24"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  className="w-5 h-5"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
            </div>

            <FoodListings items={sortedItems} />
          </div>
        </div>
      </div>
    </main>
  )
}

