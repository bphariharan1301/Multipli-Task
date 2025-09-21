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

  const prepareChartData = () => {
    if (!chartData?.prices || chartData.prices.length === 0) return null;

    // Map<DateKey, [timestamp, value]> to store latest price per day
    const dailyMap = new Map<number, [number, number]>();

    chartData.prices.forEach((price) => {
      let timestamp: number, value: number;

      if (Array.isArray(price)) {
        [timestamp, value] = price;
      } else if (typeof price === 'object' && price !== null) {
        timestamp = typeof price.x === 'number' ? price.x : new Date(price.x).getTime();
        value = price.y;
      } else return;

      const dateKey = new Date(timestamp).setHours(0, 0, 0, 0);

      // Store latest timestamp per day
      if (!dailyMap.has(dateKey) || timestamp > dailyMap.get(dateKey)![0]) {
        dailyMap.set(dateKey, [timestamp, value]);
      }
    });

    // Sort dates and take last 7 days
    const sortedDates = Array.from(dailyMap.keys())
      .sort((a, b) => a - b)
      .slice(-7);

    const labels = sortedDates.map((ts) =>
      new Date(ts).toLocaleDateString('en-GB', { day: '2-digit', month: 'short', year: '2-digit' })
    );

    const dataValues = sortedDates.map((ts) => dailyMap.get(ts)![1]);

    return {
      labels,
      datasets: [
        {
          label: selectedCoinName ? `${selectedCoinName} Price (USD)` : 'Price (USD)',
          data: dataValues,
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
          label: (context: any) => `$${context.parsed.y.toFixed(2)}`,
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
          callback: (value: any) => '$' + Number(value).toLocaleString(),
        },
        suggestedMin: chartData?.prices && chartData.prices.length > 0
          ? Math.min(...chartData.prices.map(p => Array.isArray(p) ? p[1] : p.y)) * 0.9995
          : 0,
        suggestedMax: chartData?.prices && chartData.prices.length > 0
          ? Math.max(...chartData.prices.map(p => Array.isArray(p) ? p[1] : p.y)) * 1.0005
          : 1,
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
