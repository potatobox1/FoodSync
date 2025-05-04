import FoodCard from "./foodCard"
import type { FoodItem } from "../types/foodItems"
import "../styles/mainInventory.css"

interface FoodListingsProps {
  items: FoodItem[]
}

export default function FoodListings({ items }: FoodListingsProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state" data-testid="empty-state">
        <p className="empty-state-text" data-testid="empty-state-text">
          No food items available with the selected filters.
        </p>
      </div>
    )
  }

  return (
    <div 
      className="grid md-grid-cols-2 lg-grid-cols-4" 
      data-testid="food-listings-grid"
    >
      {items.map((item) => (
        <FoodCard 
          key={item._id} 
          item={item} 
          data-testid={`food-card-${item._id}`}
        />
      ))}
    </div>
  )
}