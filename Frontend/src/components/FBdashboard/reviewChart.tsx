"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import styles from "../../styles/reviewChart.module.css"

interface ReviewsChartProps {
  timeRange: string
}

const ReviewsChart: React.FC<ReviewsChartProps> = ({ timeRange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sample data based on time range
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

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    const data = getData()
    const { labels, ratings, reviews } = data

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart dimensions
    const chartWidth = canvas.width - 60
    const chartHeight = canvas.height - 60

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, chartHeight + 20)
    ctx.lineTo(chartWidth + 40, chartHeight + 20)
    ctx.strokeStyle = "#ddd"
    ctx.stroke()

    // Draw rating line
    ctx.beginPath()
    ctx.moveTo(40 + (chartWidth / (labels.length - 1)) * 0, chartHeight + 20 - (ratings[0] - 4) * chartHeight)

    for (let i = 1; i < labels.length; i++) {
      const x = 40 + (chartWidth / (labels.length - 1)) * i
      const y = chartHeight + 20 - (ratings[i] - 4) * chartHeight
      ctx.lineTo(x, y)
    }

    ctx.strokeStyle = "#00A896"
    ctx.lineWidth = 3
    ctx.stroke()

    // Draw review bars
    const maxReviews = Math.max(...reviews)
    const barWidth = Math.min(chartWidth / labels.length / 2, 30) // Limit max bar width

    reviews.forEach((review, index) => {
      const barHeight = (review / maxReviews) * (chartHeight / 2)
      const x = 40 + (chartWidth / (labels.length - 1)) * index - barWidth / 2
      const y = chartHeight + 20 - barHeight

      ctx.fillStyle = "rgba(0, 168, 150, 0.2)"
      ctx.fillRect(x, y, barWidth, barHeight)
    })

    // Draw labels
    labels.forEach((label, index) => {
      const x = 40 + (chartWidth / (labels.length - 1)) * index

      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      // Use shorter text if space is limited
      const displayLabel = canvas.width < 500 && label.length > 3 ? label.substring(0, 3) : label
      ctx.fillText(displayLabel, x, chartHeight + 40)

      // Draw rating points
      ctx.beginPath()
      ctx.arc(x, chartHeight + 20 - (ratings[index] - 4) * chartHeight, 4, 0, 2 * Math.PI)
      ctx.fillStyle = "#00A896"
      ctx.fill()

      // Draw rating values
      ctx.fillStyle = "#333"
      ctx.fillText(ratings[index].toString(), x, chartHeight + 20 - (ratings[index] - 4) * chartHeight - 10)
    })

    // Draw legends - adjust position for smaller screens
    const legendX = canvas.width < 400 ? chartWidth - 80 : chartWidth - 100

    ctx.fillStyle = "#00A896"
    ctx.fillRect(legendX, 20, 12, 12)
    ctx.fillStyle = "#333"
    ctx.textAlign = "left"
    ctx.fillText("Avg. Rating", legendX + 20, 30)

    ctx.fillStyle = "rgba(0, 168, 150, 0.2)"
    ctx.fillRect(legendX, 40, 12, 12)
    ctx.fillStyle = "#333"
    ctx.fillText("Reviews", legendX + 20, 50)
  }, [timeRange])

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <canvas ref={canvasRef} className={styles.chart}></canvas>
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
