import { createSlice, PayloadAction } from '@reduxjs/toolkit';

export interface PortfolioCoin {
  id: string;
  amount: number;
}

export interface PortfolioState {
  coins: { [id: string]: PortfolioCoin };
}

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

export default portfolioSlice.reducer;
