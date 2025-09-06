'use client';

import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler,
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { Box, useTheme, Typography } from '@mui/material';


ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

import { PortfolioChartProps } from '@/constants/interface';

function PortfolioChart({ chartData, selectedCoinName }: PortfolioChartProps) {
  const theme = useTheme();

  // Prepare chart data based on API response only
  const prepareChartData = () => {
    if (chartData && chartData.prices && chartData.prices.length > 0) {
      const prices = chartData.prices;

      return {
        labels: prices.map((price) => {
          const date = new Date(price.x);
          return date.toLocaleString('en-US', {
            month: 'short',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
          });
        }),
        datasets: [
          {
            label: selectedCoinName ? `${selectedCoinName} Price (USD)` : 'Price (USD)',
            data: prices.map(price => price.y),
            borderColor: theme.palette.primary.main,
            backgroundColor: `${theme.palette.primary.main}20`,
            borderWidth: 3,
            fill: true,
            tension: 0.4,
            pointBackgroundColor: theme.palette.primary.main,
            pointBorderColor: '#fff',
            pointBorderWidth: 2,
            pointRadius: 4,
            pointHoverRadius: 6,
          },
        ],
      };
    }

    // Return null if no data
    return null;
  };

  const data = prepareChartData();

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        mode: 'index' as const,
        intersect: false,
        backgroundColor: theme.palette.background.paper,
        titleColor: theme.palette.text.primary,
        bodyColor: theme.palette.text.primary,
        borderColor: theme.palette.divider,
        borderWidth: 1,
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function (context: any) {
            const value = context.parsed.y;
            return `$${value.toFixed(2)}`;
          },
        },
      },
    },
    interaction: {
      mode: 'nearest' as const,
      axis: 'x' as const,
      intersect: false,
    },
    scales: {
      x: {
        display: true,
        grid: {
          display: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
          },
          maxRotation: 45,
        },
      },
      y: {
        display: true,
        grid: {
          color: theme.palette.divider,
          drawBorder: false,
        },
        ticks: {
          color: theme.palette.text.secondary,
          font: {
            size: 12,
          },
          callback: function (value: any) {
            return '$' + value.toLocaleString();
          },
        },
      },
    },
    elements: {
      point: {
        hoverBackgroundColor: theme.palette.primary.main,
      },
    },
  };

  return (
    <Box height={300}>
      {data ? (
        <Line data={data} options={options} />
      ) : (
        <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center" height="100%">
          <Typography color="text.secondary" align="center">
            Click on a coin row to view its 7-day performance chart
          </Typography>
        </Box>
      )}
    </Box>
  );
};

export default PortfolioChart;
