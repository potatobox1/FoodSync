"use client"

import type React from "react"
import { useEffect, useRef } from "react"
import styles from "../../styles/categoryChart.module.css"

const FoodCategoryChart: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Sample data
  const categories = [
    { name: "Prepared Meals", value: 35, color: "#00A896" },
    { name: "Bakery", value: 25, color: "#02C39A" },
    { name: "Produce", value: 20, color: "#00BFB2" },
    { name: "Beverages", value: 15, color: "#028090" },
    { name: "Desserts", value: 5, color: "#05668D" },
  ]

  useEffect(() => {
    if (!canvasRef.current) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas dimensions
    canvas.width = canvas.offsetWidth
    canvas.height = canvas.offsetHeight

    // Calculate total
    const total = categories.reduce((sum, category) => sum + category.value, 0)

    // Draw pie chart
    let startAngle = 0
    categories.forEach((category) => {
      const sliceAngle = (2 * Math.PI * category.value) / total

      ctx.beginPath()
      ctx.moveTo(canvas.width / 2, canvas.height / 2)
      ctx.arc(
        canvas.width / 2,
        canvas.height / 2,
        Math.min(canvas.width, canvas.height) / 2 - 20,
        startAngle,
        startAngle + sliceAngle,
      )
      ctx.closePath()

      ctx.fillStyle = category.color
      ctx.fill()

      startAngle += sliceAngle
    })

    // Draw center circle (donut style)
    ctx.beginPath()
    ctx.arc(canvas.width / 2, canvas.height / 2, Math.min(canvas.width, canvas.height) / 4, 0, 2 * Math.PI)
    ctx.fillStyle = "white"
    ctx.fill()
  }, [])

  return (
    <div className={styles.container}>
      <div className={styles.chartContainer}>
        <canvas ref={canvasRef} className={styles.chart}></canvas>
      </div>
      <div className={styles.legend}>
        {categories.map((category) => (
          <div key={category.name} className={styles.legendItem}>
            <div className={styles.legendColor} style={{ backgroundColor: category.color }}></div>
            <div className={styles.legendText}>
              <span>{category.name}</span>
              <span className={styles.legendValue}>{category.value}%</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

export default FoodCategoryChart
