export interface Restaurant {
  _id: string
  name: string
  location: {
    latitude: number
    longitude: number
  }
}

export interface FoodItem {
  _id: string
  restaurant_id: string
  restaurant: Restaurant
  quantity: number
  expiration_date: Date
  name: string
  category: string
  status: "available" | "expired"
  created_at: Date
  // Derived properties for UI
  expiresIn: string
  subCategory: "Savoury" | "Sweet" | "Beverage"
}

/**
 * Returns a generic image URL based on the food category
 */
export function getCategoryImage(subCategory: string): string {
  switch (subCategory) {
    case "Savoury":
      return "/images/savory.jpg" 
    case "Sweet":
      return "/images/sweet.jpg" 
    case "Beverage":
      return "/images/beverage.jpg" 
    default:
      return "/images/default-food.jpg" 
  }
}

/**
 * Determines the subcategory based on the main category
 */
export function determineSubCategory(category: string): "Savoury" | "Sweet" | "Beverage" {
  const lowerCategory = category.toLowerCase()

  if (
    lowerCategory.includes("beverage") ||
    lowerCategory.includes("drink") ||
    lowerCategory.includes("juice") ||
    lowerCategory.includes("water")
  ) {
    return "Beverage"
  } else if (
    lowerCategory.includes("sweet") ||
    lowerCategory.includes("dessert") ||
    lowerCategory.includes("cake") ||
    lowerCategory.includes("pastry")
  ) {
    return "Sweet"
  } else {
    return "Savoury"
  }
}

/**
 * Formats the expiration date into a human-readable string
 */
export function formatExpiryTime(expirationDate: Date): string {
  const now = new Date()
  const diffMs = expirationDate.getTime() - now.getTime()
  const diffHrs = Math.round(diffMs / (1000 * 60 * 60))

  if (diffHrs < 1) {
    return "Less than 1h"
  } else if (diffHrs < 24) {
    return `${diffHrs}h`
  } else {
    const days = Math.floor(diffHrs / 24)
    return `${days}d`
  }
}

