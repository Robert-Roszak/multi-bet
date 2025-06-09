import React, { useEffect, useState, useRef } from 'react';
import { Container, Box, Typography, Snackbar, AppBar, Toolbar } from '@mui/material';
import './App.css';
import { v4 as uuidv4 } from 'uuid';
import SportsList from './components/SportsList';
import EventsList from './components/EventsList';
import MarketsList from './components/MarketsList';
import BetControls from './components/BetControls';
import BetsDialog from './components/BetsDialog';

function App() {
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);
  const [acceptTerms, setAcceptTerms] = useState(false);
  const [error, setError] = useState('');
  const [userBets, setUserBets] = useState([]);
  const [pendingBets, setPendingBets] = useState([]);
  const [submitError, setSubmitError] = useState('');
  const [pendingSuccessOpen, setPendingSuccessOpen] = useState(false);
  const [submitSuccessOpen, setSubmitSuccessOpen] = useState(false);
  const [validationError, setValidationError] = useState('');
  const userId = 1;

  const marketsListRef = useRef();

  useEffect(() => {
    fetch('http://localhost:3001/sports')
      .then((res) => res.json())
      .then(setSports);

    fetch('http://localhost:3001/events')
      .then((res) => res.json())
      .then(setEvents);

    fetchUserBets();
  }, []);

  const fetchUserBets = () => {
    fetch(`http://localhost:3001/bets?userId=${userId}`)
      .then(res => res.ok ? res.json() : [])
      .then(bets => setUserBets(bets));
  };

  const handlePrepareBets = () => {
    setError('');
    setValidationError('');
    if (!acceptTerms) {
      setValidationError('You must accept Terms & Conditions.');
      return;
    }

    const betEntries = marketsListRef.current?.getSelectedBets() || [];

    if (betEntries.length === 0) {
      setValidationError('Please select at least one game and configure your bet.');
      return;
    }

    let hasError = false;
    let errorMsg = '';

    const betsToStore = betEntries
      .map(config => {
        const event = events.find(e => e.id === config.eventId);
        const market = event?.markets.find(m => Number(m.id) === Number(config.marketId));
        const odds = market?.betTypes.find(bt => bt.type === config.betType)?.odds;
        const stakeNum = Number(config.stake);
        
        if (!event || !market || !config.betType || !config.stake) {
          hasError = true;
          errorMsg = 'Each selected game must have a bet type and stake.';
          return null;
        }
        if (isNaN(stakeNum) || stakeNum < 1 || stakeNum > 1000) {
          hasError = true;
          errorMsg = 'All stakes must be numbers between 1 and 1000.';
          return null;
        }
        if (!odds) {
          hasError = true;
          errorMsg = 'Invalid bet type selected.';
          return null;
        }
        return {
          id: uuidv4(),
          userId: 1,
          eventId: config.eventId,
          marketId: config.marketId,
          betType: config.betType,
          odds,
          stake: stakeNum,
          eventName: event.name,
          marketName: market.name,
          betTime: new Date().toISOString(),
          potentialPayout: Number((odds * stakeNum).toFixed(2)),
          status: "open"
        };
      })
      .filter(Boolean);

    if (hasError) {
      setValidationError(errorMsg);
      return;
    }

    setPendingBets(prev => [...prev, ...betsToStore]);
    setSelectedEventId(null);
    setAcceptTerms(false);
    setPendingSuccessOpen(true);
  };

  const handleSubmitPendingBets = async () => {
    if (!pendingBets.length) return;
    try {
      const responses = await Promise.all(
        pendingBets.map(bet =>
          fetch('http://localhost:3001/bets', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(bet)
          }).then(res => res.json())
        )
      );
      const betIds = responses.map(bet => bet.id);

      const userRes = await fetch('http://localhost:3001/users/1');
      const user = await userRes.json();
      const currentBets = Array.isArray(user.bets) ? user.bets : [];

      await fetch(`http://localhost:3001/users/1`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          bets: [...currentBets, ...betIds]
        })
      });
      setPendingBets([]);
      fetchUserBets();
      setSubmitSuccessOpen(true);
    } catch (err) {
      setSubmitError('Failed to submit bets.');
    }
  };

  const handleClearAllPendingBets = () => {
    setPendingBets([]);
  };

  return (
    <Container
      maxWidth={false}
      disableGutters
      sx={{
        width: '100vw',
        minWidth: 0,
        overflowX: 'hidden',
        p: 0,
        m: 0,
        boxSizing: 'border-box',
      }}
    >
      <Box
        display="flex"
        flexDirection="row"
        minHeight="100vh"
        width="100vw"
        sx={{
          overflowX: 'hidden',
          p: 0,
          m: 0,
          boxSizing: 'border-box',
        }}
      >
        {/* Main content */}
        <Box
          flex={1}
          minWidth={0}
          display="flex"
          flexDirection="column"
          alignItems="center"
          justifyContent="flex-start"
          sx={{
            overflowX: 'hidden',
            p: 0,
            m: 0,
            boxSizing: 'border-box',
          }}
        >
          <AppBar position="static" color="default" elevation={0}>
            <Toolbar sx={{ justifyContent: 'flex-end', p: 0, m: 0 }} />
          </AppBar>
          <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 2 }}>
            Multi-bet Sports Betting
          </Typography>
          <SportsList
            sports={sports}
            selectedSportId={selectedSportId}
            setSelectedSportId={setSelectedSportId}
            setSelectedEventId={setSelectedEventId}
          />
          {selectedSportId && (
            <EventsList
              events={events.filter(event => event.sportId === Number(selectedSportId))}
              selectedEventId={selectedEventId}
              setSelectedEventId={setSelectedEventId}
            />
          )}
          {selectedEventId && (
            <MarketsList
              ref={marketsListRef}
              event={events.find(event => event.id === selectedEventId)}
            />
          )}
          {/* Global Controls */}
          {selectedEventId && (
            <BetControls
              acceptTerms={acceptTerms}
              setAcceptTerms={setAcceptTerms}
              onSubmit={handlePrepareBets}
              error={error}
            />
          )}
        </Box>
        {/* Bets sidebar */}
        <BetsDialog
          userBets={userBets}
          pendingBets={pendingBets}
          onClearAllPendingBets={handleClearAllPendingBets}
          onSubmitPendingBets={handleSubmitPendingBets}
        />
      </Box>
      <Snackbar
        open={pendingSuccessOpen}
        autoHideDuration={3000}
        onClose={() => setPendingSuccessOpen(false)}
        message="Bets added to pending list successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={submitSuccessOpen}
        autoHideDuration={3000}
        onClose={() => setSubmitSuccessOpen(false)}
        message="Bets submitted successfully!"
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={!!submitError}
        autoHideDuration={4000}
        onClose={() => setSubmitError('')}
        message={submitError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
      <Snackbar
        open={!!validationError}
        autoHideDuration={4000}
        onClose={() => setValidationError('')}
        message={validationError}
        anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }}
      />
    </Container>
  );
}

export default App;
