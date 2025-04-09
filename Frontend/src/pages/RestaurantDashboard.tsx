import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/RestaurantDashboard.module.css";
import AddItemModal from "./addItemModal";
import { fetchFoodItemsByRestaurant } from "../services/foodItems";
import { useAppSelector } from "../redux/hooks";
import Navbar from "../components/NavBar";// <-- NEW

export default function Dashboard() {
  const restaurantId: string = useAppSelector((state: any) => state.user.type_id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodItems, setFoodItems] = useState<any[]>([]);

  const loadFoodItems = useCallback(async () => {
    try {
      const response = await fetchFoodItemsByRestaurant(restaurantId);
      const sortedItems = (response || []).sort((a: any, b: any) => {
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
    <div className={styles.container}>
      <Navbar active="inventory" /> {/* NEW NAVBAR COMPONENT */}

      <div className={styles.section}>
        <h2 className={styles.title}>My Inventory</h2>

        <div className={styles.cards}>
          {foodItems.length > 0 ? (
            foodItems.map((item) => (
              <div className={styles.card} key={item._id}>
                <img
                  src={
                    item.category === "Savoury"
                      ? "/images/savoury.jpg"
                      : item.category === "Sweet"
                      ? "/images/sweet.jpg"
                      : item.category === "Beverage"
                      ? "/images/beverage.jpg"
                      : "/placeholder.svg"
                  }
                  alt={item.name}
                />
                <div className={styles.info}>
                  <div
                    style={{
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                  >
                    <h3 style={{ margin: 0 }}>{item.name}</h3>
                    <div className={styles.expiry}>
                      Expires on <br />
                      {item.expiration_date
                        ? new Date(item.expiration_date).toLocaleDateString()
                        : "N/A"}
                    </div>
                  </div>
                  <p>
                    Quantity available: <strong>{item.quantity || "N/A"}</strong>
                  </p>
                </div>
              </div>
            ))
          ) : (
            <p style={{ margin: "1rem 0" }}>No food items listed yet.</p>
          )}
        </div>

        <button className={styles.addBtn} onClick={() => setIsModalOpen(true)}>
          Add Item
        </button>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onItemAdded={loadFoodItems}
      />
    </div>
  );
}
