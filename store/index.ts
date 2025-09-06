import { configureStore } from '@reduxjs/toolkit';
import coinsReducer from './slices/coinsSlice';
import portfolioReducer from './slices/portfolioSlice';
import coinSearchReducer from './slices/coinSearchSlice';

export const store = configureStore({
  reducer: {
    coins: coinsReducer,
    portfolio: portfolioReducer,
    coinSearch: coinSearchReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
