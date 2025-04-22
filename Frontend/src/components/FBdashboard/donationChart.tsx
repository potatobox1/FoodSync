"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import styles from "../../styles/donationChart.module.css"

interface DonationChartProps {
  timeRange: string
}

const DonationChart: React.FC<DonationChartProps> = ({ timeRange }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sample data based on time range
  const getData = () => {
    if (timeRange === "week") {
      return {
        labels: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
        values: [42, 58, 65, 49, 72, 80, 62],
      }
    } else if (timeRange === "month") {
      return {
        labels: ["Week 1", "Week 2", "Week 3", "Week 4"],
        values: [210, 280, 320, 290],
      }
    } else {
      return {
        labels: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"],
        values: [120, 150, 180, 210, 240, 270, 300, 330, 360, 390, 420, 450],
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
    const { labels, values } = data

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Chart dimensions
    const chartWidth = canvas.width - 60
    const chartHeight = canvas.height - 60
    const barWidth = Math.min(chartWidth / labels.length - 20, 60) // Limit max bar width

    // Find max value for scaling
    const maxValue = Math.max(...values)

    // Draw axes
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, chartHeight + 20)
    ctx.lineTo(chartWidth + 40, chartHeight + 20)
    ctx.strokeStyle = "#ddd"
    ctx.stroke()

    // Draw bars
    values.forEach((value, index) => {
      const barHeight = (value / maxValue) * chartHeight
      const x = 50 + index * (barWidth + (chartWidth - barWidth * labels.length) / (labels.length - 1 || 1))
      const y = chartHeight + 20 - barHeight

      // Draw bar
      ctx.fillStyle = "#00A896"
      ctx.fillRect(x, y, barWidth, barHeight)

      // Draw label - use shorter text if space is limited
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      const displayLabel =
        canvas.width < 500 && labels[index].length > 3 ? labels[index].substring(0, 3) : labels[index]
      ctx.fillText(displayLabel, x + barWidth / 2, chartHeight + 40)

      // Draw value
      ctx.fillStyle = "#333"
      ctx.fillText(value.toString(), x + barWidth / 2, y - 10)
    })
  }, [timeRange])

  return (
    <div className={styles.chartContainer}>
      <canvas ref={canvasRef} className={styles.chart}></canvas>
    </div>
  )
}

export default DonationChart
