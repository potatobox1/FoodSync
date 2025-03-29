"use client"
import "../styles/main_inventory.css"; // Import the new CSS file

import { useState, useEffect } from "react"
import Header from "../components/header"
import CategoryFilter from "../components/category-filter"
import FoodListings from "../components/food-listings"
import FilterSidebar from "../components/filter-sidebar"
import type { FoodItem } from "../types/food-item"

// Sample data with location information
const initialFoodItems: FoodItem[] = [
  {
    id: 1,
    name: "Palao",
    category: "Food",
    subCategory: "Savoury",
    image: "/placeholder.svg?height=200&width=300",
    expiresIn: "6h",
    restaurant: "Italian Corner Restaurant",
    quantity: 12,
    location: { latitude: 40.7128, longitude: -74.006 },
  },
  {
    id: 2,
    name: "Daal",
    category: "Food",
    subCategory: "Savoury",
    image: "/placeholder.svg?height=200&width=300",
    expiresIn: "6h",
    restaurant: "Italian Corner Restaurant",
    quantity: 30,
    location: { latitude: 40.758, longitude: -73.9855 },
  },
  {
    id: 3,
    name: "Lemonade",
    category: "Beverage",
    subCategory: "Sweet",
    image: "/placeholder.svg?height=200&width=300",
    expiresIn: "6h",
    restaurant: "Italian Corner Restaurant",
    quantity: 50,
    location: { latitude: 40.7308, longitude: -73.9973 },
  },
  {
    id: 4,
    name: "Halwa",
    category: "Food",
    subCategory: "Sweet",
    image: "/placeholder.svg?height=200&width=300",
    expiresIn: "6h",
    restaurant: "Italian Corner Restaurant",
    quantity: 25,
    location: { latitude: 40.7448, longitude: -73.9867 },
  },
]

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
      if (selectedCategory === "Beverage") return item.category === "Beverage"
      if (selectedCategory === "Savoury") return item.subCategory === "Savoury"
      if (selectedCategory === "Sweet") return item.subCategory === "Sweet"
      return true
    })
    .filter((item) => item.quantity >= minQuantity)

  // Sort by location if enabled
  const sortedItems = [...filteredItems].sort((a, b) => {
    if (!sortByLocation) return 0

    // Calculate distance from user location
    const distanceA = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      a.location.latitude,
      a.location.longitude,
    )

    const distanceB = calculateDistance(
      userLocation.latitude,
      userLocation.longitude,
      b.location.latitude,
      b.location.longitude,
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

