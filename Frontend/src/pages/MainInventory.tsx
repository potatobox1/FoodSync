"use client"
import "../styles/main_inventory.css";

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
import axios from "axios";

// Define types for API responses
type Restaurant = {
  _id: string;
  user_id: string;
  expiry_date: string;
};

type User = {
  _id: string;
  name: string;
  location_id: string;
};

type Location = {
  _id: string;
  latitude: number;
  longitude: number;
};

// Type for additional details fetched for each item
type ItemDetails = {
  restaurantName: string;
  expiresIn: string;
  location: {
    latitude: number;
    longitude: number;
  };
};

export default function MainInventory() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items");
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [minQuantity, setMinQuantity] = useState<number>(0);
  const [sortByLocation, setSortByLocation] = useState<boolean>(false);
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 40.7128, // Default to NYC coordinates
    longitude: -74.006,
  });

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude,
          });
        },
        (err) => {
          console.warn("Geolocation error:", err);
          // Continue with default location
        }
      );
    }
  }, []);

  // Fetch inventory data
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const inventory = await fetchInventory(true);
        
        if (!inventory || !Array.isArray(inventory)) {
          throw new Error("Invalid inventory data received");
        }
        
        // Filter out items with invalid or missing restaurant_id
        const validInventoryItems = inventory.filter(item => 
          item && item.restaurant_id && typeof item.restaurant_id === 'string'
        );
        
        if (validInventoryItems.length < inventory.length) {
          console.warn(`Filtered out ${inventory.length - validInventoryItems.length} items with missing restaurant_id`);
        }
        
        const itemsWithDetails = await Promise.all(
          validInventoryItems.map(async (item: FoodItem) => {
            try {
              const details = await fetchDetailsByFoodItem(item.restaurant_id, item.expiration_date);
              return { ...item, ...details };
            } catch (detailError) {
              console.error(`Error fetching details for item ${item._id}:`, detailError);
              // Return item with default values for missing details
              return { 
                ...item, 
                restaurantName: "Unknown Restaurant", 
                expiresIn: calculateExpiry(item.expiration_date),
                location: item.location || { latitude: 0, longitude: 0 } 
              };
            }
          })
        );
        
        setFoodItems(itemsWithDetails);
        // console.log("Final fetched details:", itemsWithDetails);

        setError(null);
      } catch (error) {
        console.error("Error fetching food items:", error);
        setError("Failed to load inventory data. Please try again later.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, []);

  const fetchDetailsByFoodItem = async (restaurantId: string, expiration_date: Date | string): Promise<ItemDetails> => {
    try {
      // Default values in case of errors
      const defaultDetails: ItemDetails = {
        restaurantName: "Unknown Restaurant",
        expiresIn: "Unknown",
        location: {
          latitude: 0,
          longitude: 0,
        },
      };

      if (!restaurantId) {
        console.warn("Missing restaurantId, using default details");
        return defaultDetails;
      }

      let restaurant: Restaurant;
      try {
        restaurant = await fetchRestaurantById(restaurantId);
      } catch (error) {
        // Check if it's a 404 error
        if (axios.isAxiosError(error) && error.response?.status === 404) {
          console.warn(`Restaurant not found (ID: ${restaurantId}), using default details`);
          return defaultDetails;
        }
        throw error; // Re-throw other errors
      }
      
      if (!restaurant || !restaurant.user_id) {
        console.warn(`Invalid restaurant data for ID: ${restaurantId}, using default details`);
        return defaultDetails;
      }
      
      let user: User;
      try {
        user = await fetchUserById(restaurant.user_id);
      } catch (error) {
        console.warn(`Error fetching user (ID: ${restaurant.user_id}), using default details`);
        return {
          ...defaultDetails,
          expiresIn: calculateExpiry(restaurant?.expiry_date || ""),
        };
      }
      
      if (!user || !user.location_id) {
        return {
          restaurantName: user?.name || "Unknown Restaurant",
          expiresIn: calculateExpiry(restaurant?.expiry_date || ""),
          location: { latitude: 0, longitude: 0 },
        };
      }
      
      let location: Location;
      try {
        location = await fetchLocationById(user.location_id);
      } catch (error) {
        console.warn(`Error fetching location (ID: ${user.location_id}), using default location`);
        return {
          restaurantName: user.name,
          expiresIn: calculateExpiry(restaurant.expiry_date),
          location: { latitude: 0, longitude: 0 },
        };
      }
      
      return { 
        restaurantName: user.name,
        expiresIn: calculateExpiry(expiration_date),
        location: {
          latitude: location?.latitude || 0,
          longitude: location?.longitude || 0,
        },
      };
    } catch (error) {
      console.error("Error fetching details for restaurant", restaurantId, ":", error);
      // Return default values instead of throwing
      return {
        restaurantName: "Unknown Restaurant",
        expiresIn: "Unknown",
        location: { latitude: 0, longitude: 0 },
      };
    }
  };

  function calculateExpiry(expiryDate: Date | string): string {
    if (!expiryDate) return "Unknown";
    
    const now = new Date();
    const expiry = expiryDate instanceof Date ? expiryDate : new Date(expiryDate);
    
    // Check if date is valid
    if (isNaN(expiry.getTime())) return "Invalid date";
    
    const diffDays = Math.ceil((expiry.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    return diffDays < 0 ? "Expired" : `${diffDays} days left`;
  }

  // Filter items based on selected category and minimum quantity
  const filteredItems = foodItems
    .filter((item) => item.status === "available")
    .filter((item) => selectedCategory === "All Items" || item.category === selectedCategory)
    .filter((item) => item.quantity >= minQuantity);

  // Sort items by distance if sortByLocation is true
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortByLocation) return 0;
    const distanceA = calculateDistance(userLocation, a.location);
    const distanceB = calculateDistance(userLocation, b.location);
    return distanceA - distanceB;
  });

  function calculateDistance(
    userLoc: { latitude: number; longitude: number }, 
    itemLoc?: { latitude: number; longitude: number }
  ): number {
    if (!itemLoc || typeof itemLoc.latitude !== 'number' || typeof itemLoc.longitude !== 'number') {
      return Number.MAX_SAFE_INTEGER; // Place items with missing locations at the end
    }
    
    // Haversine formula to calculate distance between two points on Earth
    const R = 6371; // Radius of the Earth in km
    const dLat = deg2rad(itemLoc.latitude - userLoc.latitude);
    const dLon = deg2rad(itemLoc.longitude - userLoc.longitude);
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(userLoc.latitude)) * Math.cos(deg2rad(itemLoc.latitude)) *
      Math.sin(dLon / 2) * Math.sin(dLon / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c; // Distance in km
  }

  function deg2rad(deg: number): number {
    return deg * (Math.PI / 180);
  }

  return (
    <main className="min-h-screen bg-white">
      <Header />
      <div className="container mx-auto px-4 py-6">
        <h1 className="text-2xl font-bold mb-6">Available Food Donations</h1>

        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {error}
          </div>
        )}

        {loading ? (
          <div className="flex justify-center items-center py-12">
            <svg className="animate-spin h-8 w-8 text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        ) : (
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

              {sortedItems.length > 0 ? (
                <FoodListings items={sortedItems} />
              ) : (
                <div className="text-center py-8 bg-gray-50 rounded-lg">
                  <p className="text-gray-500">No food donations match your filters.</p>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </main>
  )
}