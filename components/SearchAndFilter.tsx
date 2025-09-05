'use client';

import React from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  Card,
  CardContent,
  Button,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  setSearchTerm,
  setLimit,
  setPriceChangeFilter,
  clearFilters,
  selectSearchTerm,
  selectFilters,
} from '@/store/slices/coinsSlice';

const SearchAndFilter: React.FC = () => {
  const dispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const filters = useAppSelector(selectFilters);

  const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    dispatch(setSearchTerm(event.target.value));
  };

  const handleLimitFilter = (limit: 10 | 50) => {
    dispatch(setLimit(limit));
  };

  const handlePriceChangeFilter = (filter: 'all' | 'positive' | 'negative') => {
    dispatch(setPriceChangeFilter(filter));
  };

  const handleClearFilters = () => {
    dispatch(clearFilters());
  };

  const hasActiveFilters = searchTerm || filters.limit !== 50 || filters.priceChange !== 'all';

  return (
    <Card sx={{ mb: 3 }}>
      <CardContent>
        {/* Search Bar */}
        <TextField
          fullWidth
          placeholder="Search cryptocurrencies by name or symbol..."
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon color="action" />
              </InputAdornment>
            ),
          }}
          sx={{ mb: 3 }}
        />

        {/* Filter Section */}
        <Box>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Filters
            </Typography>
            {hasActiveFilters && (
              <Button
                startIcon={<ClearIcon />}
                onClick={handleClearFilters}
                size="small"
                variant="outlined"
              >
                Clear All
              </Button>
            )}
          </Box>

          {/* Market Cap Filters */}
          <Box mb={2}>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              Market Cap Ranking
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label="Top 10"
                variant={filters.limit === 10 ? 'filled' : 'outlined'}
                color={filters.limit === 10 ? 'primary' : 'default'}
                onClick={() => handleLimitFilter(10)}
                clickable
              />
              <Chip
                label="Top 50"
                variant={filters.limit === 50 ? 'filled' : 'outlined'}
                color={filters.limit === 50 ? 'primary' : 'default'}
                onClick={() => handleLimitFilter(50)}
                clickable
              />
            </Box>
          </Box>

          {/* Price Change Filters */}
          <Box>
            <Typography variant="subtitle2" color="text.secondary" gutterBottom>
              24h Price Change
            </Typography>
            <Box display="flex" gap={1} flexWrap="wrap">
              <Chip
                label="All"
                variant={filters.priceChange === 'all' ? 'filled' : 'outlined'}
                color={filters.priceChange === 'all' ? 'primary' : 'default'}
                onClick={() => handlePriceChangeFilter('all')}
                clickable
              />
              <Chip
                label="Positive (+)"
                variant={filters.priceChange === 'positive' ? 'filled' : 'outlined'}
                color={filters.priceChange === 'positive' ? 'success' : 'default'}
                onClick={() => handlePriceChangeFilter('positive')}
                clickable
              />
              <Chip
                label="Negative (-)"
                variant={filters.priceChange === 'negative' ? 'filled' : 'outlined'}
                color={filters.priceChange === 'negative' ? 'error' : 'default'}
                onClick={() => handlePriceChangeFilter('negative')}
                clickable
              />
            </Box>
          </Box>
        </Box>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;
