
import React, { useEffect, useState } from "react";
import styles from '../styles/ViewReviews.module.css'
import { Star } from "lucide-react"
import Navbar from "../components/NavBar"
import { useAppSelector } from "../redux/hooks";
import { fetchReviewsByRestaurant } from "../services/review";
import { fetchFoodItemById } from "../services/foodItems"; 
import { getUserIdByFoodbankId } from "../services/foodbank";
import { fetchUserById } from "../services/user";
import AIAssistant from '../components/ai-assistant'
import socket from "../services/socket";


interface Review {
  _id: string
  foodbank_id: string
  restaurant_id: string
  food_id: string
  rating: number
  feedback: string
  created_at: string
  itemName:string
  itemCategory: string
  reviewerName: string

}

const OrderReviews: React.FC = () => {
  
  const restaurant_id:string = useAppSelector((state:any) => state.user.type_id);  
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedRating, setSelectedRating] = useState("all");

  useEffect(() => {
    const fetchReviews = async () => {
      if (!restaurant_id) return;

      try {
        const rawReviews: Review[] = await fetchReviewsByRestaurant(restaurant_id);

        const enrichedReviews = await Promise.all(
          rawReviews.map(async (review) => {
            let itemName = "Unknown";
            let itemCategory = "Unknown";
            let reviewerName = "Anonymous";

          
            try {
              const food = await fetchFoodItemById(review.food_id);
              itemName = food.name || "Unknown";
              itemCategory = food.category || "Unknown";
            } catch (err) {
              console.error(`Failed to fetch food item for ID ${review.food_id}`, err);
            }

    
            try {
              const restaurant = await getUserIdByFoodbankId(review.foodbank_id);
              const user = await fetchUserById(restaurant);
              reviewerName = user.name || "Anonymous";
            } catch (err) {
              console.error(`Failed to fetch user for review ${review._id}`, err);
            }

            return {
              ...review,
              itemName,
              itemCategory,
              reviewerName,
            };
          })
        );

        setReviews(enrichedReviews);
      } catch (err) {
        console.error("Failed to fetch reviews", err);
      } finally {
        setLoading(false);
      }
    };

    fetchReviews();
  }, [restaurant_id]);


  useEffect(() => {
    if (!restaurant_id) return;
  
    socket.on("newReview", async (data: { review: Review }) => {
      const { review } = data;
      let itemName = "Unknown";
      let itemCategory = "Unknown";
      let reviewerName = "Anonymous";
  
      try {
        const food = await fetchFoodItemById(review.food_id);
        itemName = food.name || "Unknown";
        itemCategory = food.category || "Unknown";
      } catch (err) {
        console.error(`Socket: Failed to fetch food item for ID ${review.food_id}`, err);
      }
  
      try {
        const restaurant = await getUserIdByFoodbankId(review.foodbank_id);
        const user = await fetchUserById(restaurant);
        reviewerName = user.name || "Anonymous";
      } catch (err) {
        console.error(`Socket: Failed to fetch user for review ${review._id}`, err);
      }

      console.log(review,itemName,itemCategory,reviewerName)

      const enrichedReview = {
        ...review,
        itemName,
        itemCategory,
        reviewerName,
      };
  
      setReviews(prev => [enrichedReview, ...prev]);
    });
  
  }, [restaurant_id]);


  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star
        key={i}
        size={16}
        className={`${styles.star} ${i < rating ? styles.filled : styles.empty}`}
      />
    ));
  };

  
  const formatDate = (dateString: string) => {
    const options: Intl.DateTimeFormatOptions = { year: "numeric", month: "long", day: "numeric" }
    return new Date(dateString).toLocaleDateString(undefined, options)
  }

  return (
    <>
      <div>
        <Navbar active="reviews" />
      </div>
      <div className={styles["order-reviews-container"]}>
        <div className={styles.content}>
          <h1 className={styles["page-title"]}>Order Reviews</h1>
  
          <div className={styles["filter-section"]}>
            <label htmlFor="filter">Filter by rating:</label>
            <select
              id="filter"
              className={styles["filter-dropdown"]}
              value={selectedRating}
              onChange={(e) => setSelectedRating(e.target.value)}
            >
              <option value="all">All Ratings</option>
              <option value="5">5 Stars</option>
              <option value="4">4 Stars</option>
              <option value="3">3 Stars</option>
              <option value="2">2 Stars</option>
              <option value="1">1 Star</option>
            </select>
          </div>
  
          {loading ? (
            <p>Loading reviews...</p>
          ) : reviews.length === 0 ? (
            <p>No reviews found.</p>
          ) : (
            <div className={styles["reviews-list"]}>
              {reviews
                .filter((review) =>
                  selectedRating === "all"
                    ? true
                    : review.rating === Number(selectedRating)
                )
                .map((review) => (
                  <div key={review._id} className={styles["review-card"]}>
                    <div className={styles["review-header"]}>
                      <div className={styles["item-details"]}>
                        <img
                          src={
                            review.itemCategory.toLowerCase() === "savoury"
                              ? "/images/savoury.jpg"
                              : review.itemCategory.toLowerCase() === "beverage"
                              ? "/images/beverage.jpg"
                              : review.itemCategory.toLowerCase() === "sweet"
                              ? "/images/sweet.jpg"
                              : "/images/default.png"
                          }
                          alt={review.itemCategory}
                          className={styles["item-image"]}
                        />
                        <div className={styles["item-info"]}>
                          <h3 className={styles["item-name"]}>
                            {review.itemName}
                          </h3>
                          <p className={styles["item-category"]}>
                            Category: {review.itemCategory}
                          </p>
                        </div>
                      </div>
                      <div className={styles["review-meta"]}>
                        <div className={styles.rating}>
                          {renderStars(review.rating)}
                        </div>
                        <p className={styles["review-date"]}>
                          Reviewed on {formatDate(review.created_at)}
                        </p>
                      </div>
                    </div>
  
                    <div className={styles["review-content"]}>
                      <p className={styles["review-text"]}>{review.feedback}</p>
                      <p className={styles["reviewer-name"]}>
                        - {review.reviewerName}
                      </p>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
         <AIAssistant />
      </div>
    </>
  );
}

export default OrderReviews
