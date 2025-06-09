import React, { useState, forwardRef, useImperativeHandle } from 'react';
import { Box, Typography, Paper, TextField } from '@mui/material';

const MarketsList = forwardRef(({ event }, ref) => {
  const [marketConfigs, setMarketConfigs] = useState({});

  useImperativeHandle(ref, () => ({
    getSelectedBets: () => {
      return Object.entries(marketConfigs)
        .filter(([_, config]) => config.betType && config.stake)
        .map(([marketId, config]) => ({
          eventId: event.id,
          marketId,
          ...config,
        }));
    }
  }));

  if (!event) return null;

  const handleBetTypeChange = (marketId, betType) => {
    setMarketConfigs(prev => ({
      ...prev,
      [marketId]: { ...prev[marketId], betType }
    }));
  };

  const handleStakeChange = (marketId, stake) => {
    setMarketConfigs(prev => ({
      ...prev,
      [marketId]: { ...prev[marketId], stake }
    }));
  };

  return (
    <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Markets
      </Typography>
      {event.markets && event.markets.length > 0 ? (
        event.markets.map(market => (
          <Paper key={market.id} sx={{ mb: 2, p: 2 }}>
            <Typography variant="subtitle1">{market.name}</Typography>
            <ul>
              {market.betTypes.map(betType => (
                <li
                  key={betType.type}
                  style={{
                    cursor: 'pointer',
                    color: marketConfigs[market.id]?.betType === betType.type ? '#1976d2' : '#333',
                    textDecoration: marketConfigs[market.id]?.betType === betType.type ? 'underline' : 'none',
                    fontWeight: marketConfigs[market.id]?.betType === betType.type ? 'bold' : 'normal'
                  }}
                  onClick={() => handleBetTypeChange(market.id, betType.type)}
                >
                  {betType.type} (Odds: {betType.odds})
                </li>
              ))}
            </ul>
            <TextField
              label="Stake (€1 - €1000)"
              type="number"
              size="small"
              value={marketConfigs[market.id]?.stake || ''}
              onChange={e => handleStakeChange(market.id, e.target.value)}
              inputProps={{ min: 1, max: 1000 }}
              sx={{ mt: 1, width: 180 }}
            />
          </Paper>
        ))
      ) : (
        <Typography variant="body2" color="text.secondary">
          No markets available for this event.
        </Typography>
      )}
    </Box>
  );
});

export default MarketsList;