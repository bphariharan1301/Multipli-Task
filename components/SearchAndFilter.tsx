'use client';

import React, { useEffect, useRef } from 'react';
import {
  Box,
  TextField,
  InputAdornment,
  Chip,
  Typography,
  Card,
  CardContent,
  Button,
  Divider,
  useTheme,
  useMediaQuery,
} from '@mui/material';
import { Search as SearchIcon, Clear as ClearIcon } from '@mui/icons-material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import { Controller, useForm } from 'react-hook-form'

import {
  setSearchTerm,
  setLimit,
  setPriceChangeFilter,
  clearFilters,
  selectSearchTerm,
  selectFilters,
  fetchCoins,
  selectAllCoins
} from '@/store/slices/coinsSlice';
import { FilterFormValues } from '@/constants/interface';

function SearchAndFilter() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchDispatch = useAppDispatch();
  const searchTerm = useAppSelector(selectSearchTerm);
  const filters = useAppSelector(selectFilters);
  const coins = useAppSelector(selectAllCoins);

  const { control, handleSubmit, setValue, watch } = useForm<FilterFormValues>({
    defaultValues: { search: searchTerm || '' }
  })

  useEffect(() => {
    setValue('search', searchTerm);
  }, [searchTerm, setValue]);

  const debounce = (func: (...args: any[]) => void, delay: number) => {
    let timer: NodeJS.Timeout;
    return (...args: any[]) => {
      clearTimeout(timer);
      timer = setTimeout(() => func(...args), delay);
    };
  };

  const handleSearchChange = debounce((value: string) => {
    if (value.trim() === '') {
      searchDispatch(setSearchTerm(value));
      return;
    }

    const foundInFetched = coins.some((coin) =>
      coin.name.toLowerCase().includes(value.toLowerCase())
    );

    if (foundInFetched) {
      searchDispatch(setSearchTerm(value));
    } else {
      searchDispatch(fetchCoins({ search: value }));
    }
  }, 300);

  const handleLimitFilter = (limit: 10 | 50) => {
    searchDispatch(setLimit(limit));
  };

  const handlePriceChangeFilter = (filter: 'all' | 'positive' | 'negative') => {
    searchDispatch(setPriceChangeFilter(filter));
  };

  const handleClearFilters = () => {
    searchDispatch(clearFilters());
    setValue('search', '');
  };

  const hasActiveFilters = searchTerm || filters.limit !== 50 || filters.priceChange !== 'all';

  return (
    <Card sx={{ mb: 3, borderRadius: 2 }}>
      <CardContent sx={{ pb: '16px !important' }}>
        <form onSubmit={handleSubmit(() => { })} >
          <Box
            display="flex"
            flexDirection={isMobile ? 'column' : 'row'}
            gap={2}
            alignItems={isMobile ? 'stretch' : 'center'}
          >
            {/* Search Bar */}
            <Box flex={isMobile ? 1 : 2}>
              <Controller
                name='search'
                control={control}
                render={({ field }) => (
                  <TextField
                    {...field}
                    fullWidth
                    size="small"
                    placeholder="Search cryptocurrencies..."
                    slotProps={{
                      input: {
                        startAdornment: (
                          <InputAdornment position="start">
                            <SearchIcon color="action" fontSize="small" />
                          </InputAdornment>
                        ),
                      }
                    }}
                    sx={{
                      '& .MuiOutlinedInput-root': {
                        borderRadius: 1.5,
                      }
                    }}
                    onChange={(event) => {
                      field.onChange(event)
                      handleSearchChange(event.target.value)
                    }}
                  />
                )}
              />
            </Box>

            {/* Vertical Divider for Desktop */}
            {!isMobile && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, height: 'auto', alignSelf: 'stretch' }}
              />
            )}

            {/* Market Cap Filters */}
            <Box
              display="flex"
              flexDirection={isMobile ? 'row' : 'row'}
              gap={1}
              alignItems="center"
              minWidth={isMobile ? 'auto' : '200px'}
            >
              {!isMobile && (
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1, minWidth: '60px' }}>
                  Top:
                </Typography>
              )}
              <Chip
                label="10"
                size="small"
                variant={filters.limit === 10 ? 'filled' : 'outlined'}
                color={filters.limit === 10 ? 'primary' : 'default'}
                onClick={() => handleLimitFilter(10)}
                clickable
                sx={{ minWidth: '45px', borderRadius: 1 }}
              />
              <Chip
                label="50"
                size="small"
                variant={filters.limit === 50 ? 'filled' : 'outlined'}
                color={filters.limit === 50 ? 'primary' : 'default'}
                onClick={() => handleLimitFilter(50)}
                clickable
                sx={{ minWidth: '45px', borderRadius: 1 }}
              />
            </Box>

            {/* Vertical Divider for Desktop */}
            {!isMobile && (
              <Divider
                orientation="vertical"
                flexItem
                sx={{ mx: 1, height: 'auto', alignSelf: 'stretch' }}
              />
            )}

            {/* Price Change Filters */}
            <Box
              display="flex"
              gap={1}
              alignItems="center"
              minWidth={isMobile ? 'auto' : '250px'}
            >
              {!isMobile && (
                <Typography variant="caption" color="text.secondary" sx={{ mr: 1, minWidth: '50px' }}>
                  24h:
                </Typography>
              )}
              <Chip
                label="All"
                size="small"
                variant={filters.priceChange === 'all' ? 'filled' : 'outlined'}
                color={filters.priceChange === 'all' ? 'primary' : 'default'}
                onClick={() => handlePriceChangeFilter('all')}
                clickable
                sx={{ minWidth: '40px', borderRadius: 1 }}
              />
              <Chip
                label="+"
                size="small"
                variant={filters.priceChange === 'positive' ? 'filled' : 'outlined'}
                color={filters.priceChange === 'positive' ? 'success' : 'default'}
                onClick={() => handlePriceChangeFilter('positive')}
                clickable
                sx={{ minWidth: '35px', borderRadius: 1 }}
              />
              <Chip
                label="−"
                size="small"
                variant={filters.priceChange === 'negative' ? 'filled' : 'outlined'}
                color={filters.priceChange === 'negative' ? 'error' : 'default'}
                onClick={() => handlePriceChangeFilter('negative')}
                clickable
                sx={{ minWidth: '35px', borderRadius: 1 }}
              />
            </Box>

            {/* Clear Filters Button */}
            {hasActiveFilters && (
              <Box>
                <Button
                  startIcon={<ClearIcon />}
                  onClick={handleClearFilters}
                  size="small"
                  variant="outlined"
                  color="secondary"
                  sx={{
                    minWidth: 'auto',
                    borderRadius: 1.5,
                    px: 2,
                  }}
                >
                  {isMobile ? 'Clear' : 'Clear All'}
                </Button>
              </Box>
            )}
          </Box>
        </form>
      </CardContent>
    </Card>
  );
};

export default SearchAndFilter;
