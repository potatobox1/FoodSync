import type React from "react"
import "../styles/ViewReviews.css"
import { Star } from "lucide-react"
import Navbar from "../components/NavBar"

// Define types for our data
interface Review {
  id: string
  itemName: string
  reviewText: string
  rating: number
  reviewerName: string
  date: string
  itemImage?: string
  itemCategory?: string
}

const OrderReviews: React.FC = () => {
  // Sample data - in a real app, this would come from an API
  const reviews: Review[] = [
    {
      id: "rev1",
      itemName: "Juicy Burger",
      reviewText: "Absolutely delicious! The burger was juicy and flavorful. Would definitely order again.",
      rating: 5,
      reviewerName: "Alex Johnson",
      date: "2025-04-20",
      itemImage: "/placeholder.svg?height=80&width=80",
      itemCategory: "Savoury",
    },
    {
      id: "rev2",
      itemName: "Fresh Orange Juice",
      reviewText: "Very refreshing and not too sweet. Perfect for a hot day!",
      rating: 4,
      reviewerName: "Sam Wilson",
      date: "2025-04-19",
      itemImage: "/placeholder.svg?height=80&width=80",
      itemCategory: "Beverage",
    },
    {
      id: "rev3",
      itemName: "Veggie Platter",
      reviewText: "The vegetables were fresh but I would have liked more variety in the dips.",
      rating: 3,
      reviewerName: "Jamie Smith",
      date: "2025-04-18",
      itemImage: "/placeholder.svg?height=80&width=80",
      itemCategory: "Healthy",
    },
  ]

  // Function to render stars based on rating
  const renderStars = (rating: number) => {
    const stars = []
    for (let i = 1; i <= 5; i++) {
      stars.push(<Star key={i} className={`star ${i <= rating ? "filled" : "empty"}`} size={16} />)
    }
    return stars
  }

  // Format date to a more readable format
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <>
    <div>
        <Navbar active="orders"/>

    </div>
    <div className="order-reviews-container">

      <div className="content">
        <h1 className="page-title">Order Reviews</h1>

        <div className="filter-section">
          <label htmlFor="filter">Filter by rating:</label>
          <select id="filter" className="filter-dropdown">
            <option value="all">All Ratings</option>
            <option value="5">5 Stars</option>
            <option value="4">4 Stars</option>
            <option value="3">3 Stars</option>
            <option value="2">2 Stars</option>
            <option value="1">1 Star</option>
          </select>
        </div>

        <div className="reviews-list">
          {reviews.map((review) => (
            <div key={review.id} className="review-card">
              <div className="review-header">
                <div className="item-details">
                  <img src="../public/images/beverage.png"  alt={review.itemName} className="item-image" />
                  <div className="item-info">
                    <h3 className="item-name">{review.itemName}</h3>
                    <p className="item-category">Category: {review.itemCategory}</p>
                  </div>
                </div>
                <div className="review-meta">
                  <div className="rating">{renderStars(review.rating)}</div>
                  <p className="review-date">Reviewed on {formatDate(review.date)}</p>
                </div>
              </div>

              <div className="review-content">
                <p className="review-text">{review.reviewText}</p>
                <p className="reviewer-name">- {review.reviewerName}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>

  </>
  )
}

export default OrderReviews
