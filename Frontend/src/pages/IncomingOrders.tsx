import React, { useState } from "react";
import { Check, Clock, User, X } from "lucide-react";
import styles from "../styles/IncomingOrders.module.css"; // Import your CSS module
interface Order {
  id: string;
  customerName: string;
  items: {
    name: string;
    quantity: number;
    price: number;
    image: string;
  }[];
  orderTime: string;
  totalAmount: number;
  status: "pending" | "accepted" | "rejected";
}

export default function IncomingOrders() {
  const [orders, setOrders] = useState<Order[]>([
    {
      id: "ORD-001",
      customerName: "John Smith",
      items: [
        {
          name: "Bihari Kabab",
          quantity: 2,
          price: 12.99,
          image: "/placeholder.svg",
        },
        {
          name: "Garlic Naan",
          quantity: 3,
          price: 3.99,
          image: "/placeholder.svg",
        },
      ],
      orderTime: "10:30 AM",
      totalAmount: 38.95,
      status: "pending",
    },
    {
      id: "ORD-002",
      customerName: "Sarah Johnson",
      items: [
        {
          name: "Butter Chicken",
          quantity: 1,
          price: 14.99,
          image: "/placeholder.svg",
        },
        {
          name: "Jeera Rice",
          quantity: 1,
          price: 5.99,
          image: "/placeholder.svg",
        },
      ],
      orderTime: "10:45 AM",
      totalAmount: 20.98,
      status: "pending",
    },
  ]);

  const handleAccept = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "accepted" } : order
      )
    );
  };

  const handleReject = (orderId: string) => {
    setOrders((prev) =>
      prev.map((order) =>
        order.id === orderId ? { ...order, status: "rejected" } : order
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
          <div key={order.id} className={styles.card}>
            <div className={styles.cardHeader}>
              <div>
                <h3 className={styles.customerName}>{order.customerName}</h3>
                <div className={styles.orderTime}>
                  <Clock size={14} />
                  <span>Order placed at {order.orderTime}</span>
                </div>
              </div>
              <div className={styles.orderSummary}>
                <div className={styles.orderId}>Order #{order.id}</div>
                <div className={styles.orderAmount}>
                  ${order.totalAmount.toFixed(2)}
                </div>
              </div>
            </div>

            <div className={styles.itemList}>
              {order.items.map((item, index) => (
                <div key={index} className={styles.item}>
                  <div className={styles.itemLeft}>
                    <img
                      src={item.image}
                      alt={item.name}
                      className={styles.itemImage}
                    />
                    <div className={styles.itemInfo}>
                      <div className={styles.itemName}>{item.name}</div>
                      <div className={styles.itemDetail}>
                        Quantity: {item.quantity} × ${item.price.toFixed(2)}
                      </div>
                    </div>
                  </div>
                  <div className={styles.itemTotal}>
                    ${(item.quantity * item.price).toFixed(2)}
                  </div>
                </div>
              ))}
            </div>

            <div className={styles.actions}>
              {order.status === "pending" ? (
                <>
                  <button
                    onClick={() => handleReject(order.id)}
                    className={styles.rejectBtn}
                  >
                    <X size={16} />
                    Reject Order
                  </button>
                  <button
                    onClick={() => handleAccept(order.id)}
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
