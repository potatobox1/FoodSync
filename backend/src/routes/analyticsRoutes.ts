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

router.get('/foodbank/summary/:foodbankId', getFoodbankSummary);
router.get('/foodbank/top-restaurants/:foodbankId', getTopRestaurants);
router.get('/foodbank/category-breakdown/:foodbankId', getCategoryBreakdown);
router.get('/foodbank/donations-chart/:foodbankId', getDonationsChart);
router.get('/foodbank/reviews-chart/:foodbankId', getReviewsChart);
router.get('/foodbank/pickup-map/:foodbankId', getPickupMap);
router.get("/restaurant/summary/:restaurantId", getRestaurantSummary);
router.get("/restaurant/category-breakdown/:restaurantId", getRestaurantCategoryBreakdown);
router.get("/restaurant/orders-chart/:restaurantId", getRestaurantOrdersChart);
router.get("/restaurant/top-foodbanks/:restaurantId", getTopFoodbanks);
router.get("/restaurant/pickup-map/:restaurantId", getRestaurantPickupMap);
router.get("/restaurant/reviews-chart/:restaurantId", getRestaurantReviewsChart);


export default router;
