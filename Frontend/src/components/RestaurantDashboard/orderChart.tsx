"use client";

import React, { useEffect, useState } from "react";
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  BarElement,
  CategoryScale,
  LinearScale,
  Tooltip,
  Legend,
} from "chart.js";
import { fetchRestaurantOrdersChart } from "../../services/analytics";
import { useAppSelector } from "../../redux/hooks";

ChartJS.register(BarElement, CategoryScale, LinearScale, Tooltip, Legend);

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
      legend: { display: false },
      tooltip: {
        callbacks: {
          label: (ctx: any) => ` ${ctx.parsed.y} orders`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1, // For small ranges, otherwise increase if data grows
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
  };

  return (
    <div style={{ width: "100%", height: "300px" }}>
      {chartData ? <Bar data={chartData} options={options} /> : <p>Loading chart...</p>}
    </div>
  );
};

export default OrderChart;
