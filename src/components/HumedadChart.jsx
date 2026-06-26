import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

const HumedadChart = ({ datosGrafica }) => {
  const data = {
    labels: datosGrafica.labels,
    datasets: [
      {
        label: 'Humedad (%)',
        data: datosGrafica.valores,
        borderColor: '#27ae60',
        backgroundColor: 'rgba(39, 174, 96, 0.1)',
        borderWidth: 2,
        tension: 0.3,
        fill: true,
      },
    ],
  };

  const options = {
    scales: {
      y: {
        beginAtZero: true,
        max: 100,
      },
    },
    responsive: true,
  };

  return <Line data={data} options={options} />;
};

export default HumedadChart;