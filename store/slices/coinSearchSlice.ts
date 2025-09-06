import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { CoinSearchState,  } from '@/constants/interface';

const initialState: CoinSearchState = {
  allCoins: [],
  filteredCoins: [],
  loading: false,
  error: null,
  searchTerm: '',
};

// Async thunk to fetch coins from CoinGecko markets API
export const fetchCoinsForSearch = createAsyncThunk(
  'coinSearch/fetchCoinsForSearch',
  async (
    params: { limit?: number } = {},
    { rejectWithValue }
  ) => {
    try {
      const { limit = 50 } = params;
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/markets?` +
        new URLSearchParams({
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: limit.toString(),
          page: '1',
          sparkline: 'false',
        })
      );

      if (!response.ok) {
        throw new Error('Failed to fetch coins');
      }

      const data = await response.json();
      
      // Map to the format we need
      const coinsList = data.map((coin: any) => ({
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        current_price: coin.current_price,
        market_cap_rank: coin.market_cap_rank,
      }));

      return coinsList;
    } catch (error) {
      return rejectWithValue(error instanceof Error ? error.message : 'Unknown error');
    }
  }
);

const coinSearchSlice = createSlice({
  name: 'coinSearch',
  initialState,
  reducers: {
    setSearchTerm: (state, action: PayloadAction<string>) => {
      state.searchTerm = action.payload;
      
      // Filter coins based on search term
      if (action.payload.trim() === '') {
        state.filteredCoins = state.allCoins;
      } else {
        const searchLower = action.payload.toLowerCase();
        state.filteredCoins = state.allCoins.filter(coin =>
          coin.name.toLowerCase().includes(searchLower) ||
          coin.symbol.toLowerCase().includes(searchLower)
        );
      }
    },
    clearSearchResults: (state) => {
      state.allCoins = [];
      state.filteredCoins = [];
      state.error = null;
      state.searchTerm = '';
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch coins for search
      .addCase(fetchCoinsForSearch.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchCoinsForSearch.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        state.allCoins = action.payload;
        state.filteredCoins = action.payload; // Initially show all coins
      })
      .addCase(fetchCoinsForSearch.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
        state.allCoins = [];
        state.filteredCoins = [];
      });
  },
});

export const { setSearchTerm, clearSearchResults, clearError } = coinSearchSlice.actions;

// Selectors
export const selectSearchResults = (state: { coinSearch: CoinSearchState }) => 
  state.coinSearch.filteredCoins;

export const selectAllSearchCoins = (state: { coinSearch: CoinSearchState }) => 
  state.coinSearch.allCoins;

export const selectSearchLoading = (state: { coinSearch: CoinSearchState }) => 
  state.coinSearch.loading;

export const selectSearchError = (state: { coinSearch: CoinSearchState }) => 
  state.coinSearch.error;

export const selectSearchTerm = (state: { coinSearch: CoinSearchState }) => 
  state.coinSearch.searchTerm;

export default coinSearchSlice.reducer;
