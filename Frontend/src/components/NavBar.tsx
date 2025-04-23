import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import React from "react";
import styles from "../styles/Navbar.module.css";

interface NavbarProps {
  active: "inventory" | "orders" | "leaderboard" | "reviews";
}

const Navbar: React.FC<NavbarProps> = ({ active }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const handleLogout = () => {
    
    dispatch(clearUser());
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>FoodSync</div>
      <nav className={styles.nav}>
        <a
          href="/restaurant-dashboard"
          className={active === "inventory" ? styles.active : ""}
        >
          My Inventory
        </a>
        <a
          href="/incoming-orders"
          className={active === "orders" ? styles.active : ""}
        >
          My Orders
        </a>
        <a
          href="/leaderboard"
          className={active === "leaderboard" ? styles.active : ""}
        >
          Leaderboard
        </a>
        <a
          href="/viewreview"
          className={active === "reviews" ? styles.active : ""}
        >
          Reviews
        </a>
      </nav>
      <div className={styles.userIcon}>👤</div>
    </header>
  );
};

export default Navbar;
