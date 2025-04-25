"use client";

import { useEffect, useState } from "react";
import { useAppSelector } from "../redux/hooks";
import styles from "../styles/dashboard.module.css";

import MetricCard from "../components/FBdashboard/metricCard";
import Navbar from "../components/NavBar";
import CategoryChart from "../components/RestaurantDashboard/CategoryChart";
import OrdersChart from "../components/RestaurantDashboard/orderChart";
import TopFoodbanks from "../components/RestaurantDashboard/TopFoodbanks";
import PickupMap from "../components/RestaurantDashboard/pickupMap";
import ReviewsChart from "../components/RestaurantDashboard/ReviewsChart";
import AIAssistant from "../components/ai-assistant";

import { TrendingUp, BarChart3, MapPin, Star } from "lucide-react";
import {
  fetchRestaurantSummary,
  fetchRestaurantPickupMapData,
} from "../services/analytics";

const RestaurantDashboard: React.FC = () => {
  const restaurantId = useAppSelector((state: any) => state.user.type_id);
  const [summaryData, setSummaryData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [timeRange, setTimeRange] = useState("month");

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        const [summary, pickupMap] = await Promise.all([
          fetchRestaurantSummary(restaurantId),
          fetchRestaurantPickupMapData(restaurantId),
        ]);
        setSummaryData({
          ...summary,
          avgPickupDistance: pickupMap.avgDistance,
        });
      } catch (err) {
        console.error("❌ Failed to load restaurant data", err);
      } finally {
        setLoading(false);
      }
    };

    if (restaurantId) loadData();
  }, [restaurantId]);

  return (
    <div className={styles.dashboardContainer}>
      <Navbar active="dashboard" />

      <div className={styles.dashboardContent}>
        <div className={styles.dashboardHeader}>
          <h1>Restaurant Analytics Dashboard</h1>
          <div className={styles.timeRangeSelector}>
            <button
              className={timeRange === "week" ? styles.active : ""}
              onClick={() => setTimeRange("week")}
            >
              Week
            </button>
            <button
              className={timeRange === "month" ? styles.active : ""}
              onClick={() => setTimeRange("month")}
            >
              Month
            </button>
            <button
              className={timeRange === "year" ? styles.active : ""}
              onClick={() => setTimeRange("year")}
            >
              Year
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className={styles.metricsOverview}>
              <MetricCard
                title="Total Items Donated"
                value={summaryData?.totalItemsDonated ?? "—"}
                icon={<TrendingUp />}
              />
              <MetricCard
                title="Foodbanks Contributed To"
                value={summaryData?.totalFoodbanksContributed ?? "—"}
                icon={<BarChart3 />}
              />
              <MetricCard
                title="Avg. Pickup Distance"
                value={`${summaryData?.avgPickupDistance ?? "—"} km`}
                icon={<MapPin />}
              />
              <MetricCard
                title="Avg. Rating"
                value={summaryData?.averageRating ?? "—"}
                icon={<Star />}
              />
            </div>

            <div className={styles.chartsContainer}>
              <div className={styles.chartRow}>
                <div className={styles.chartCard}>
                  <h2>Completed Orders Over Time</h2>
                  <OrdersChart timeRange={timeRange} />
                </div>
                <div className={styles.chartCard}>
                  <h2>Completed Orders by Category</h2>
                  <CategoryChart />
                </div>
              </div>

              <div className={styles.chartRow}>
                <div className={styles.chartCard}>
                  <h2>Pickup Map</h2>
                  <PickupMap />
                </div>
                <div className={styles.chartCard}>
                  <h2>Top Foodbanks</h2>
                  <TopFoodbanks />
                </div>
              </div>

              <div className={styles.chartCard}>
                <h2>Reviews & Feedback Trends</h2>
                <ReviewsChart timeRange={timeRange} />
              </div>
            </div>
          </>
        )}
      </div>
      <AIAssistant />
    </div>
  );
};

export default RestaurantDashboard;
