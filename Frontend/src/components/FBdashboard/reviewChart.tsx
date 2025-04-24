"use client"

import { Chart } from "react-chartjs-2"
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js"
import { useEffect, useState } from "react"
import styles from "../../styles/reviewChart.module.css"
import { useAppSelector } from "../../redux/hooks"
import { fetchReviewTrends } from "../../services/analytics"

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

interface ReviewsChartProps {
  timeRange: string
}

const ReviewsChart: React.FC<ReviewsChartProps> = ({ timeRange }) => {
  const foodbankId = useAppSelector((state: any) => state.user.type_id)
  const [chartData, setChartData] = useState<any>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        const data = await fetchReviewTrends(foodbankId, timeRange)
        console.log("📈 Review trends data:", data)

        setChartData({
          labels: data.labels,
          datasets: [
            {
              type: "line" as const,
              label: "Avg. Rating",
              data: data.ratings,
              borderColor: "#00A896",
              backgroundColor: "#00A896",
              tension: 0.4,
              yAxisID: "y1",
            },
            {
              type: "bar" as const,
              label: "Review Count",
              data: data.counts,
              backgroundColor: "rgba(0, 168, 150, 0.2)",
              yAxisID: "y2",
            },
          ],
        })
      } catch (err) {
        console.error("❌ Failed to load review trends:", err)
      } finally {
        setLoading(false)
      }
    }

    if (foodbankId) loadData()
  }, [foodbankId, timeRange])

  const averageRating =
    chartData && chartData.datasets[1].data.length > 0
      ? (() => {
          const ratings = chartData.datasets[0].data
          const counts = chartData.datasets[1].data
          let totalRating = 0
          let totalReviews = 0

          for (let i = 0; i < counts.length; i++) {
            totalRating += ratings[i] * counts[i]
            totalReviews += counts[i]
          }

          return totalReviews > 0 ? (totalRating / totalReviews).toFixed(2) : "—"
        })()
      : "—"

  const totalReviews = chartData
    ? chartData.datasets[1].data.reduce((a: number, b: number) => a + b, 0)
    : "—"

  const options = {
    responsive: true,
    scales: {
      y1: {
        type: "linear" as const,
        position: "left" as const,
        min: 1,
        max: 5,
        ticks: { stepSize: 0.5 },
        grid: { drawOnChartArea: false },
      },
      y2: {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        grid: { drawOnChartArea: true },
      },
    },
    plugins: {
      legend: {
        display: true,
        position: "bottom" as const,
      },
      tooltip: {
        mode: "index" as const,
        intersect: false,
      },
    },
  }

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        {chartData ? (
          <Chart type="bar" data={chartData} options={options} />
        ) : (
          <p>Loading chart...</p>
        )}
      </div>

      <div className={styles.feedbackSummary}>
        <div className={styles.feedbackItem}>
          <div className={styles.feedbackLabel}>Average Rating</div>
          <div className={styles.feedbackValue}>{averageRating}</div>
        </div>
        <div className={styles.feedbackItem}>
          <div className={styles.feedbackLabel}>Total Reviews</div>
          <div className={styles.feedbackValue}>{totalReviews}</div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsChart
