"use client"

import type React from "react"
import { useEffect, useState } from "react"
import styles from "../styles/dashboard.module.css"

import DonationChart from "../components/foodbankDashboard/donationChart"
import TopRestaurants from "../components/foodbankDashboard/topRestaurants"
import PickupMap from "../components/foodbankDashboard/pickupMap"
import FoodCategoryChart from "../components/foodbankDashboard/categoryChart"
import ReviewsChart from "../components/foodbankDashboard/reviewChart"
import MetricCard from "../components/foodbankDashboard/metricCard"
import Navbar from "../components/foodbankNavbar"
import AIAssistant from '../components/aiAssistant'
import { BarChart3, MapPin, Star, TrendingUp } from "lucide-react"

import { fetchFoodbankSummary, fetchPickupMapData } from "../services/analytics"
import { useAppSelector } from "../redux/hooks"

const Dashboard: React.FC = () => {
  const [timeRange, setTimeRange] = useState("month")
  const [summaryData, setSummaryData] = useState<any | null>(null)
  const [loading, setLoading] = useState(true)

  const foodbankId = useAppSelector((state: any) => state.user.type_id)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);

        const [summary, pickupData] = await Promise.all([
          fetchFoodbankSummary(foodbankId),
          fetchPickupMapData(foodbankId),
        ]);

        setSummaryData({
          ...summary,
          avgPickupDistance: pickupData.avgDistance,
        });
      } catch (err) {
      } finally {
        setLoading(false);
      }
    };

    if (foodbankId) loadData();
  }, [foodbankId]);

  return (
    <div className={styles.dashboardContainer}>
      <Navbar active="dashboard" />

      <div className={styles.dashboardContent}>
        <div className={styles.dashboardHeader}>
          <h1>Analytics Dashboard</h1>
          <div className={styles.timeRangeSelector}>
            <button className={timeRange === "week" ? styles.active : ""} onClick={() => setTimeRange("week")}>
              Week
            </button>
            <button className={timeRange === "month" ? styles.active : ""} onClick={() => setTimeRange("month")}>
              Month
            </button>
            <button className={timeRange === "year" ? styles.active : ""} onClick={() => setTimeRange("year")}>
              Year
            </button>
          </div>
        </div>

        {loading ? (
          <p>Loading data...</p>
        ) : (
          <>
            <div className={styles.metricsOverview}>
              <MetricCard title="Total Donations Claimed" value={summaryData?.totalDonations ?? "—"} icon={<TrendingUp />} />
              <MetricCard title="Participating Restaurants" value={summaryData?.totalRestaurants ?? "—"} icon={<BarChart3 />} />
              <MetricCard title="Avg. Pickup Distance" value={`${summaryData?.avgPickupDistance ?? "—"} km`} icon={<MapPin />} />
              <MetricCard title="Avg. Restaurant Rating" value={summaryData?.avgRating ?? "—"} icon={<Star />} />
            </div>

            <div className={styles.chartsContainer}>
              <div className={styles.chartRow}>
                <div className={styles.chartCard}>
                  <h2>Total Donations Claimed</h2>
                  <DonationChart timeRange={timeRange} />
                </div>
                <div className={styles.chartCard}>
                  <h2>Food Category Breakdown</h2>
                  <FoodCategoryChart />
                </div>
              </div>

              <div className={styles.chartRow}>
                <div className={styles.chartCard}>
                  <h2>Pickup Distance & Efficiency</h2>
                  <PickupMap />
                </div>
                <div className={styles.chartCard}>
                  <h2>Most Ordered From</h2>
                  <TopRestaurants />
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
  )
}

export default Dashboard
