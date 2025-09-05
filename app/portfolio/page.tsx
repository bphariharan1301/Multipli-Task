'use client';
import React from 'react';
import {
  Box,
  Typography,
  Paper,
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

// Dummy placeholder data
const portfolioHoldings = [
  {
    id: 'bitcoin',
    name: 'Bitcoin',
    symbol: 'BTC',
    image: 'https://cryptologos.cc/logos/bitcoin-btc-logo.png',
    amount: 0.5,
    currentPrice: 26000,
    priceChange24h: 2.53,
    totalValue: 13000,
  },
  {
    id: 'ethereum',
    name: 'Ethereum',
    symbol: 'ETH',
    image: 'https://cryptologos.cc/logos/ethereum-eth-logo.png',
    amount: 2.3,
    currentPrice: 1600,
    priceChange24h: -1.23,
    totalValue: 3680,
  },
  {
    id: 'cardano',
    name: 'Cardano',
    symbol: 'ADA',
    image: 'https://cryptologos.cc/logos/cardano-ada-logo.png',
    amount: 1000,
    currentPrice: 0.25,
    priceChange24h: 0.78,
    totalValue: 250,
  },
];

function PortfolioPage() {
  const [editingId, setEditingId] = React.useState<string | null>(null);
  const [editAmount, setEditAmount] = React.useState<string>('');

  const handleEditClick = (id: string, currentAmount: number) => {
    setEditingId(id);
    setEditAmount(currentAmount.toString());
  };

  const handleSaveEdit = () => {
    // TODO: Dispatch Redux action to update portfolio
    console.log(`Updating ${editingId} with amount: ${editAmount}`);
    setEditingId(null);
    setEditAmount('');
  };

  const handleCancelEdit = () => {
    setEditingId(null);
    setEditAmount('');
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
            value="$16,930.00"
            change={1.85}
            isMainValue
          />
        </Box>
        <Box flex={1}>
          <PortfolioSummary
            title="24h Change"
            value="$312.45"
            change={1.85}
          />
        </Box>
        <Box flex={1}>
          <PortfolioSummary
            title="Best Performer"
            value="BTC (+2.53%)"
            change={2.53}
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
                Portfolio Performance
              </Typography>
              <PortfolioChart />
            </CardContent>
          </Card>
        </Box>
        <Box flex={1}>
          <Card>
            <CardContent>
              <Typography variant="h6" gutterBottom>
                Asset Allocation
              </Typography>
              <Box height={300}>
                {/* TODO: Add pie chart for asset allocation */}
                <Typography color="text.secondary" align="center" sx={{ mt: 10 }}>
                  Asset allocation chart will be added here
                </Typography>
              </Box>
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
                {portfolioHoldings.map((holding) => (
                  <TableRow key={holding.id} hover>
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
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>
    </Box>
  );
}

export default PortfolioPage;