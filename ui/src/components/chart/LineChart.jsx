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

// Register the required components for Chart.js
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Chart = () => {
  // Sample data to test the chart
  const sampleData = [
    { label: "January", value: 100 },
    { label: "February", value: 120 },
    { label: "March", value: 90 },
    { label: "April", value: 150 },
    { label: "May", value: 200 },
    { label: "June", value: 170 },
  ];

  // Prepare the data for the chart
  const chartData = {
    labels: sampleData.map((item) => item.label),
    datasets: [
      {
        label: "Value",
        data: sampleData.map((item) => item.value),
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
    <div className="container">
      <h1 className="text-center text-success my-5">Sample Line Chart</h1>
      <div className="chart-container bg-dark p-4 rounded-lg shadow-lg">
        <Line data={chartData} options={options} />
      </div>
    </div>
  );
};

export default Chart;
