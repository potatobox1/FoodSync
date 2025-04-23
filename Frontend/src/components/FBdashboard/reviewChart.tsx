"use client"

import { Line } from "react-chartjs-2"

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
import { Chart } from "react-chartjs-2"
import { useMemo } from "react"
import styles from "../../styles/reviewChart.module.css"

ChartJS.register(LineElement, BarElement, CategoryScale, LinearScale, PointElement, Tooltip, Legend)

interface ReviewsChartProps {
  timeRange: string
}

const ReviewsChart: React.FC<ReviewsChartProps> = ({ timeRange }) => {
  const chartData = useMemo(() => {
    const getData = () => {
      if (timeRange === "week") {
        return {
          labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
          ratings: [4.5, 4.7, 4.6, 4.8, 4.7, 4.9, 4.8],
          reviews: [5, 8, 6, 9, 7, 12, 10],
        }
      } else if (timeRange === "month") {
        return {
          labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
          ratings: [4.6, 4.7, 4.8, 4.7],
          reviews: [28, 32, 35, 30],
        }
      } else {
        return {
          labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
          ratings: [4.5, 4.6, 4.6, 4.7, 4.7, 4.8, 4.8, 4.7, 4.8, 4.9, 4.8, 4.7],
          reviews: [25, 28, 30, 32, 35, 40, 42, 38, 45, 48, 50, 45],
        }
      }
    }

    const { labels, ratings, reviews } = getData()

    return {
      labels,
      datasets: [
        {
          type: "line" as const,
          label: "Avg. Rating",
          data: ratings,
          borderColor: "#00A896",
          backgroundColor: "#00A896",
          tension: 0.4,
          yAxisID: "y1",
        },
        {
          type: "bar" as const,
          label: "Reviews",
          data: reviews,
          backgroundColor: "rgba(0, 168, 150, 0.2)",
          yAxisID: "y2",
        },
      ],
    }
  }, [timeRange])

  const options = {
    responsive: true,
    scales: {
      y1: {
        type: "linear" as const,
        position: "left" as const,
        min: 4,
        max: 5,
        ticks: {
          stepSize: 0.1,
        },
        grid: {
          drawOnChartArea: false,
        },
      },
      y2: {
        type: "linear" as const,
        position: "right" as const,
        beginAtZero: true,
        grid: {
          drawOnChartArea: true,
        },
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
      <Chart type="bar" data={chartData} options={options} />

      </div>
      <div className={styles.feedbackSummary}>
        <div className={styles.feedbackItem}>
          <div className={styles.feedbackLabel}>Average Rating</div>
          <div className={styles.feedbackValue}>4.7</div>
        </div>
        <div className={styles.feedbackItem}>
          <div className={styles.feedbackLabel}>Total Reviews</div>
          <div className={styles.feedbackValue}>425</div>
        </div>
        <div className={styles.feedbackItem}>
          <div className={styles.feedbackLabel}>Response Rate</div>
          <div className={styles.feedbackValue}>98%</div>
        </div>
      </div>
    </div>
  )
}

export default ReviewsChart
