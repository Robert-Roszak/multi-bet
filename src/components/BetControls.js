import { Box, FormControlLabel, Checkbox, Button, Alert } from '@mui/material';
import PropTypes from 'prop-types';

function BetControls({ acceptTerms, setAcceptTerms, onSubmit, error }) {
  return (
    <Box>
      <FormControlLabel
        control={
          <Checkbox
            checked={acceptTerms}
            onChange={(e) => setAcceptTerms(e.target.checked)}
          />
        }
        label='Accept Terms & Conditions'
      />
      <Button variant='contained' onClick={onSubmit} disabled={!acceptTerms}>
        Add bets
      </Button>
      {error && (
        <Alert severity='error' sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}
    </Box>
  );
}

BetControls.propTypes = {
  acceptTerms: PropTypes.bool.isRequired,
  setAcceptTerms: PropTypes.func.isRequired,
  onSubmit: PropTypes.func.isRequired,
  error: PropTypes.string
};

export default BetControls;
