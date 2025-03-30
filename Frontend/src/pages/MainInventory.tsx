"use client"

import { useState, useEffect } from "react"
import Header from "../components/header"
import CategoryFilter from "../components/category-filter"
import FoodListings from "../components/food-listings"
import FilterSidebar from "../components/filter-sidebar"
import { type FoodItem, determineSubCategory, formatExpiryTime } from "../types/food-item"
import "../styles/main_inventory.css"
import { fetchInventory } from "../services/inventory";
import { fetchRestaurantById } from "../services/restaurantByID";
import { fetchUserById } from "../services/userByID";
import { fetchLocationById } from "../services/locationByID";
// import axios from "axios";

export default function MainInventory() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>([])
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [minQuantity, setMinQuantity] = useState<number>(0)
  const [sortByLocation, setSortByLocation] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true) // Added loading state
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number }>({
    latitude: 40.7128,
    longitude: -74.006,
  })

  // Get user's location on component mount
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        setUserLocation({
          latitude: position.coords.latitude,
          longitude: position.coords.longitude,
        })
      })
    }
  }, [])

  useEffect(() => {
    async function fetchData() {
      setLoading(true)
      try {
        const inventory = await fetchInventory()
        const itemsWithDetails = await Promise.all(
          inventory.map(async (item: any) => {
            const restaurant = await fetchRestaurantById(item.restaurant_id)
            const user = await fetchUserById(restaurant.user_id)
            const location = await fetchLocationById(user.location_id)
            const subCategory = determineSubCategory(item.category)
            const expiresIn = formatExpiryTime(item.expiration_date)

            return {
              ...item,
              restaurant: {
                _id: restaurant._id,
                name: user.name,
                location: {
                  latitude: location.latitude,
                  longitude: location.longitude,
                },
              },
              subCategory,
              expiresIn,
            } as FoodItem
          })
        )
        setFoodItems(itemsWithDetails)
      } catch (error) {
        console.error("Error fetching data:", error)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  // Filter items based on selected category and minimum quantity
  const filteredItems = foodItems
    .filter((item) => selectedCategory === "All Items" || item.subCategory === selectedCategory)
    .filter((item) => item.quantity >= minQuantity)

  // Sort by restaurant location if enabled
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortByLocation) return 0
    const distanceA = calculateDistance(userLocation, a.restaurant.location)
    const distanceB = calculateDistance(userLocation, b.restaurant.location)
    return distanceA - distanceB
  })

  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(userLoc: { latitude: number; longitude: number }, restLoc: { latitude: number; longitude: number }) {
    const R = 6371
    const dLat = deg2rad(restLoc.latitude - userLoc.latitude)
    const dLon = deg2rad(restLoc.longitude - userLoc.longitude)
    const a = Math.sin(dLat / 2) * Math.sin(dLat / 2) + Math.cos(deg2rad(userLoc.latitude)) * Math.cos(deg2rad(restLoc.latitude)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return R * c
  }

  function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
  }

  return (
    <main className="min-h-screen">
      <Header />
      <div className="container main-content">
        <h1 className="page-title">Available Food Donations</h1>

        <div className="flex flex-col md-flex-row gap-6">
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
              <button onClick={() => setIsFilterOpen(!isFilterOpen)} className="filter-button">
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
                  className="filter-icon"
                >
                  <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
                </svg>
                Filters
              </button>
            </div>

            {loading ? ( // Show loading state
              <div className="text-center text-gray-500">Loading...</div>
            ) : (
              <FoodListings items={sortedItems} />
            )}
            </div>
        </div>
      </div>
    </main>
  )
}

