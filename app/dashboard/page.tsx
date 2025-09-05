'use client';

import React, { useEffect } from "react";
import { Box, Typography, Card, CardContent } from "@mui/material";
import DashboardTable from "./Table/DashboardTable";
import SearchAndFilter from "@/components/SearchAndFilter";
import { useAppDispatch, useAppSelector } from "@/store/hooks";
import { fetchCoins, selectAllCoins } from "@/store/slices/coinsSlice";

function DashboardPage() {
	const dispatch = useAppDispatch();
	const coins = useAppSelector(selectAllCoins);

	// Fetch coins on component mount and set up auto-refresh
	useEffect(() => {
		dispatch(fetchCoins());

		// Set up auto-refresh every 30 seconds
		const interval = setInterval(() => {
			dispatch(fetchCoins());
		}, 30000);

		return () => clearInterval(interval);
	}, [dispatch]);

	// Calculate market stats from coins data
	const totalMarketCap = coins.reduce((sum, coin) => sum + (coin.market_cap || 0), 0);
	const avgChange24h = coins.length > 0
		? coins.reduce((sum, coin) => sum + (coin.price_change_percentage_24h || 0), 0) / coins.length
		: 0;
	const btcCoin = coins.find(coin => coin.symbol === 'btc');
	const btcDominance = btcCoin && totalMarketCap > 0
		? (btcCoin.market_cap / totalMarketCap * 100)
		: 0;

	return (
		<Box>
			<Box mb={3}>
				<Typography variant="h4" gutterBottom>
					Market Overview
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Track real-time cryptocurrency prices, market caps, and 24-hour changes
				</Typography>
			</Box>

			{/* Market Stats Overview */}
			<Box
				display="flex"
				flexDirection={{ xs: 'column', md: 'row' }}
				gap={2}
				mb={4}
			>
				<Card sx={{ flex: 1 }}>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>
							Total Market Cap
						</Typography>
						<Typography variant="h5" component="div">
							{totalMarketCap > 0
								? `$${(totalMarketCap / 1e12).toFixed(2)}T`
								: '$1.2T'
							}
						</Typography>
						<Typography
							variant="body2"
							color={avgChange24h >= 0 ? "success.main" : "error.main"}
						>
							{avgChange24h >= 0 ? '+' : ''}{avgChange24h.toFixed(2)}% (24h)
						</Typography>
					</CardContent>
				</Card>

				<Card sx={{ flex: 1 }}>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>
							24h Volume
						</Typography>
						<Typography variant="h5" component="div">
							$89B
						</Typography>
						<Typography variant="body2" color="error.main">
							-1.2% (24h)
						</Typography>
					</CardContent>
				</Card>

				<Card sx={{ flex: 1 }}>
					<CardContent>
						<Typography color="text.secondary" gutterBottom>
							BTC Dominance
						</Typography>
						<Typography variant="h5" component="div">
							{btcDominance > 0
								? `${btcDominance.toFixed(1)}%`
								: '52.3%'
							}
						</Typography>
						<Typography variant="body2" color="text.secondary">
							+0.8% (24h)
						</Typography>
					</CardContent>
				</Card>
			</Box>

			{/* Search and Filter */}
			<SearchAndFilter />

			{/* Cryptocurrencies Table */}
			<DashboardTable />
		</Box>
	);
}

export default DashboardPage;
