'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  TextField,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Avatar,
  Chip,
  IconButton,
} from '@mui/material';
import { Add as AddIcon, Edit as EditIcon } from '@mui/icons-material';
import PortfolioChart from './components/PortfolioChart';
import PortfolioSummary from './components/PortfolioSummary';
import AddCoinDialog from './components/AddCoinDialog';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  addCoinToPortfolio,
  updateCoinAmount,
  removeCoinFromPortfolio,
  selectPortfolio,
  fetchPortfolioPerformance,
} from '@/store/slices/portfolioSlice';
import { selectAllCoins, fetchCoins } from '@/store/slices/coinsSlice';

function PortfolioPage() {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editAmount, setEditAmount] = React.useState<string>('');
  const [addDialogOpen, setAddDialogOpen] = React.useState(false);
  const [selectedCoinName, setSelectedCoinName] = useState<string | null>(null);
  const [chartData, setChartData] = useState<{ prices: { x: Date; y: number }[] } | null>(null);

  const portfolio = useAppSelector(selectPortfolio);
  const coins = useAppSelector(selectAllCoins);
  const dispatch = useAppDispatch();

  // Fetch coins on component mount
  React.useEffect(() => {
    dispatch(fetchCoins({ perPage: 250 }));
  }, [dispatch]);

  // Build portfolio holdings with live coin data
  const portfolioArray = Object.values(portfolio)
    .map((holding) => {
      const coin = coins.find((c) => c.id === holding.id);
      if (!coin) return null;
      const totalValue = holding.amount * coin.current_price;
      return {
        id: coin.id,
        name: coin.name,
        symbol: coin.symbol,
        image: coin.image,
        amount: holding.amount,
        currentPrice: coin.current_price,
        priceChange24h: coin.price_change_percentage_24h,
        totalValue,
      };
    })
    .filter((holding): holding is NonNullable<typeof holding> => holding !== null);

  // Portfolio summary calculations
  const totalPortfolioValue = portfolioArray.reduce(
    (sum, h) => sum + h.totalValue,
    0
  );
  // Weighted average 24h change
  const totalValueYesterday = portfolioArray.reduce(
    (sum, h) => sum + h.totalValue / (1 + h.priceChange24h / 100),
    0
  );
  const portfolioChangePercent = totalValueYesterday > 0
    ? ((totalPortfolioValue - totalValueYesterday) / totalValueYesterday) * 100
    : 0;
  const portfolioChangeValue = totalPortfolioValue - totalValueYesterday;
  // Best performer
  const bestPerformer = portfolioArray.length > 0
    ? portfolioArray.reduce((best, h) =>
      !best || h.priceChange24h > best.priceChange24h ? h : best
    )
    : null;

  const handleEditClick = (id: string, currentAmount: number) => {
    setEditingId(id);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveEdit = () => {
    const amount = parseFloat(editAmount);
    if (isNaN(amount) || amount <= 0) return;
    dispatch(updateCoinAmount({ id: editingId!, amount }));
    setEditingId(null);
    setEditAmount('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
  };

  const handleAddCoin = (id: string, amount: number) => {
    dispatch(addCoinToPortfolio({ id, amount }));
  };

  const handleOpenAddDialog = () => {
    setAddDialogOpen(true);
  };

  const handleCloseAddDialog = () => {
    setAddDialogOpen(false);
  };

  const handleRowClick = async (coinId: string, coinName: string) => {
    // setSelectedCoinId(coinId);
    setSelectedCoinName(coinName);
    const result = await dispatch(fetchPortfolioPerformance(coinId));
    if (fetchPortfolioPerformance.fulfilled.match(result)) {
      setChartData(result.payload);
    }
  };

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          My Portfolio
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Track your cryptocurrency investments and portfolio performance
        </Typography>
      </Box>

      {/* Portfolio Summary Cards */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', md: 'row' }}
        gap={3}
        mb={4}
      >
        <Box flex={1}>
          <PortfolioSummary
            title="Total Portfolio Value"
            value={totalPortfolioValue.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            })}
            change={portfolioChangePercent}
            isMainValue
          />
        </Box>
        <Box flex={1}>
          <PortfolioSummary
            title="24h Change"
            value={portfolioChangeValue.toLocaleString(undefined, {
              style: 'currency',
              currency: 'USD',
            })}
            change={portfolioChangePercent}
          />
        </Box>
        <Box flex={1}>
          <PortfolioSummary
            title="Best Performer"
            value={bestPerformer ? `${bestPerformer.symbol.toUpperCase()} (${bestPerformer.priceChange24h.toFixed(2)}%)` : '--'}
            change={bestPerformer ? bestPerformer.priceChange24h : 0}
          />
        </Box>
      </Box>

      {/* Portfolio Chart */}
      <Box
        display="flex"
        flexDirection={{ xs: 'column', lg: 'row' }}
        gap={3}
        mb={4}
      >
        <Box flex={2}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                {selectedCoinName ? `${selectedCoinName} Performance (Last 7 Days)` : 'Portfolio Performance'}
              </Typography>
              <PortfolioChart chartData={chartData} selectedCoinName={selectedCoinName || undefined} />
            </CardContent>
          </Card>
        </Box>
      </Box>

      {/* Holdings Table */}
      <Card>
        <CardContent>
          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Typography variant="h6">
              Your Holdings
            </Typography>
            <Button
              variant="contained"
              startIcon={<AddIcon />}
              size="small"
              onClick={handleOpenAddDialog}
            >
              Add Coin
            </Button>
          </Box>

          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Asset</TableCell>
                  <TableCell align="right">Amount</TableCell>
                  <TableCell align="right">Price</TableCell>
                  <TableCell align="right">24h %</TableCell>
                  <TableCell align="right">Value</TableCell>
                  <TableCell align="center">Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {portfolioArray.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} align="center">
                      <Typography color="text.secondary" py={2}>
                        No holdings found. Add some coins to get started!
                      </Typography>
                    </TableCell>
                  </TableRow>
                ) : (
                  portfolioArray.map((holding) => (
                    <TableRow
                      key={holding.id}
                      hover
                      onClick={() => handleRowClick(holding.id, holding.name)}
                      sx={{ cursor: 'pointer' }}
                    >
                      <TableCell>
                        <Box display="flex" alignItems="center" gap={1}>
                          <Avatar
                            src={holding.image}
                            alt={holding.name}
                            sx={{ width: 32, height: 32 }}
                          >
                            {holding.symbol.slice(0, 2)}
                          </Avatar>
                          <Box>
                            <Typography variant="subtitle2">{holding.name}</Typography>
                            <Typography variant="caption" color="text.secondary">
                              {holding.symbol.toUpperCase()}
                            </Typography>
                          </Box>
                        </Box>
                      </TableCell>
                      <TableCell align="right">
                        {editingId === holding.id ? (
                          <Box display="flex" gap={1} alignItems="center">
                            <TextField
                              size="small"
                              value={editAmount}
                              onChange={(e) => setEditAmount(e.target.value)}
                              type="number"
                              sx={{ width: 100 }}
                            />
                            <Button size="small" onClick={handleSaveEdit}>
                              Save
                            </Button>
                            <Button size="small" onClick={handleCancelEdit}>
                              Cancel
                            </Button>
                          </Box>
                        ) : (
                          <Typography>
                            {holding.amount.toLocaleString(undefined, {
                              maximumFractionDigits: 8,
                            })}
                          </Typography>
                        )}
                      </TableCell>
                      <TableCell align="right">
                        {holding.currentPrice.toLocaleString(undefined, {
                          style: 'currency',
                          currency: 'USD',
                        })}
                      </TableCell>
                      <TableCell align="right">
                        <Chip
                          label={`${holding.priceChange24h.toFixed(2)}%`}
                          size="small"
                          sx={{
                            bgcolor: holding.priceChange24h >= 0
                              ? 'rgba(16,185,129,0.12)'
                              : 'rgba(239,68,68,0.12)',
                            color: holding.priceChange24h >= 0
                              ? 'success.main'
                              : 'error.main',
                            fontWeight: 600,
                          }}
                        />
                      </TableCell>
                      <TableCell align="right">
                        <Typography fontWeight="medium">
                          {holding.totalValue.toLocaleString(undefined, {
                            style: 'currency',
                            currency: 'USD',
                          })}
                        </Typography>
                      </TableCell>
                      <TableCell align="center">
                        <IconButton
                          size="small"
                          onClick={() => handleEditClick(holding.id, holding.amount)}
                          disabled={editingId !== null}
                        >
                          <EditIcon />
                        </IconButton>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      {/* Add Coin Dialog */}
      <AddCoinDialog
        open={addDialogOpen}
        onClose={handleCloseAddDialog}
        onAddCoin={handleAddCoin}
      />
    </Box>
  );
}

export default PortfolioPage;