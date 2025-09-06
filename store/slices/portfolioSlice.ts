import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';

import { PortfolioState, PortfolioCoin } from '@/constants/interface';

const initialState: PortfolioState = {
  coins: {},
};

const portfolioSlice = createSlice({
  name: 'portfolio',
  initialState,
  reducers: {
    addCoinToPortfolio: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      if (state.coins[id]) {
        state.coins[id].amount += amount;
      } else {
        state.coins[id] = { id, amount };
      }
    },
    updateCoinAmount: (
      state,
      action: PayloadAction<{ id: string; amount: number }>
    ) => {
      const { id, amount } = action.payload;
      if (state.coins[id]) {
        state.coins[id].amount = amount;
      }
    },
    removeCoinFromPortfolio: (state, action: PayloadAction<string>) => {
      delete state.coins[action.payload];
    },
  },
});

export const {
  addCoinToPortfolio,
  updateCoinAmount,
  removeCoinFromPortfolio,
} = portfolioSlice.actions;

export const selectPortfolio = (state: { portfolio: PortfolioState }) =>
  state.portfolio.coins;

export const fetchPortfolioPerformance = createAsyncThunk(
  'portfolio/fetchPortfolioPerformance',
  async (coinId: string, { rejectWithValue }) => {
    try {
      const now = Math.floor(Date.now() / 1000);
      const sevenDaysAgo = now - 7 * 24 * 60 * 60; // Last 7 days
      const response = await fetch(
        `https://api.coingecko.com/api/v3/coins/${coinId}/market_chart/range?vs_currency=usd&from=${sevenDaysAgo}&to=${now}`
      );

      if (!response.ok) {
        throw new Error('Failed to fetch portfolio performance data');
      }

      const data = await response.json();
      return {
        prices: data.prices.map(([timestamp, price]: [number, number]) => ({
          x: timestamp, // Use timestamp instead of Date object
          y: price,
        })),
      };
    } catch (error) {
      return rejectWithValue(
        error instanceof Error ? error.message : 'Unknown error'
      );
    }
  }
);

export default portfolioSlice.reducer;
