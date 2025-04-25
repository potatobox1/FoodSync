import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useDispatch } from "react-redux";
import { clearUser } from "../redux/userSlice";
import styles from "../styles/navBar.module.css";
import { Menu, X } from "lucide-react"; 

interface NavbarProps {
  active: "inventory" | "orders" | "leaderboard" | "reviews" | "dashboard";
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

      <button
        className={styles.hamburger} onClick={() => setMenuOpen(!menuOpen)} aria-label="Toggle navigation">
        {menuOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      <nav className={`${styles.nav} ${menuOpen ? styles.navOpen : ""}`}>
        <Link to="/restaurant/dashboard" className={active === "dashboard" ? styles.active : ""}>Dashboard</Link>
        <Link to="/restaurant/inventory" className={active === "inventory" ? styles.active : ""}> My Inventory </Link>
        <Link to="/restaurant/incomingOrders" className={active === "orders" ? styles.active : ""}> My Orders </Link>
        <Link to="/leaderboard" className={active === "leaderboard" ? styles.active : ""} > Leaderboard </Link>
        <Link to="/restaurant/reviews" className={active === "reviews" ? styles.active : ""} > Reviews </Link>

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
