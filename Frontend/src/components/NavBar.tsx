import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import styles from "../styles/Navbar.module.css";
import { Menu, X } from "lucide-react"; // or any icon library you use

interface NavbarProps {
  active: "inventory" | "orders" | "leaderboard" | "reviews" | "dashboard";
}

const Navbar: React.FC<NavbarProps> = ({ active }) => {
  const [menuOpen, setMenuOpen] = useState(false);
  const navigate = useNavigate();

  const handleLogout = () => {
    // Implement logout logic if needed
    navigate("/");
  };

  return (
    <header className={styles.header}>
      <div className={styles.logo}>FoodSync</div>

      <button
        className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <Link to="/Rdashboard" className={active === "dashboard" ? styles.active : ""}>Dashboard</Link>
        <Link to="/restaurant-dashboard" className={active === "inventory" ? styles.active : ""}> My Inventory </Link>
        <Link to="/incoming-orders" className={active === "orders" ? styles.active : ""}> My Orders </Link>
        <Link to="/leaderboard" className={active === "leaderboard" ? styles.active : ""} > Leaderboard </Link>
        <Link to="/viewreview" className={active === "reviews" ? styles.active : ""} > Reviews </Link>

        <div className={styles.userAreaMobile}>
          <div className={styles.userIcon}>👤</div>
          <button onClick={handleLogout} className={styles.logoutButton}>
            Logout
          </button>
        </div>
      </nav>

      <div className={styles.userArea}>
        <div className={styles.userIcon}>👤</div>
        <button onClick={handleLogout} className={styles.logoutButton}>
          Logout
        </button>
      </div>
    </header>
  );
};

export default Navbar;
