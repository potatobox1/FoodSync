import { type FoodItem, getCategoryImage } from "../types/food-item"
import "../styles/main_inventory.css"

interface FoodCardProps {
  item: FoodItem
}

export default function FoodCard({ item }: FoodCardProps) {
  // Get the appropriate image based on subcategory
  const imageUrl = getCategoryImage(item.subCategory)

  return (
    <div className="food-card">
      <div className="food-card-image-container">
        <img src={imageUrl || "/placeholder.svg"} alt={item.name} className="food-card-image" />
        <div className="food-card-title-container">
          <h3 className="food-card-title">{item.name}</h3>
        </div>
        <div className="food-card-expires">Expires in {item.expiresIn}</div>
      </div>

      <div className="food-card-content">
        <div className="food-card-restaurant">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="food-card-restaurant-icon"
          >
            <path d="M3 11l19-9-9 19-2-8-8-2z" />
          </svg>
          <span className="food-card-restaurant-name">{item.restaurant.name}</span>
        </div>

        <div className="food-card-quantity-container">
          <div>
            <p className="food-card-quantity-label">Quantity available:</p>
            <p className="food-card-quantity-value">{item.quantity} portions</p>
          </div>
        </div>

        <button className="food-card-button">Claim</button>
      </div>
    </div>
  )
}

