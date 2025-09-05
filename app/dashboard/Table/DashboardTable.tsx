'use client';

import React from "react";
import {
	Box,
	Paper,
	TableContainer,
	TableHead,
	Typography,
	TableRow,
	TableCell,
	TableBody,
	Table,
	CircularProgress,
	Alert,
	Skeleton,
} from "@mui/material";
import DashboardTableRow from "./DashboardTableRow";
import { useAppSelector } from "@/store/hooks";
import {
	selectFilteredCoins,
	selectCoinsLoading,
	selectCoinsError,
} from "@/store/slices/coinsSlice";

function DashboardTable() {
	const coins = useAppSelector(selectFilteredCoins);
	const loading = useAppSelector(selectCoinsLoading);
	const error = useAppSelector(selectCoinsError);

	if (error) {
		return (
			<Box>
				<Typography variant="h5" mb={2}>
					Top Cryptocurrencies
				</Typography>
				<Alert severity="error" sx={{ mb: 2 }}>
					Error loading cryptocurrency data: {error}
				</Alert>
			</Box>
		);
	}

	return (
		<Box>
			<Typography variant="h5" mb={2}>
				Top Cryptocurrencies
			</Typography>
			<TableContainer component={Paper} sx={{ overflowX: "auto" }}>
				<Table>
					<TableHead>
						<TableRow sx={{ bgcolor: 'grey.50' }}>
							<TableCell>Asset</TableCell>
							<TableCell align="right">Price (USD)</TableCell>
							<TableCell align="right">24h Change</TableCell>
							<TableCell
								align="right"
								sx={{ display: { xs: "none", md: "table-cell" } }}
							>
								Market Cap
							</TableCell>
						</TableRow>
					</TableHead>
					<TableBody>
						{loading ? (
							// Loading skeletons
							Array.from({ length: 10 }).map((_, index) => (
								<TableRow key={index}>
									<TableCell>
										<Box display="flex" alignItems="center" gap={1}>
											<Skeleton variant="circular" width={32} height={32} />
											<Box>
												<Skeleton variant="text" width={100} />
												<Skeleton variant="text" width={50} />
											</Box>
										</Box>
									</TableCell>
									<TableCell align="right">
										<Skeleton variant="text" width={80} />
									</TableCell>
									<TableCell align="right">
										<Skeleton variant="rectangular" width={60} height={24} />
									</TableCell>
									<TableCell
										align="right"
										sx={{ display: { xs: "none", md: "table-cell" } }}
									>
										<Skeleton variant="text" width={100} />
									</TableCell>
								</TableRow>
							))
						) : coins.length > 0 ? (
							coins.map((coin) => (
								<DashboardTableRow key={coin.id} coin={coin} />
							))
						) : (
							<TableRow>
								<TableCell colSpan={4} align="center" sx={{ py: 4 }}>
									<Typography color="text.secondary">
										No cryptocurrencies found matching your criteria
									</Typography>
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</TableContainer>
		</Box>
	);
}

export default DashboardTable;
