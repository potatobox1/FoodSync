"use client"

import React, { useEffect, useState } from "react"
import styles from "../styles/addReview.module.css"
import ReviewModal from "../components/ReviewModal"
import StarRating from "../components/StarRating"
import FNavbar from "../components/foodbank_navbar"
import { fetchDonationRequestsForFoodbank } from "../services/addDonationRequest"
import { fetchRestaurantById } from "../services/restaurant"
import { fetchUserById } from "../services/user"
import { useAppSelector } from "../redux/hooks"

interface Restaurant {
  _id: string
  name: string
}

interface FoodItem {
  _id: string
  name: string
  category: string
  restaurant_id: string
  expiration_date: Date
  subCategory: "Savoury" | "Sweet" | "Beverage"
  restaurant: Restaurant
}

interface DonationRequest {
  _id: string
  food_id: FoodItem
  requested_quantity: number
  created_at: Date
  isReviewed?: boolean
}

const Review: React.FC = () => {
  const foodbankId = useAppSelector((state: any) => state.user.type_id)
  const [orders, setOrders] = useState<DonationRequest[]>([])
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [selectedOrder, setSelectedOrder] = useState<DonationRequest | null>(null)

  useEffect(() => {
    const loadOrders = async () => {
      const data = await fetchDonationRequestsForFoodbank(foodbankId)
      const completed = data.filter((d: any) => d.status === "accepted")

      const enriched = await Promise.all(
        completed.map(async (order: any) => {
          const restaurant = await fetchRestaurantById(order.food_id.restaurant_id)
          const user = await fetchUserById(restaurant.user_id)
          return {
            ...order,
            food_id: {
              ...order.food_id,
              restaurant: { _id: restaurant._id, name: user.name },
            },
            isReviewed: false, // You can replace this with real review logic
          }
        })
      )

      setOrders(enriched)
    }

    loadOrders()
  }, [foodbankId])

  const openReviewModal = (order: DonationRequest) => {
    setSelectedOrder(order)
    setIsModalOpen(true)
  }

  const closeReviewModal = () => {
    setIsModalOpen(false)
    setSelectedOrder(null)
  }

  const submitReview = (orderId: string, rating: number, feedback: string) => {
    console.log("Review submitted:", { orderId, rating, feedback })

    setOrders((prev) =>
      prev.map((o) => (o._id === orderId ? { ...o, isReviewed: true } : o))
    )

    closeReviewModal()
  }

  const getCategoryImage = (sub: string) => {
    switch (sub) {
      case "Savoury": return "/images/savoury.jpg"
      case "Sweet": return "/images/sweet.jpg"
      case "Beverage": return "/images/beverage.jpg"
      default: return "/placeholder.svg"
    }
  }

  return (
    <div className={styles.reviewPage}>
      <FNavbar active="review" />
      <main className={styles.main}>
        <h1 className={styles.title}>My Completed Orders</h1>
        <p className={styles.subtitle}>Review your past orders and share your feedback</p>

        <div className={styles.ordersList}>
          {orders.length > 0 ? (
            orders.map((order) => (
              <div key={order._id} className={styles.orderCard}>
                <div className={styles.orderImageContainer}>
                  <img
                    src={getCategoryImage(order.food_id.subCategory)}
                    alt={order.food_id.name}
                    className={styles.orderImage}
                  />
                </div>
                <div className={styles.orderDetails}>
                  <h3 className={styles.orderName}>{order.food_id.name}</h3>
                  <p className={styles.orderDate}>
                    Received on: {new Date(order.created_at).toLocaleDateString()}
                  </p>
                  <p className={styles.orderItems}>Qty: {order.requested_quantity}</p>
                  <p className={styles.orderItems}>From: {order.food_id.restaurant.name}</p>
                  {order.isReviewed ? (
                    <div className={styles.reviewedBadge}>
                      <span className={styles.reviewedText}>Reviewed</span>
                      <StarRating rating={4} readOnly />
                    </div>
                  ) : (
                    <button className={styles.reviewButton} onClick={() => openReviewModal(order)}>
                      Leave a Review
                    </button>
                  )}
                </div>
              </div>
            ))
          ) : (
            <div className={styles.emptyState}>
              <p>You don't have any completed orders yet.</p>
            </div>
          )}
        </div>
      </main>

      {isModalOpen && selectedOrder && (
        <ReviewModal
          order={selectedOrder}
          onClose={closeReviewModal}
          onSubmit={(rating, feedback) => submitReview(selectedOrder._id, rating, feedback)}
        />
      )}
    </div>
  )
}

export default Review
