"use client"

import { useState, useEffect } from "react"
import Header from "../components/header"
import CategoryFilter from "../components/category-filter"
import FoodListings from "../components/food-listings"
import FilterSidebar from "../components/filter-sidebar"
import { type FoodItem, type Restaurant, determineSubCategory, formatExpiryTime } from "../types/food-item"
import "../styles/main_inventory.css"

// Sample restaurant data with location information
const restaurants: Restaurant[] = [
  {
    _id: "1",
    name: "Italian Corner Restaurant",
    location: { latitude: 40.7128, longitude: -74.006 },
  },
  {
    _id: "2",
    name: "Spice Garden",
    location: { latitude: 40.758, longitude: -73.9855 },
  },
  {
    _id: "3",
    name: "Sweet Delights",
    location: { latitude: 40.7308, longitude: -73.9973 },
  },
  {
    _id: "4",
    name: "Fresh Brews Cafe",
    location: { latitude: 40.7448, longitude: -73.9867 },
  },
]

// Sample food items data based on the MongoDB schema
const rawFoodItems = [
  {
    _id: "1",
    restaurant_id: "1",
    quantity: 12,
    expiration_date: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    name: "Palao",
    category: "Rice",
    status: "available",
    created_at: new Date(),
  },
  {
    _id: "2",
    restaurant_id: "2",
    quantity: 30,
    expiration_date: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    name: "Daal",
    category: "Curry",
    status: "available",
    created_at: new Date(),
  },
  {
    _id: "3",
    restaurant_id: "3",
    quantity: 50,
    expiration_date: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    name: "Lemonade",
    category: "Beverage",
    status: "available",
    created_at: new Date(),
  },
  {
    _id: "4",
    restaurant_id: "4",
    quantity: 25,
    expiration_date: new Date(Date.now() + 6 * 60 * 60 * 1000), // 6 hours from now
    name: "Halwa",
    category: "Dessert",
    status: "available",
    created_at: new Date(),
  },
]

// Process the raw food items to include restaurant data and derived properties
const initialFoodItems: FoodItem[] = rawFoodItems.map((item) => {
  const restaurant = restaurants.find((r) => r._id === item.restaurant_id) || restaurants[0]
  const subCategory = determineSubCategory(item.category)
  const expiresIn = formatExpiryTime(item.expiration_date)

  return {
    ...item,
    restaurant,
    subCategory,
    expiresIn,
  } as FoodItem
})

export default function MainInventory() {
  const [foodItems, setFoodItems] = useState<FoodItem[]>(initialFoodItems)
  const [selectedCategory, setSelectedCategory] = useState<string>("All Items")
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const [minQuantity, setMinQuantity] = useState<number>(0)
  const [sortByLocation, setSortByLocation] = useState<boolean>(false)
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

  // Filter items based on selected category and minimum quantity
  const filteredItems = initialFoodItems
    .filter((item) => {
      // Filter by category
      if (selectedCategory === "All Items") return true
      if (selectedCategory === "Beverage") return item.subCategory === "Beverage"
      if (selectedCategory === "Savoury") return item.subCategory === "Savoury"
      if (selectedCategory === "Sweet") return item.subCategory === "Sweet"
      return true
    })
    .filter((item) => item.quantity >= minQuantity)

  // Sort by restaurant location if enabled
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortByLocation) return 0

    // Calculate distance from user location to restaurant location
    const distanceA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.restaurant.location.latitude,
      a.restaurant.location.longitude,
    )

    const distanceB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.restaurant.location.latitude,
      b.restaurant.location.longitude,
    )

    return distanceA - distanceB
  })

  // Calculate distance between two coordinates using Haversine formula
  function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number) {
    const R = 6371 // Radius of the earth in km
    const dLat = deg2rad(lat2 - lat1)
    const dLon = deg2rad(lon2 - lon1)
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(deg2rad(lat1)) * Math.cos(deg2rad(lat2)) * Math.sin(dLon / 2) * Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    const d = R * c // Distance in km
    return d
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

            <FoodListings items={sortedItems} />
          </div>
        </div>
      </div>
    </main>
  )
}

