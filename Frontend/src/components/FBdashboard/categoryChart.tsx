"use client"

import { Doughnut } from "react-chartjs-2"
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend,
} from "chart.js"
import React from "react"

ChartJS.register(ArcElement, Tooltip, Legend)

const FoodCategoryChart: React.FC = () => {
  const categories = [
    { name: "Savoury", value: 35, color: "#00A896" },
    { name: "Sweet", value: 25, color: "#02C39A" },
    { name: "Beverages", value: 20, color: "#00BFB2" },
    // { name: "Beverages", value: 15, color: "#028090" },
    // { name: "Desserts", value: 5, color: "#05668D" },
  ]

  const data = {
    labels: categories.map((c) => c.name),
    datasets: [
      {
        data: categories.map((c) => c.value),
        backgroundColor: categories.map((c) => c.color),
        borderWidth: 1,
        
      },
    ],
  }

  const options = {
    cutout: "60%", // donut thickness
    plugins: {
      legend: {
        position: "bottom" as const,
        labels: {
          boxWidth: 12,
          padding: 16,
        },
      },
    },
    maintainAspectRatio: false,
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Doughnut data={data} options={options} />
    </div>
  )
}

export default FoodCategoryChart
