import { type FoodItem, getCategoryImage } from "../types/foodItems"
import "../styles/mainInventory.css"
import { addDonationRequest } from "../services/donationRequests";
import { useState } from "react";
import { useAppSelector } from "../redux/hooks";
import { sendEmail } from "../services/emails";
import { fetchFoodItemById } from "../services/foodItems";
import { fetchRestaurantById } from "../services/restaurant";
import { fetchUserById } from "../services/user";

interface FoodCardProps {
  item: FoodItem
  'data-testid'?: string
}

export default function FoodCard({ item, 'data-testid': testId }: FoodCardProps) {
  const [isClaimed, setIsClaimed] = useState(false);
  const imageUrl = getCategoryImage(item.subCategory)
  const user = useAppSelector((state: any) => state.user);

  const handleClaim = async () => {
    try {
      const donation = {
        foodbank_id: user.type_id, 
        food_id: item._id,
        requested_quantity: item.quantity,
        status: "pending",
      };

      // const result = await addDonationRequest(donation);
      setIsClaimed(true);
      alert("Donation claimed successfully!");
      
      const fullFoodItem = await fetchFoodItemById(item._id);
      const restaurant = await fetchRestaurantById(fullFoodItem.restaurant_id);
      const restaurantUser = await fetchUserById(restaurant.user_id);

      await sendEmail({
        to: restaurantUser.email,
        subject: `Incoming Order`,
        html: `
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: auto; padding: 20px; background: linear-gradient(135deg, #000000, #00a9cd); ; border-radius: 8px;">
            <h2 style="color: white;">🍽️ New Food Request</h2>
            <p style="color: white;">Hi <strong>${item.restaurant.name}</strong>,</p>
            <p style="color: white;"><strong>${user.name}</strong> has requested to claim the food item:</p>
            <p style="color: white; margin: 0 0 10px;"><strong>${item.name}</strong> (${item.quantity} portions)</p>
            <p style="color: white;">Please visit the app to accept or reject the order.</p>
            <hr style="margin: 30px 0; border: none; border-top: 1px solid #ddd;" />
            <p style="color: white; font-size: 0.9em;">Thanks for using <strong>FoodSync</strong> ❤️</p>
          </div>
        `,
      });
    } catch (error) {
      console.error("Error claiming donation:", error);
      alert("Failed to claim donation.");
    }
  };

  return (
    <div className="food-card" data-testid="food-card">
      <div className="food-card-image-container" data-testid="food-card-image-container">
        <img 
          src={imageUrl || "/placeholder.svg"} 
          alt={item.name} 
          className="food-card-image" 
          data-testid="food-card-image"
        />
        <div className="food-card-title-container">
          <h3 className="food-card-title" data-testid="food-card-name">{item.name}</h3>
        </div>
        <div className="food-card-expires" data-testid="food-card-expiry">
          Expires in {item.expiresIn}
        </div>
      </div>

      <div className="food-card-content">
        <div className="food-card-restaurant" data-testid="food-card-restaurant">
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
            data-testid="restaurant-icon"
          >
            <path d="M3 11l19-9-9 19-2-8-8-2z" />
          </svg>
          <span className="food-card-restaurant-name" data-testid="restaurant-name">
            {item.restaurant.name}
          </span>
        </div>

        <div className="food-card-quantity-container" data-testid="quantity-container">
          <div>
            <p className="food-card-quantity-label">Quantity available:</p>
            <p className="food-card-quantity-value" data-testid="food-quantity">
              {item.quantity} portions
            </p>
          </div>
        </div>

        <div className="food-card-category" data-testid="food-category">
          {item.subCategory}
        </div>

        <button 
          className="food-card-button" 
          onClick={handleClaim}
          disabled={isClaimed}
          data-testid="claim-button"
        >
          {isClaimed ? "Success!" : "Claim"}
        </button>
      </div>
    </div>
  )
}