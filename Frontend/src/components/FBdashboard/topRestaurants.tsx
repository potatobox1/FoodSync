import React from "react"
import styles from "../../styles/topRestaurants.module.css"

const TopRestaurants: React.FC = () => {
  const restaurants = [
    { name: "Baradari", donations: 156 },
    { name: "Spice Garden", donations: 124 },
    { name: "Fresh Bites", donations: 98 },
    { name: "Green Plate", donations: 87 },
    { name: "Urban Kitchen", donations: 76 },
  ]

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.name}>Restaurant</div>
        <div className={styles.donations}>Order Count</div>
      </div>

      {restaurants.map((restaurant) => (
        <div key={restaurant.name} className={styles.tableRow}>
          <div className={styles.name}>{restaurant.name}</div>
          <div className={styles.donations}>{restaurant.donations}</div>
        </div>
      ))}
    </div>
  )
}

export default TopRestaurants
