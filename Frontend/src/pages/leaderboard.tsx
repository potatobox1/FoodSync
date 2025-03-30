import { useEffect, useState } from "react";
import { fetchRestaurants } from "../services/restaurant";
import { fetchUserById } from "../services/user";
import "../styles/leaderboard.css";

type Restaurant = {
  user_id: string;
  total_donations: number;
  points?: number; // This will be added dynamically
  name?: string; // This will be added dynamically
  
};

function App() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([]);

  useEffect(() => {
    const loadRestaurants = async () => {
      try {
        const restaurantData = await fetchRestaurants();
        const enrichedData = await Promise.all(
          restaurantData.map(async (restaurant: Restaurant) => {
            const user = await fetchUserById(restaurant.user_id);
            return {
              name: user.name,
              points: restaurant.total_donations,
            };
          })
        );
        enrichedData.sort((a, b) => b.points - a.points);
        setRestaurants(enrichedData);
      } catch (error) {
        console.error("Error loading restaurants:", error);
      }
    };
    loadRestaurants();
  }, []);

  return (
    <div className="app">
      <header className="navbar">
        <div className="container">
          <div className="logo">
            <span className="logo-food">Food</span>
            <span className="logo-sync">Sync</span>
          </div>
          <nav className="nav-menu">
            <ul>
              <li><a href="/">Home</a></li>
              <li><a href="/dashboard">Dashboard</a></li>
              <li><a href="/inventory">Inventory</a></li>
              <li><a href="restaurant-dashboard">Orders</a></li>
            </ul>
          </nav>
        </div>
      </header>

      <main className="container">
        <h1 className="page-title">Leaderboard</h1>

        <div className="top-leaders">
          {restaurants.slice(0, 3).map((restaurant, index) => (
            <div key={index} className={`leader-card ${index === 0 ? "gold" : index === 1 ? "silver" : "bronze"}` }>
              <div className="leader-image">
                <img src="https://via.placeholder.com/160" alt={restaurant.name} />
              </div>
              <div className="leader-info">
                <h3>{restaurant.name}</h3>
                <p>{restaurant.points} Points</p>
              </div>
            </div>
          ))}
        </div>

        <div className="leaderboard-list">
          {restaurants.slice(3).map((restaurant, index) => (
            <div key={index} className="list-item light-blue">
              <span className="rank">{index + 4}</span>
              <div className="user-image">
                <img src="https://via.placeholder.com/64" alt={restaurant.name} />
              </div>
              <span className="user-name">{restaurant.name}</span>
              <span className="points">{restaurant.points} Points</span>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}

export default App;
