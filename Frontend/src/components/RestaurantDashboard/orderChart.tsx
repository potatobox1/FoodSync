"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  LineElement,
  BarElement,
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend,
} from "chart.js"

ChartJS.register(
  LineElement,
  BarElement,
  ArcElement, 
  CategoryScale,
  LinearScale,
  PointElement,
  Tooltip,
  Legend
)

import { fetchRestaurantOrdersChart } from "../../services/analytics";
import { useAppSelector } from "../../redux/hooks";


interface OrderChartProps {
  timeRange: string;
}

const OrderChart: React.FC<OrderChartProps> = ({ timeRange }) => {
  const restaurantId = useAppSelector((state: any) => state.user.type_id);
  const [chartData, setChartData] = useState<any>(null);

  useEffect(() => {
    const load = async () => {
      try {
        const data = await fetchRestaurantOrdersChart(restaurantId, timeRange);

        setChartData({
          labels: data.labels,
          datasets: [
            {
              label: "Completed Orders",
              data: data.counts,
              backgroundColor: "#00A896",
              borderRadius: 6,
            },
          ],
        });
      } catch (err) {
        console.error("❌ Failed to load restaurant order chart", err);
      }
    };

    if (restaurantId) load();
  }, [restaurantId, timeRange]);

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
  );
};

export default OrderChart;
