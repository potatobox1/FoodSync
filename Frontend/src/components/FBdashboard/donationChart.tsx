"use client"

import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js"
import { fetchDonationsChartData } from "../../services/analytics"
import { useAppSelector } from "../../redux/hooks"

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend)

interface DonationChartProps {
  timeRange: string
}

const DonationChart: React.FC<DonationChartProps> = ({ timeRange }) => {
  const foodbankId = useAppSelector((state: any) => state.user.type_id)
  const [chartData, setChartData] = useState<any>(null)

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await fetchDonationsChartData(foodbankId, timeRange)
        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Donations Claimed",
              data: data.counts,
              backgroundColor: "#00A896",
              borderRadius: 6,
            },
          ],
        })
      } catch (error) {
        console.error("Failed to load donations chart data", error)
      }
    }

    if (foodbankId) loadData()
  }, [foodbankId, timeRange])

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
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
  )
}

export default DonationChart
