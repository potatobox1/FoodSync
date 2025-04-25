"use client"

import React, { useState } from "react"
import styles from "../styles/reviewModal.module.css"
import StarRating from "./starRating"

interface Order {
  _id: string
  food_id: {
    name: string
    category: string
    restaurant: { name: string }
  }
  created_at: Date
}

interface ReviewModalProps {
  order: Order
  onClose: () => void
  onSubmit: (rating: number, feedback: string) => void
}

const ReviewModal: React.FC<ReviewModalProps> = ({ order, onClose, onSubmit }) => {
  const [rating, setRating] = useState(0)
  const [feedback, setFeedback] = useState("")
  const [error, setError] = useState("")

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (rating === 0) {
      setError("Please select a rating.")
      return
    }
    onSubmit(rating, feedback)
  }

  return (
    <div className={styles.modalOverlay}>
      <div className={styles.modalContent}>
        <button className={styles.closeButton} onClick={onClose}>×</button>
        <h2 className={styles.modalTitle}>Review Your Order</h2>

        <div className={styles.orderInfo}>
        <img
          src={
            order.food_id.category === "Savoury"
              ? "/images/savoury.jpg"
              : order.food_id.category === "Sweet"
              ? "/images/sweet.jpg"
              : order.food_id.category === "Beverage"
              ? "/images/beverage.jpg"
              : "/placeholder.svg"
          }
          alt={order.food_id.name}
          className={styles.orderImage}
        />
          <div>
            <h3 className={styles.orderName}>{order.food_id.name}</h3>
            <p className={styles.orderDate}>
              Received on: {new Date(order.created_at).toLocaleDateString()}
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className={styles.reviewForm}>
          <div className={styles.ratingContainer}>
            <label className={styles.ratingLabel}>Your Rating:</label>
            <StarRating rating={rating} onChange={setRating} readOnly={false} />
            {error && <p className={styles.errorText}>{error}</p>}
          </div>

          <div className={styles.feedbackContainer}>
            <label htmlFor="feedback" className={styles.feedbackLabel}>Your Feedback:</label>
            <textarea
              id="feedback"
              className={styles.feedbackInput}
              placeholder="Tell us about your experience..."
              value={feedback}
              onChange={(e) => setFeedback(e.target.value)}
              rows={4}
            />
          </div>

          <div className={styles.buttonContainer}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>Cancel</button>
            <button type="submit" className={styles.submitButton}>Submit Review</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewModal
