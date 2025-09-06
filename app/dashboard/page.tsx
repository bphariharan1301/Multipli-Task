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
		// Fetch coins with pagination parameters checked from API docs
		dispatch(fetchCoins({ page: 1, perPage: 50 }));

		// Set up auto-refresh every 30 minutes (API key limitations 10k/month with keeping @ refresh/30 secs will consume lot of requests)
		const interval = setInterval(() => {
			dispatch(fetchCoins({ page: 1, perPage: 50 }));
		}, 1800000);

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
					Dashboard
				</Typography>
				<Typography variant="body1" color="text.secondary">
					Track real-time cryptocurrency prices, market caps, and 24-hour changes
				</Typography>
			</Box>

			{/* Search and Filter */}
			<SearchAndFilter />

			{/* Cryptocurrencies Table */}
			<DashboardTable />
		</Box>
	);
}

export default DashboardPage;
