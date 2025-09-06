import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { createSelector } from '@reduxjs/toolkit';
import { Coin, CoinsState } from '@/constants/interface';
const initialState: CoinsState = {
  entities: {},
  ids: [],
  loading: false,
  error: null,
  searchTerm: '',
  filters: {
    limit: 50,
    priceChange: 'all',
  },
  pagination: {
    currentPage: 1,
    totalPages: 1,
    itemsPerPage: 10,
    totalItems: 0,
  },
};

// Async thunk to fetch coins from CoinGecko API
export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (
    params: { page?: number; perPage?: number; search?: string } = {},
    { rejectWithValue }
  ) => {
    try {
      const { page = 1, perPage = 250, search = '' } = params;
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?' +
          new URLSearchParams({
            vs_currency: 'usd',
            order: 'market_cap_desc',
            per_page: perPage.toString(),
            page: page.toString(),
            sparkline: 'false',
            price_change_percentage: '24h',
            ...(search && { names: search }),
          })
      );

      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }

      const data = await response.json();
      return data;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const coinsSlice = createSlice({
  name: 'coins',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      // Reset to page 1 when searching
      state.pagination.currentPage = 1;
    },
    setLimit: (state, action: PayloadAction<10 | 50>) => {
      state.filters.limit = action.payload;
      // Reset to page 1 when changing limit
      state.pagination.currentPage = 1;
    },
    setPriceChangeFilter: (state, action: PayloadAction<'all' | 'positive' | 'negative'>) => {
      state.filters.priceChange = action.payload;
      // Reset to page 1 when changing filter
      state.pagination.currentPage = 1;
    },
    setCurrentPage: (state, action: PayloadAction<number>) => {
      state.pagination.currentPage = action.payload;
    },
    setItemsPerPage: (state, action: PayloadAction<number>) => {
      state.pagination.itemsPerPage = action.payload;
      state.pagination.currentPage = 1; // Reset to page 1
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.filters = {
        limit: 50,
        priceChange: 'all',
      };
      state.pagination.currentPage = 1;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCoins.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoins.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        
        // Normalize the data
        state.entities = {};
        state.ids = [];
        
        action.payload.forEach((coin: Coin) => {
          state.entities[coin.id] = coin;
          state.ids.push(coin.id);
        });
      })
      .addCase(fetchCoins.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { 
  setSearchTerm, 
  setLimit, 
  setPriceChangeFilter, 
  setCurrentPage, 
  setItemsPerPage, 
  clearFilters 
} = coinsSlice.actions;

// Selectors
export const selectAllCoins = createSelector(
  (state: { coins: CoinsState }) => state.coins.entities,
  (state: { coins: CoinsState }) => state.coins.ids,
  (entities, ids) => ids.map((id) => entities[id])
);

export const selectFilteredCoins = (state: { coins: CoinsState }) => {
  const coins = selectAllCoins(state);
  const { searchTerm, filters } = state.coins;
  
  let filtered = coins;
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply price change filter
  if (filters.priceChange === 'positive') {
    filtered = filtered.filter(coin => coin.price_change_percentage_24h > 0);
  } else if (filters.priceChange === 'negative') {
    filtered = filtered.filter(coin => coin.price_change_percentage_24h < 0);
  }
  
  // Apply limit filter (this acts as a cap, not pagination)
  return filtered.slice(0, filters.limit);
};

export const selectPaginatedCoins = (state: { coins: CoinsState }) => {
  const coins = selectAllCoins(state);
  const { searchTerm, filters, pagination } = state.coins;
  
  let filtered = coins;
  
  // Apply search filter
  if (searchTerm) {
    filtered = filtered.filter(coin => 
      coin.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      coin.symbol.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }
  
  // Apply price change filter
  if (filters.priceChange === 'positive') {
    filtered = filtered.filter(coin => coin.price_change_percentage_24h > 0);
  } else if (filters.priceChange === 'negative') {
    filtered = filtered.filter(coin => coin.price_change_percentage_24h < 0);
  }
  
  // Calculate pagination
  const totalItems = Math.min(filtered.length, filters.limit);
  const totalPages = Math.ceil(totalItems / pagination.itemsPerPage);
  const startIndex = (pagination.currentPage - 1) * pagination.itemsPerPage;
  const endIndex = Math.min(startIndex + pagination.itemsPerPage, totalItems);
  
  // Get paginated results
  const paginatedResults = filtered.slice(0, filters.limit).slice(startIndex, endIndex);
  
  return {
    items: paginatedResults,
    pagination: {
      currentPage: pagination.currentPage,
      totalPages,
      itemsPerPage: pagination.itemsPerPage,
      totalItems,
      startIndex: startIndex + 1,
      endIndex: Math.min(endIndex, totalItems),
    }
  };
};

export const selectCoinsLoading = (state: { coins: CoinsState }) => state.coins.loading;
export const selectCoinsError = (state: { coins: CoinsState }) => state.coins.error;
export const selectSearchTerm = (state: { coins: CoinsState }) => state.coins.searchTerm;
export const selectFilters = (state: { coins: CoinsState }) => state.coins.filters;
export const selectPagination = (state: { coins: CoinsState }) => state.coins.pagination;

export default coinsSlice.reducer;
