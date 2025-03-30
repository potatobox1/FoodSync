import FoodCard from "./food-card"
import type { FoodItem } from "../types/food-item"
import "../styles/main_inventory.css"

interface FoodListingsProps {
  items: FoodItem[]
}

export default function FoodListings({ items }: FoodListingsProps) {
  if (items.length === 0) {
    return (
      <div className="empty-state">
        <p className="empty-state-text">No food items available with the selected filters.</p>
      </div>
    )
  }

  return (
    <div className="grid md-grid-cols-2 lg-grid-cols-4">
      {items.map((item) => (
        <FoodCard key={item._id} item={item} />
      ))}
    </div>
  )
}

