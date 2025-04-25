import React, { useEffect, useState } from "react"
import styles from "../../styles/topRestaurants.module.css"
import { useAppSelector } from "../../redux/hooks"
import { fetchTopRestaurants } from "../../services/analytics"

interface RestaurantInfo {
  name: string
  count: number
}

const TopRestaurants: React.FC = () => {
  const [topRestaurants, setTopRestaurants] = useState<RestaurantInfo[]>([])
  const foodbankId = useAppSelector((state: any) => state.user.type_id)

  useEffect(() => {
    const loadTopRestaurants = async () => {
      try {
        const data = await fetchTopRestaurants(foodbankId)
        setTopRestaurants(data)
      } catch (error) {
        console.error("Failed to fetch top restaurants:", error)
      }
    }

    if (foodbankId) loadTopRestaurants()
  }, [foodbankId])

  return (
    <div className={styles.container}>
      <div className={styles.tableHeader}>
        <div className={styles.name}>Restaurant</div>
        <div className={styles.donations}>Order Count</div>
      </div>

      {topRestaurants.map((restaurant, index) => (
        <div key={index} className={styles.tableRow}>
          <div className={styles.name}>{restaurant.name}</div>
          <div className={styles.donations}>{restaurant.count}</div>
        </div>
      ))}
    </div>
  )
}

export default TopRestaurants