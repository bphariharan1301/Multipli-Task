import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

export interface Coin {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
  market_cap_rank: number;
}

export interface CoinsState {
  entities: { [id: string]: Coin };
  ids: string[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filters: {
    limit: 10 | 50;
    priceChange: 'all' | 'positive' | 'negative';
  };
}

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
};

// Async thunk to fetch coins from CoinGecko API
export const fetchCoins = createAsyncThunk(
  'coins/fetchCoins',
  async (_, { rejectWithValue }) => {
    try {
      const response = await fetch(
        'https://api.coingecko.com/api/v3/coins/markets?' +
        new URLSearchParams({
          vs_currency: 'usd',
          order: 'market_cap_desc',
          per_page: '100', // Fetch more so we can filter locally
          page: '1',
          sparkline: 'false',
          price_change_percentage: '24h',
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
    },
    setLimit: (state, action: PayloadAction<10 | 50>) => {
      state.filters.limit = action.payload;
    },
    setPriceChangeFilter: (state, action: PayloadAction<'all' | 'positive' | 'negative'>) => {
      state.filters.priceChange = action.payload;
    },
    clearFilters: (state) => {
      state.searchTerm = '';
      state.filters = {
        limit: 50,
        priceChange: 'all',
      };
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

export const { setSearchTerm, setLimit, setPriceChangeFilter, clearFilters } = coinsSlice.actions;

// Selectors
export const selectAllCoins = (state: { coins: CoinsState }) => 
  state.coins.ids.map(id => state.coins.entities[id]);

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
  
  // Apply limit filter
  return filtered.slice(0, filters.limit);
};

export const selectCoinsLoading = (state: { coins: CoinsState }) => state.coins.loading;
export const selectCoinsError = (state: { coins: CoinsState }) => state.coins.error;
export const selectSearchTerm = (state: { coins: CoinsState }) => state.coins.searchTerm;
export const selectFilters = (state: { coins: CoinsState }) => state.coins.filters;

export default coinsSlice.reducer;
