import FoodCard from "./food-card"
import type { FoodItem } from "../types/food-item"
// import "../styles/main_inventory.css"; // Import the new CSS file

interface FoodListingsProps {
  items: FoodItem[]
}

export default function FoodListings({ items }: FoodListingsProps) {
  if (items.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">No food items available with the selected filters.</p>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
      {items.map((item) => (
        <FoodCard key={item.id} item={item} />
      ))}
    </div>
  )
}

