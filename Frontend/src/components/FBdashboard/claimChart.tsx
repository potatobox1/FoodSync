"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import styles from "../../styles/claimChart.module.css"

const ClaimTimeChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)


  const timeData = [
    { range: "0-15 min", count: 45 },
    { range: "15-30 min", count: 30 },
    { range: "30-45 min", count: 15 },
    { range: "45-60 min", count: 7 },
    { range: "60+ min", count: 3 },
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    ctx.clearRect(0, 0, canvas.width, canvas.height)

    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    const chartWidth = canvas.width - 60
    const chartHeight = canvas.height - 60
    const barWidth = Math.min(chartWidth / timeData.length - 20, 50) 

   
    const maxValue = Math.max(...timeData.map((item) => item.count))

   
    ctx.beginPath()
    ctx.moveTo(40, 20)
    ctx.lineTo(40, chartHeight + 20)
    ctx.lineTo(chartWidth + 40, chartHeight + 20)
    ctx.strokeStyle = "#ddd"
    ctx.stroke()

    
    timeData.forEach((item, index) => {
      const barHeight = (item.count / maxValue) * chartHeight
      const x = 50 + index * (barWidth + (chartWidth - barWidth * timeData.length) / (timeData.length - 1 || 1))
      const y = chartHeight + 20 - barHeight

   
      const gradient = ctx.createLinearGradient(x, y, x, chartHeight + 20)
      gradient.addColorStop(0, "#00A896")
      gradient.addColorStop(1, "#05668D")

      ctx.fillStyle = gradient
      ctx.fillRect(x, y, barWidth, barHeight)

   
      ctx.fillStyle = "#666"
      ctx.font = "12px Arial"
      ctx.textAlign = "center"
      const displayLabel = canvas.width < 500 && item.range.length > 5 ? item.range.substring(0, 5) : item.range
      ctx.fillText(displayLabel, x + barWidth / 2, chartHeight + 40)

      
      ctx.fillStyle = "#333"
      ctx.fillText(`${item.count}%`, x + barWidth / 2, y - 10)
    })
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <canvas ref={canvasRef} className={styles.chart}></canvas>
      </div>
      <div className={styles.averageTime}>
        <div className={styles.averageLabel}>Average Claim-to-Pickup Time</div>
        <div className={styles.averageValue}>28 minutes</div>
      </div>
    </div>
  )
}

export default ClaimTimeChart
