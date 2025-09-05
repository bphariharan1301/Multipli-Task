import { Coin } from "@/store/slices/coinsSlice";
import {
	Avatar,
	Box,
	TableCell,
	TableRow,
	Typography,
	Chip,
} from "@mui/material";
import React, { memo } from "react";

interface DashboardTableRowProps {
	coin: Coin;
}

const DashboardTableRow = memo((props: DashboardTableRowProps) => {
	const positive = props.coin.price_change_percentage_24h >= 0;

	return (
		<TableRow hover>
			<TableCell>
				<Box display="flex" alignItems="center" gap={1}>
					<Avatar
						src={props.coin.image}
						alt={props.coin.name}
						sx={{ width: 32, height: 32 }}
					>
						{!props.coin.image && props.coin.symbol.slice(0, 2).toUpperCase()}
					</Avatar>
					<Box>
						<Typography variant="subtitle2">{props.coin.name}</Typography>
						<Typography variant="caption" color="text.secondary">
							{props.coin.symbol.toUpperCase()}
						</Typography>
					</Box>
				</Box>
			</TableCell>
			<TableCell align="right">
				<Typography fontWeight="medium">
					{props.coin.current_price.toLocaleString(undefined, {
						style: "currency",
						currency: "USD",
						minimumFractionDigits: 2,
						maximumFractionDigits: props.coin.current_price < 1 ? 8 : 2,
					})}
				</Typography>
			</TableCell>
			<TableCell align="right">
				<Chip
					label={`${positive ? '+' : ''}${props.coin.price_change_percentage_24h.toFixed(2)}%`}
					size="small"
					sx={{
						bgcolor: positive
							? "rgba(16,185,129,0.12)"
							: "rgba(239,68,68,0.12)",
						color: positive
							? "success.main"
							: "error.main",
						fontWeight: 600,
					}}
				/>
			</TableCell>
			<TableCell align="right" sx={{ display: { xs: "none", md: "table-cell" } }}>
				<Typography fontWeight="medium">
					{props.coin.market_cap.toLocaleString(undefined, {
						style: "currency",
						currency: "USD",
						maximumFractionDigits: 0,
					})}
				</Typography>
			</TableCell>
		</TableRow>
	);
});

DashboardTableRow.displayName = 'DashboardTableRow';

export default DashboardTableRow;
