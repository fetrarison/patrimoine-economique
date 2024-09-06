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

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const LineChart = ({ data }) => {
  const prepareLineChartData = () => {
    return {
      labels: data.map((item) => item.label),
      datasets: [
        {
          label: "Current Value",
          data: data.map((item) => item.value),
          borderColor: "#4e73df",
          backgroundColor: "rgba(78, 115, 223, 0.2)",
          borderWidth: 2,
          tension: 0.3,
          fill: true,
        },
      ],
    };
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        display: true,
        position: 'top',
        labels: {
          color: '#ffffff',
          font: {
            size: 14
          }
        }
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            return `${context.dataset.label}: ${context.raw} units`;
          }
        }
      },
    },
    scales: {
      x: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#444444',
        }
      },
      y: {
        ticks: {
          color: '#ffffff',
        },
        grid: {
          color: '#444444',
        }
      },
    },
  };

  return (
    <div className="chart-container bg-dark p-4 rounded-lg shadow-lg">
      <h2 className="text-center text-light mb-4">Possessions Line Chart</h2>
      <Line data={prepareLineChartData()} options={options} />
    </div>
  );
};

export default LineChart;
