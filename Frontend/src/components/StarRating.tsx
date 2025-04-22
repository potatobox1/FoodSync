"use client"

import React from "react"
import styles from "../styles/StarRating.module.css"

interface StarRatingProps {
  rating: number
  onChange?: (rating: number) => void
  readOnly?: boolean
}

const StarRating: React.FC<StarRatingProps> = ({ rating, onChange = () => {}, readOnly = true }) => {
  return (
    <div className={styles.starRating}>
      {[1, 2, 3, 4, 5].map((star) => (
        <span
          key={star}
          className={`${styles.star} ${star <= rating ? styles.filled : ""} ${!readOnly ? styles.clickable : ""}`}
          onClick={() => !readOnly && onChange(star)}
          role={!readOnly ? "button" : undefined}
          tabIndex={!readOnly ? 0 : undefined}
          onKeyDown={(e) => {
            if (!readOnly && (e.key === "Enter" || e.key === " ")) {
              onChange(star)
            }
          }}
        >
          ★
        </span>
      ))}
    </div>
  )
}

export default StarRating
