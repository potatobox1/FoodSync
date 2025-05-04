import React, { useState, useEffect, useCallback } from "react";
import styles from "../styles/restaurantInventory.module.css";
import AddItemModal from "../components/addItemModal";
import { fetchFoodItemsByRestaurant } from "../services/foodItems";
import { useAppSelector } from "../redux/hooks";
import Navbar from "../components/navBar";
import AIAssistant from '../components/aiAssistant'

export default function Dashboard() {
  const restaurantId: string = useAppSelector((state: any) => state.user.type_id);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [foodItems, setFoodItems] = useState<any[]>([]);

  const loadFoodItems = useCallback(async () => {
    try {
      const response = await fetchFoodItemsByRestaurant(restaurantId);

      const availableItems = (response || []).filter((item: any) => item.status === "available");

      const sortedItems = availableItems.sort((a: any, b: any) => {
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
    <>
      <div>
        <Navbar active="inventory" />
      </div>
      <div className={styles.container}>

        <div className={styles.section}>
          <h2 className={styles.title}>My Inventory</h2>

          <div className={styles.cards} data-testid="inventory-list">
            {foodItems.length > 0 ? (
              foodItems.map((item) => (
                <div 
                  className={styles.card} 
                  key={item._id}
                  data-testid={`inventory-item-${item._id}`}
                >
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
                    data-testid={`item-image-${item._id}`}
                  />
                  <div className={styles.info}>
                    <div
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                      }}
                    >
                      <h3 style={{ margin: 0 }} data-testid={`item-name-${item._id}`}>
                        {item.name}
                      </h3>
                      <div 
                        className={styles.expiry}
                        data-testid={`item-expiry-${item._id}`}
                      >
                        Expires on <br />
                        {item.expiration_date
                          ? new Date(item.expiration_date).toLocaleDateString()
                          : "N/A"}
                      </div>
                    </div>
                    <p data-testid={`item-quantity-${item._id}`}>
                      Quantity available: <strong>{item.quantity || "N/A"}</strong>
                    </p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{ margin: "1rem 0" }} data-testid="empty-inventory-message">
                No food items listed yet.
              </p>
            )}
          </div>

          <button 
            className={styles.addBtn} 
            onClick={() => setIsModalOpen(true)}
            data-testid="add-item-button"
          >
            Add Item
          </button>
        </div>

        <AddItemModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onItemAdded={loadFoodItems}
        />
        <AIAssistant />
      </div>
    </>
  );
}