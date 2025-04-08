import React, { useEffect, useState } from "react";
import { Check, Clock, User, X } from "lucide-react";
import styles from "../styles/IncomingOrders.module.css";
import { fetchDonationRequestsForRestaurant } from "../services/addDonationRequest";

interface DonationRequest {
  _id: string;
  requested_quantity: number;
  status: string;
  created_at: string;
  foodItem: {
    _id: string;
    name: string;
    category: string;
    expiration_date: string;
  };
}

export default function IncomingOrders() {
  const [orders, setOrders] = useState<DonationRequest[]>([]);
  const restaurantId = "67e97e45125462fba093347b";

  useEffect(() => {
    const loadRequests = async () => {
      try {
        const data = await fetchDonationRequestsForRestaurant(restaurantId);
        setOrders(data);
      } catch (err) {
        console.error("Failed to load donation requests", err);
      }
    };

    loadRequests();
  }, []);

  const handleAccept = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status: "accepted" } : order
      )
    );
  };

  const handleReject = (id: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order._id === id ? { ...order, status: "rejected" } : order
      )
    );
  };

  return (
    <div className={styles.container}>
      <header className={styles.header}>
        <div className={styles.logo}>FoodSync</div>
        <nav className={styles.nav}>
          <a href="/dashboard">Dashboard</a>
          <a href="/available-food">Available Food</a>
          <a href="/my-orders">My Orders</a>
          <a href="/order-dashboard" className={styles.activeNav}>
            Order Dashboard
          </a>
        </nav>
        <div className={styles.userIcon}>
          <User size={20} />
        </div>
      </header>

      <main className={styles.main}>
        <h1 className={styles.title}>Incoming Orders</h1>

        {orders.map((order) => (
          <div key={order._id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.customerName}>
                  {order.foodItem.name.toUpperCase()}
                </h3>
                <div className={styles.orderTime}>
                  <Clock size={14} />
                  <span>
                    Order placed at{" "}
                    {new Date(order.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </div>
              <div className={styles.orderSummary}>
                <div className={styles.orderId}>Request ID #{order._id.slice(-5)}</div>
                <div className={styles.orderAmount}>
                  Quantity: {order.requested_quantity}
                </div>
              </div>
            </div>

            <div className={styles.itemList}>
              <div className={styles.item}>
                <div className={styles.itemLeft}>
                  <img
                    src={
                      order.foodItem.category === "Savoury"
                        ? "/images/savoury.jpg"
                        : order.foodItem.category === "Sweet"
                        ? "/images/sweet.jpg"
                        : order.foodItem.category === "Beverage"
                        ? "/images/beverage.jpg"
                        : "/placeholder.svg"
                    }
                    alt={order.foodItem.name}
                    className={styles.itemImage}
                  />
                  <div className={styles.itemInfo}>
                    <div className={styles.itemName}>
                      {order.foodItem.name}
                    </div>
                    <div className={styles.itemDetail}>
                      Category: {order.foodItem.category}
                    </div>
                    <div className={styles.itemDetail}>
                      Expires on{" "}
                      {new Date(order.foodItem.expiration_date).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className={styles.actions}>
              {order.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleReject(order._id)}
                    className={styles.rejectBtn}
                  >
                    <X size={16} />
                    Reject Order
                  </button>
                  <button
                    onClick={() => handleAccept(order._id)}
                    className={styles.acceptBtn}
                  >
                    <Check size={16} />
                    Accept Order
                  </button>
                </>
              ) : (
                <div
                  className={`${styles.statusBadge} ${
                    order.status === "accepted"
                      ? styles.accepted
                      : styles.rejected
                  }`}
                >
                  Order {order.status === "accepted" ? "Accepted" : "Rejected"}
                </div>
              )}
            </div>
          </div>
        ))}
      </main>
    </div>
  );
}