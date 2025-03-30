import React, { useState } from "react";
import "../styles/RestaurantDashboard.css";
import AddItemModal from "./addItemModal";

const foodItems = [
  {
    id: 1,
    name: "Pulao",
    image: "/placeholder.svg",
    restaurant: "Italian Corner Restaurant",
    quantity: "13 portions",
    expiresIn: "6h",
  },
  {
    id: 2,
    name: "Daal",
    image: "/placeholder.svg",
    restaurant: "Italian Corner Restaurant",
    quantity: "30 portions",
    expiresIn: "6h",
  },
  {
    id: 3,
    name: "Lemonade",
    image: "/placeholder.svg",
    restaurant: "Italian Corner Restaurant",
    quantity: "50 portions",
    expiresIn: "6h",
  },
  {
    id: 4,
    name: "Halwa",
    image: "/placeholder.svg",
    restaurant: "Italian Corner Restaurant",
    quantity: "25 portions",
    expiresIn: "6h",
  },
];

export default function Dashboard() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="dashboard-container">
      {/* Header */}
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

      {/* Main */}
      <div className="food-section">
        <h2
          style={{
            fontSize: "1.8rem",
            fontWeight: "bold",
            marginBottom: "1rem",
          }}
        >
          Orders Dashboard
        </h2>

        <div className="food-cards">
          {foodItems.map((item) => (
            <div className="food-card" key={item.id}>
              <img src={item.image} alt={item.name} />
              <div className="food-info">
                <h3>{item.name}</h3>
                <div className="expiry-badge">Expires in {item.expiresIn}</div>
                <p style={{ marginTop: "0.5rem" }}>{item.restaurant}</p>
                <p>
                  Quantity available: <strong>{item.quantity}</strong>
                </p>
              </div>
            </div>
          ))}
        </div>

        <button className="add-button" onClick={() => setIsModalOpen(true)}>
          Add Item
        </button>
      </div>

      <AddItemModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
      />
    </div>
  );
}
