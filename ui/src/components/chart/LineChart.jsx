import React from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ chartData }) => {
  const defaultData = {
    labels: ["January", "February", "March", "April", "May", "June"],
    datasets: [
      {
        label: "Sample Data",
        data: [100, 120, 90, 150, 200, 170],
        borderColor: "#4e73df",
        backgroundColor: "rgba(78, 115, 223, 0.2)",
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  // Chart options
  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: "top",
        labels: {
          color: "#ffffff",
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context) {
            return `${context.dataset.label}: ${context.raw} units`;
          },
        },
      },
    },
    scales: {
      x: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "#444444",
        },
      },
      y: {
        ticks: {
          color: "#ffffff",
        },
        grid: {
          color: "#444444",
        },
      },
    },
  };

  return (
    <div className="chart-container bg-dark p-4 rounded-lg shadow-lg">
      <Line data={chartData || defaultData} options={options} />
    </div>
  );
};

export default LineChart;
