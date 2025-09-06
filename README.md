# Crypto Portfolio Dashboard

## Setup Instructions

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/bphariharan1301/Multipli-Task.git
   ```
2. Navigate to the project directory:
   ```bash
   cd Multipli-Task/multipli-dashboard
   ```
3. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```
4. Start the development server:
   ```bash
   npm run dev
   # or
   yarn dev
   ```
5. Open your browser and navigate to `http://localhost:3000`.

---

## Redux Architecture

### Overview

The application uses **Redux Toolkit** for state management. The slices represents different parts of the state.

### Used Slices

1. **portfolioSlice**:

   - Manages the user's cryptocurrency portfolio.
   - Actions:
     - `addCoinToPortfolio`: Adds a coin to the portfolio.
     - `updateCoinAmount`: Updates the amount of a coin in the portfolio.
     - `removeCoinFromPortfolio`: Removes a coin from the portfolio.
   - Async Thunks:
     - `fetchPortfolioPerformance`: Fetches the 7-day performance data for a selected coin.

2. **coinsSlice**:

   - Manages the list of available coins and their details.
   - Async Thunks:
     - `fetchCoins`: Fetches a list of coins from the API.

3. **coinSearchSlice**:
   - Handles the search functionality for coins.

### State Flow

- **Actions**: Triggered by user interactions (e.g., adding a coin, fetching data).
- **Reducers**: Update the state based on actions.
- **Selectors**: Extract specific data from the state for components.

## API Usage Details

### CoinGecko API

The application integrates with the [CoinGecko API](https://www.coingecko.com/en/api) to fetch cryptocurrency data.

### Endpoints Used

1. **Fetch Coins**:

   - Endpoint: `/coins/markets`
   - Query Parameters:
     - `vs_currency`: The currency to display prices in (e.g., `usd`).
     - `per_page`: Number of coins to fetch per page.
   - Example:
     ```bash
     https://api.coingecko.com/api/v3/coins/markets?vs_currency=usd&per_page=250
     ```

2. **Fetch Portfolio Performance**:
   - Endpoint: `/coins/{id}/market_chart/range`
   - Query Parameters:
     - `vs_currency`: The currency to display prices in (e.g., `usd`).
     - `from`: Start timestamp (in seconds).
     - `to`: End timestamp (in seconds).
   - Example:
     ```bash
     https://api.coingecko.com/api/v3/coins/bitcoin/market_chart/range?vs_currency=usd&from=1630454400&to=1631059200
     ```

### Error Handling

- API errors are caught and displayed to the user via alerts.
- Non-serializable data (e.g., `Date` objects) are converted to serializable formats (e.g., timestamps) before being stored in the Redux state.

---

## Folder Structure

```
Multipli-Task/
├── app/
│   ├── dashboard/
│   │   ├── Table/
│   │   │   │   ├── DashboardTable.tsx
│   │   │   │   ├── DashboardTableRow.tsx
│   │   │   │   ├── PortfolioSummary.tsx
│   │   ├── page.tsx
│   ├── portfolio/
│   │   ├── components/
│   │   │   ├── AddCoinDialog.tsx
│   │   │   ├── PortfolioChart.tsx
│   │   │   ├── PortfolioSummary.tsx
│   │   ├── page.tsx
├── store/
│   ├── slices/
│   │   ├── portfolioSlice.ts
│   │   ├── coinsSlice.ts
│   │   ├── coinSearchSlice.ts
│   ├── hooks.ts
│   ├── index.ts
├── theme/
│   ├── theme.ts
├── components/
│   ├── AppSidebar.tsx
│   ├── ReduxProvider.tsx
│   ├── SearchAndFilter.tsx
├── constants/
│   ├── interfaces.ts
├── package.json
├── tsconfig.json
├── README.md
```
