"use client"

import React from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface DonationChartProps {
  timeRange: string
}

const DonationChart: React.FC<DonationChartProps> = ({ timeRange }) => {
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

  const { labels, values } = getData()

  const data = {
    labels,
    datasets: [
      {
        label: "Donations Claimed",
        data: values,
        backgroundColor: "#00A896",
        borderRadius: 6,
      },
    ],
  }

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.y} meals`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 50,
        },
        grid: {
          color: "#eee",
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  }

  return (
    <div style={{ width: "100%", height: "300px" }}>
      <Bar data={data} options={options} />
    </div>
  )
}

export default DonationChart
