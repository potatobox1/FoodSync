import type React from "react"
import type { ReactNode } from "react"
import styles from "../../styles/metricCard.module.css"

interface MetricCardProps {
  title: string
  value: string | number
  icon: ReactNode
}

const MetricCard: React.FC<MetricCardProps> = ({ title, value, icon }) => {
  return (
    <div className={styles.metricCard}>
      <div className={styles.iconContainer}>{icon}</div>
      <div className={styles.metricContent}>
        <h3>{title}</h3>
        <p className={styles.metricValue}>{value}</p>
      </div>
    </div>
  )
}

export default MetricCard
