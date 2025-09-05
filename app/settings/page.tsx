'use client';
import React, { useState } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Switch,
  Divider,
  Button,
} from '@mui/material';

function SettingsPage() {
  const [darkMode, setDarkMode] = useState(false);
  const [currency, setCurrency] = useState('USD');
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [notifications, setNotifications] = useState(true);

  return (
    <Box>
      <Box mb={4}>
        <Typography variant="h4" gutterBottom>
          Settings
        </Typography>
        <Typography variant="body1" color="text.secondary">
          Customize your CryptoTracker Pro experience
        </Typography>
      </Box>

      {/* Appearance Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Appearance
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="body1">Dark Mode</Typography>
              <Typography variant="body2" color="text.secondary">
                Switch to dark theme
              </Typography>
            </Box>
            <Switch
              checked={darkMode}
              onChange={(e) => setDarkMode(e.target.checked)}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Currency Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Currency & Display
          </Typography>

          <FormControl component="fieldset" sx={{ mb: 2 }}>
            <FormLabel component="legend">Base Currency</FormLabel>
            <RadioGroup
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              row
            >
              <FormControlLabel value="USD" control={<Radio />} label="USD ($)" />
              <FormControlLabel value="EUR" control={<Radio />} label="EUR (€)" />
              <FormControlLabel value="BTC" control={<Radio />} label="BTC (₿)" />
            </RadioGroup>
          </FormControl>
        </CardContent>
      </Card>

      {/* Data & Refresh Settings */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Data & Updates
          </Typography>

          <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
            <Box>
              <Typography variant="body1">Auto Refresh</Typography>
              <Typography variant="body2" color="text.secondary">
                Automatically update prices every 30 seconds
              </Typography>
            </Box>
            <Switch
              checked={autoRefresh}
              onChange={(e) => setAutoRefresh(e.target.checked)}
            />
          </Box>

          <Divider sx={{ my: 2 }} />

          <Box display="flex" justifyContent="space-between" alignItems="center">
            <Box>
              <Typography variant="body1">Price Alerts</Typography>
              <Typography variant="body2" color="text.secondary">
                Get notified about significant price changes
              </Typography>
            </Box>
            <Switch
              checked={notifications}
              onChange={(e) => setNotifications(e.target.checked)}
            />
          </Box>
        </CardContent>
      </Card>

      {/* Save Settings */}
      <Box display="flex" gap={2}>
        <Button variant="contained" size="large">
          Save Settings
        </Button>
        <Button variant="outlined" size="large">
          Reset to Default
        </Button>
      </Box>
    </Box>
  );
}

export default SettingsPage;
