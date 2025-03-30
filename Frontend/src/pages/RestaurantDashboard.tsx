import React, { useState, useEffect, useCallback } from "react";
import "../styles/RestaurantDashboard.css";
import AddItemModal from "./addItemModal";
import { fetchFoodItemsByRestaurant } from "../services/foodItemsByRID";

export default function Dashboard() {
  const restaurantId: string = "67e88d5621be484ff7f3cd73";
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodItems, setFoodItems] = useState<any[]>([]);

  // Fetch items wrapped in useCallback so it can be passed as prop
  const loadFoodItems = useCallback(async () => {
    try {
      const response = await fetchFoodItemsByRestaurant(restaurantId);
      const sortedItems = (response || []).sort((a:any, b:any) => {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      });
      setFoodItems(sortedItems);
    } catch (error) {
      console.error("Failed to fetch food items:", error);
    }
  }, [restaurantId]);

  useEffect(() => {
    loadFoodItems();
  }, [loadFoodItems]);

  return (
    <div className="dashboard-container">
      <header className="dashboard-header">
        <div className="logo">FoodSync</div>
        <nav className="nav-links">
          <a href="#">Dashboard</a>
          <a href="#">Available Food</a>
          <a href="#">My Orders</a>
          <a href="#" style={{ color: "#00a9cd", fontWeight: "bold" }}>
            Order Dashboard
          </a>
        </nav>
        <div className="user-icon">👤</div>
      </header>

      <div className="food-section">
        <h2 className="dashboard-title">Orders Dashboard</h2>

        <div className="food-cards">
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <div className="food-card" key={item._id}>
                <img
                  src={
                    item.category === "Savoury"
                      ? "/images/savory.jpg"
                      : item.category === "Sweet"
                      ? "/images/Sweet.png"
                      : item.category === "Beverage"
                      ? "/images/Beverage.png"
                      : "/placeholder.svg"
                  }
                  alt={item.name}
                />
                <div className="food-info">
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <div className="expiry-badge">
                      Expires on <br />
                      {item.expiration_date
                        ? new Date(item.expiration_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <p>
                    Quantity available:{" "}
                    <strong>{item.quantity || "N/A"}</strong>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ margin: "1rem 0" }}>No food items listed yet.</p>
          )}
        </div>

        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          Add Item
        </button>
      </div>

      {/* Pass refresh function to modal */}
      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onItemAdded={loadFoodItems}
      />
    </div>
  );
}
