import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, Paper, Button } from '@mui/material';

function BetsDialog({ userBets, pendingBets = [], onClearAllPendingBets, onSubmitPendingBets }) {
  const totalPayout = userBets.reduce(
    (sum, bet) => sum + (Number(bet.potentialPayout) || 0),
    0
  );
  const pendingTotal = pendingBets.reduce(
    (sum, bet) => sum + (Number(bet.potentialPayout) || 0),
    0
  );

  return (
    <Box
      width={380}
      minWidth={320}
      maxWidth={420}
      bgcolor="#f5f5f5"
      borderLeft="1px solid #ddd"
      p={3}
      display="flex"
      flexDirection="column"
      sx={{ boxShadow: '-2px 0 8px 0 rgba(0,0,0,0.03)' }}
    >
      <Typography variant="h6" gutterBottom>
        Your Bets
      </Typography>
      {userBets.length === 0 ? (
        <Typography>No bets placed yet.</Typography>
      ) : (
        <React.Fragment>
          <Box flex={1} overflow="auto">
            {userBets.map((bet, idx) => (
              <Paper key={idx} sx={{ mb: 2, p: 2 }}>
                <Typography fontWeight="bold">{bet.eventName} - {bet.marketName}</Typography>
                <Typography variant="body2">
                  Bet: {bet.betType}, Stake: €{bet.stake}, Odds: {bet.odds}
                </Typography>
                <Typography variant="body2">
                  Potential payout: €{bet.potentialPayout}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  {new Date(bet.betTime).toLocaleString()}
                </Typography>
              </Paper>
            ))}
          </Box>
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Total potential payout: €{totalPayout.toFixed(2)}
          </Typography>
        </React.Fragment>
      )}

      {/* Pending Bets Section */}
      {pendingBets.length > 0 && (
        <Box mt={4}>
          <Typography variant="h6" gutterBottom>
            Pending Bets
          </Typography>
          {pendingBets.map((bet, idx) => (
            <Paper key={idx} sx={{ mb: 2, p: 2, bgcolor: '#fffde7' }}>
              <Typography fontWeight="bold">{bet.eventName} - {bet.marketName}</Typography>
              <Typography variant="body2">
                Bet: {bet.betType}, Stake: €{bet.stake}, Odds: {bet.odds}
              </Typography>
              <Typography variant="body2">
                Potential payout: €{bet.potentialPayout}
              </Typography>
              <Typography variant="caption" color="text.secondary">
                {new Date(bet.betTime).toLocaleString()}
              </Typography>
            </Paper>
          ))}
          <Typography variant="subtitle1" sx={{ mt: 2 }}>
            Pending payout: €{pendingTotal.toFixed(2)}
          </Typography>
          <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
            <Button
              color="error"
              variant="contained"
              onClick={onClearAllPendingBets}
              disabled={pendingBets.length === 0}
              aria-label="Clear all pending bets"
            >
              Clear All
            </Button>
            <Button
              color="primary"
              variant="contained"
              onClick={onSubmitPendingBets}
              disabled={pendingBets.length === 0}
              aria-label="Submit all pending bets"
            >
              Place bets
            </Button>
          </Box>
        </Box>
      )}
    </Box>
  );
}

BetsDialog.propTypes = {
  userBets: PropTypes.array.isRequired,
  pendingBets: PropTypes.array,
  onClearAllPendingBets: PropTypes.func.isRequired,
  onSubmitPendingBets: PropTypes.func.isRequired,
};

export default BetsDialog;