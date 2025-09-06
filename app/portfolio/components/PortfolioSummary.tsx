import React from 'react';
import { Card, CardContent, Typography, Box, Chip } from '@mui/material';
import { TrendingUp, TrendingDown } from '@mui/icons-material';

import { PortfolioSummaryProps } from '@/constants/interface';

function PortfolioSummary({ title, value, change, isMainValue = false }: PortfolioSummaryProps) {
  const isPositive = change >= 0;

  return (
    <Card sx={{ height: '100%' }}>
      <CardContent>
        <Typography color="text.secondary" gutterBottom variant="body2">
          {title}
        </Typography>
        <Typography
          variant={isMainValue ? "h4" : "h6"}
          component="div"
          fontWeight="bold"
          mb={1}
        >
          {value}
        </Typography>
        <Box display="flex" alignItems="center" gap={0.5}>
          {isPositive ? (
            <TrendingUp color="success" fontSize="small" />
          ) : (
            <TrendingDown color="error" fontSize="small" />
          )}
          <Chip
            label={`${isPositive ? '+' : ''}${change.toFixed(2)}%`}
            size="small"
            sx={{
              bgcolor: isPositive
                ? 'rgba(16,185,129,0.12)'
                : 'rgba(239,68,68,0.12)',
              color: isPositive ? 'success.main' : 'error.main',
              fontWeight: 600,
              fontSize: '0.75rem',
            }}
          />
          <Typography variant="caption" color="text.secondary" ml={1}>
            24h
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default PortfolioSummary;
