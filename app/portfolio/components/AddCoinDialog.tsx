import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Box,
  CircularProgress,
  Alert,
  Autocomplete,
} from '@mui/material';
import { useAppDispatch, useAppSelector } from '@/store/hooks';
import {
  fetchCoinsForSearch,
  setSearchTerm,
  clearSearchResults,
  clearError,
  selectSearchResults,
  selectSearchLoading,
  selectSearchError,
  selectSearchTerm,
} from '@/store/slices/coinSearchSlice';
import { AddCoinDialogProps } from '@/constants/interface';
import { CoinSearchItem } from '@/constants/interface';

function AddCoinDialog({ open, onClose, onAddCoin }: AddCoinDialogProps) {
  const dispatch = useAppDispatch();
  const coins = useAppSelector(selectSearchResults);
  const loading = useAppSelector(selectSearchLoading);
  const error = useAppSelector(selectSearchError);
  const currentSearchTerm = useAppSelector(selectSearchTerm);

  const [selectedCoin, setSelectedCoin] = useState<CoinSearchItem | null>(null);
  const [amount, setAmount] = useState('');
  const [localError, setLocalError] = useState('');

  useEffect(() => {
    if (open) {
      dispatch(fetchCoinsForSearch({ limit: 50 }));
      setSelectedCoin(null);
      setAmount('');
      dispatch(setSearchTerm(''));
      setLocalError('');
      dispatch(clearError());
    }
  }, [open, dispatch]);

  const handleSearchChange = (value: string) => {
    dispatch(setSearchTerm(value));
  };

  const handleAdd = () => {
    if (!selectedCoin) {
      setLocalError('Please select a coin');
      return;
    }

    const amountValue = parseFloat(amount);
    if (isNaN(amountValue) || amountValue <= 0) {
      setLocalError('Please enter a valid amount');
      return;
    }

    onAddCoin(selectedCoin.id, amountValue);
    handleClose();
  };

  const handleClose = () => {
    setSelectedCoin(null);
    setAmount('');
    setLocalError('');
    dispatch(setSearchTerm(''));
    dispatch(clearSearchResults());
    onClose();
  };

  const displayError = error || localError;

  return (
    <Dialog open={open} onClose={handleClose} maxWidth="sm" fullWidth>
      <DialogTitle>Add Coin to Portfolio</DialogTitle>
      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2} sx={{ mt: 1 }}>
          {displayError && (
            <Alert severity="error" onClose={() => {
              setLocalError('');
              dispatch(clearError());
            }}>
              {displayError}
            </Alert>
          )}

          <Autocomplete
            options={coins}
            value={selectedCoin}
            onChange={(_, value) => setSelectedCoin(value)}
            inputValue={currentSearchTerm}
            onInputChange={(_, value) => handleSearchChange(value)}
            getOptionLabel={(option) => `${option.name} (${option.symbol.toUpperCase()})`}
            loading={loading}
            renderInput={(params) => (
              <TextField
                {...params}
                label="Search and select coin"
                placeholder="Type to search coins..."
                InputProps={{
                  ...params.InputProps,
                  endAdornment: (
                    <>
                      {loading ? <CircularProgress color="inherit" size={20} /> : null}
                      {params.InputProps.endAdornment}
                    </>
                  ),
                }}
              />
            )}
            noOptionsText={loading ? "Searching..." : "No coins found"}
            filterOptions={(x) => x}
          />

          {/* Amount Input */}
          <TextField
            label="Amount"
            type="number"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            placeholder="Enter amount you own"
            inputProps={{
              min: 0,
              step: 'any',
            }}
            helperText="Enter the amount of this coin you own"
            fullWidth
          />
        </Box>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Cancel</Button>
        <Button
          onClick={handleAdd}
          variant="contained"
          disabled={!selectedCoin || !amount || loading}
        >
          Add to Portfolio
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddCoinDialog;