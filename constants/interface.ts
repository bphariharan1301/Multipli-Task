import { AppBarProps as MuiAppBarProps } from "@mui/material/AppBar";

export type Coin = {
  id: string;
  name: string;
  symbol: string;
  image?: string;
  current_price: number;
  price_change_percentage_24h: number;
  market_cap: number;
};

export type FilterFormValues = {
  search: string;
}

export interface CoinSearchItem {
  id: string;
  name: string;
  symbol: string;
  image: string;
  current_price: number;
  market_cap_rank: number;
}

export interface CoinSearchState {
  allCoins: CoinSearchItem[];
  filteredCoins: CoinSearchItem[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
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
  pagination: {
    currentPage: number;
    totalPages: number;
    itemsPerPage: number;
    totalItems: number;
  };
}

export interface DashboardTableRowProps {
	coin: Coin;
}

export interface AddCoinDialogProps {
  open: boolean;
  onClose: () => void;
  onAddCoin: (coinId: string, amount: number) => void;
}
export interface PortfolioSummaryProps {
  title: string;
  value: string;
  change: number;
  isMainValue?: boolean;
}

export interface PortfolioChartProps {
  chartData?: { prices: { x: Date; y: number }[] } | null;
  selectedCoinName?: string;
}

export interface PortfolioCoin {
  id: string;
  amount: number;
}

export interface PortfolioState {
  coins: { [id: string]: PortfolioCoin };
}

export interface AppBarProps extends MuiAppBarProps {
	open?: boolean;
}
