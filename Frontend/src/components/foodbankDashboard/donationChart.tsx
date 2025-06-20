"use client"

import React, { useEffect, useState } from "react"
import { Bar } from "react-chartjs-2"
import {
  Chart,
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
} from 'chart.js';

Chart.register(
  LineController,
  LineElement,
  PointElement,
  LinearScale,
  Title,
  CategoryScale,
  Tooltip,
  Legend
);
import { fetchDonationsChartData } from "../../services/analytics"
import { useAppSelector } from "../../redux/hooks"


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
        labels: {
          color: "#ffffff", // white legend text
        },
      },
      tooltip: {
        backgroundColor: "#1E1E1E",
        titleColor: "#00A896",
        bodyColor: "#ffffff",
        borderColor: "#00A896",
        borderWidth: 1,
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.y} orders`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          color: "#cccccc", // light gray tick text
        },
        grid: {
          color: "rgba(255, 255, 255, 0.1)", // subtle grid lines
        },
      },
      x: {
        ticks: {
          color: "#cccccc", // light gray labels
        },
        grid: {
          display: false,
        },
      },
    },
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
  )
}

export default DonationChart
