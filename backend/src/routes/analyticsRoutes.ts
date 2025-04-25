import { Router } from 'express';
import {
  getFoodbankSummary,
  getTopRestaurants,
  getCategoryBreakdown,
  getDonationsChart,
  getReviewsChart,
  getPickupMap,
  getRestaurantSummary,
  getRestaurantCategoryBreakdown,
  getRestaurantOrdersChart,
  getTopFoodbanks,
  getRestaurantPickupMap,
  getRestaurantReviewsChart
} from '../controller/analyticsController';

const router = Router();

// Summary of total donations, restaurants, and rating
router.get('/foodbank/summary/:foodbankId', getFoodbankSummary);

// Top 5 restaurants by number of donations
router.get('/foodbank/top-restaurants/:foodbankId', getTopRestaurants);

// Breakdown of donations by food category
router.get('/foodbank/category-breakdown/:foodbankId', getCategoryBreakdown);

// Donation counts over time (week/month/year)
router.get('/foodbank/donations-chart/:foodbankId', getDonationsChart);

// Review ratings and counts over time (week/month/year)
router.get('/foodbank/reviews-chart/:foodbankId', getReviewsChart);

// Geographic pickup map and average distance
router.get('/foodbank/pickup-map/:foodbankId', getPickupMap);

// Restaurant dashboard summary
router.get("/restaurant/summary/:restaurantId", getRestaurantSummary);

// Restaurant - Category Breakdown
router.get("/restaurant/category-breakdown/:restaurantId", getRestaurantCategoryBreakdown);

router.get("/restaurant/orders-chart/:restaurantId", getRestaurantOrdersChart);

router.get("/restaurant/top-foodbanks/:restaurantId", getTopFoodbanks);

router.get("/restaurant/pickup-map/:restaurantId", getRestaurantPickupMap);

router.get("/restaurant/reviews-chart/:restaurantId", getRestaurantReviewsChart);


export default router;
