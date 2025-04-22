import type React from "react"
import styles from "../../styles/topRestaurants.module.css"

const TopRestaurants: React.FC = () => {
  // Sample data
  const restaurants = [
    { name: "Baradari", donations: 156, rating: 4.8 },
    { name: "Spice Garden", donations: 124, rating: 4.7 },
    { name: "Fresh Bites", donations: 98, rating: 4.9 },
    { name: "Green Plate", donations: 87, rating: 4.6 },
    { name: "Urban Kitchen", donations: 76, rating: 4.5 },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.rank}>#</div>
        <div className={styles.name}>Restaurant</div>
        <div className={styles.donations}>Donations</div>
        <div className={styles.rating}>Rating</div>
      </div>

      {restaurants.map((restaurant, index) => (
        <div key={restaurant.name} className={styles.tableRow}>
          <div className={styles.rank}>{index + 1}</div>
          <div className={styles.name}>{restaurant.name}</div>
          <div className={styles.donations}>{restaurant.donations}</div>
          <div className={styles.rating}>
            <div className={styles.ratingValue}>{restaurant.rating}</div>
            <div className={styles.ratingBar}>
              <div className={styles.ratingFill} style={{ width: `${(restaurant.rating / 5) * 100}%` }}></div>
            </div>
          </div>
        </div>
      ))}
    </div>
  )
}

export default TopRestaurants
