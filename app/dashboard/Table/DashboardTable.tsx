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
	Stack,
	Pagination,
	PaginationItem,
	Chip,
} from "@mui/material";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import DashboardTableRow from "./DashboardTableRow";
import { useAppSelector, useAppDispatch } from "@/store/hooks";
import {
	selectPaginatedCoins,
	selectCoinsLoading,
	selectCoinsError,
	setCurrentPage,
	setItemsPerPage,
} from "@/store/slices/coinsSlice";

function DashboardTable() {
	const dispatch = useAppDispatch();
	const paginatedData = useAppSelector(selectPaginatedCoins);
	const loading = useAppSelector(selectCoinsLoading);
	const error = useAppSelector(selectCoinsError);

	const { items: coins, pagination } = paginatedData;

	const handlePageChange = (event: React.ChangeEvent<unknown>, page: number) => {
		dispatch(setCurrentPage(page));
	};

	const handleItemsPerPageChange = (itemsPerPage: number) => {
		dispatch(setItemsPerPage(itemsPerPage));
	};

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
			<Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
				<Typography variant="h5">
					Top Cryptocurrencies
				</Typography>
				{!loading && coins.length > 0 && (
					<Typography variant="body2" color="text.secondary">
						Showing {pagination.startIndex}-{pagination.endIndex} of {pagination.totalItems} results
					</Typography>
				)}
			</Box>
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

			{/* Pagination Controls */}
			{!loading && coins.length > 0 && pagination.totalPages > 1 && (
				<Box display="flex" justifyContent="space-between" alignItems="center" mt={3} mb={2}>
					{/* Items per page selector */}
					<Box display="flex" alignItems="center" gap={1}>
						<Typography variant="body2" color="text.secondary">
							Items per page:
						</Typography>
						<Box display="flex" gap={1}>
							{[5, 10, 25, 50, 100].map((size) => (
								<Chip
									key={size}
									label={size}
									size="small"
									variant={pagination.itemsPerPage === size ? 'filled' : 'outlined'}
									color={pagination.itemsPerPage === size ? 'primary' : 'default'}
									onClick={() => handleItemsPerPageChange(size)}
									clickable
									sx={{ minWidth: '40px' }}
								/>
							))}
						</Box>
					</Box>

					{/* Pagination */}
					<Pagination
						count={pagination.totalPages}
						page={pagination.currentPage}
						onChange={handlePageChange}
						siblingCount={1}
						boundaryCount={1}
						color="primary"
						size="medium"
						renderItem={(item) => (
							<PaginationItem
								slots={{
									previous: ArrowBackIcon,
									next: ArrowForwardIcon
								}}
								{...item}
							/>
						)}
					/>
				</Box>
			)}
		</Box>
	);
}

export default DashboardTable;
