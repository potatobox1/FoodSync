import type React from "react"
import styles from "../../styles/pickupMap.module.css"

const PickupMap: React.FC = () => {
  return (
    <div className={styles.container}>
      <div className={styles.mapContainer}>
        <div className={styles.mapPlaceholder}>
          <div className={styles.mapOverlay}>
            <div className={styles.hotspot} style={{ top: "30%", left: "40%" }}></div>
            <div className={styles.hotspot} style={{ top: "50%", left: "60%" }}></div>
            <div className={styles.hotspot} style={{ top: "60%", left: "30%" }}></div>
            <div className={styles.hotspot} style={{ top: "40%", left: "70%" }}></div>
            <div className={styles.hotspot} style={{ top: "70%", left: "50%" }}></div>
          </div>
        </div>
      </div>
      <div className={styles.stats}>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Average Distance</div>
          <div className={styles.statValue}>3.2 km</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Max Distance</div>
          <div className={styles.statValue}>8.7 km</div>
        </div>
        <div className={styles.statItem}>
          <div className={styles.statLabel}>Pickups Today</div>
          <div className={styles.statValue}>24</div>
        </div>
      </div>
    </div>
  )
}

export default PickupMap
