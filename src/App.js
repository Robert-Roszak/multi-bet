import React, { useEffect, useState } from 'react';
import SportsSoccerIcon from '@mui/icons-material/SportsSoccer';
import SportsBasketballIcon from '@mui/icons-material/SportsBasketball';
import SportsTennisIcon from '@mui/icons-material/SportsTennis';
import SportsBaseballIcon from '@mui/icons-material/SportsBaseball';
import SportsCricketIcon from '@mui/icons-material/SportsCricket';
import SportsHockeyIcon from '@mui/icons-material/SportsHockey';
import SportsRugbyIcon from '@mui/icons-material/SportsRugby';
import SportsGolfIcon from '@mui/icons-material/SportsGolf';
import SportsMmaIcon from '@mui/icons-material/SportsMma';
import SportsMotorsportsIcon from '@mui/icons-material/SportsMotorsports';
import { Container, Box, Typography, List, ListItem, ListItemIcon, ListItemText, Paper } from '@mui/material';
import './App.css';

const sportIcons = {
  Football: <SportsSoccerIcon fontSize="large" />,
  Basketball: <SportsBasketballIcon fontSize="large" />,
  Tennis: <SportsTennisIcon fontSize="large" />,
  Baseball: <SportsBaseballIcon fontSize="large" />,
  Cricket: <SportsCricketIcon fontSize="large" />,
  Hockey: <SportsHockeyIcon fontSize="large" />,
  Rugby: <SportsRugbyIcon fontSize="large" />,
  Golf: <SportsGolfIcon fontSize="large" />,
  Boxing: <SportsMmaIcon fontSize="large" />,
  "Formula 1": <SportsMotorsportsIcon fontSize="large" />
};

function App() {
  const [sports, setSports] = useState([]);
  const [events, setEvents] = useState([]);
  const [markets, setMarkets] = useState([]);
  const [selections, setSelections] = useState([]);
  const [selectedSportId, setSelectedSportId] = useState(null);
  const [selectedEventId, setSelectedEventId] = useState(null);

  useEffect(() => {
    fetch('http://localhost:3001/sports').then(res => res.json()).then(setSports);
    fetch('http://localhost:3001/events').then(res => res.json()).then(setEvents);
    fetch('http://localhost:3001/markets').then(res => res.json()).then(setMarkets);
    fetch('http://localhost:3001/selections').then(res => res.json()).then(setSelections);
  }, []);

  return (
    <Container maxWidth={false} disableGutters sx={{ pt: 4 }}>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="flex-start"
        minHeight="100vh"
      >
        <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 2 }}>
          Sports List
        </Typography>
        <Paper elevation={3} sx={{ width: '100vw', mt: 2, borderRadius: 0 }}>
          <List
            sx={{
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
              justifyContent: 'center',
              p: 2,
              m: 0,
              width: '100%',
            }}
          >
            {sports.map(sport => (
              <ListItem
                button
                key={sport.id}
                selected={selectedSportId === sport.id}
                onClick={() => {
                  setSelectedSportId(sport.id);
                  setSelectedEventId(null);
                }}
                sx={{
                  flexDirection: 'column',
                  alignItems: 'center',
                  width: 'auto',
                  minWidth: 100,
                  mx: 2,
                  p: 0,
                }}
                disableGutters
              >
                <ListItemIcon sx={{ minWidth: 0, mb: 1, justifyContent: 'center' }}>
                  {sportIcons[sport.name] || <SportsSoccerIcon fontSize="large" />}
                </ListItemIcon>
                <ListItemText
                  primary={sport.name}
                  primaryTypographyProps={{
                    fontSize: '1.1rem',
                    textAlign: 'center',
                  }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>

        {/* Events List */}
        {selectedSportId && (
          <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
              Events
            </Typography>
            <List>
              {events
                .filter(e => e.sportId === selectedSportId)
                .map(event => (
                  <ListItem
                    button
                    key={event.id}
                    selected={selectedEventId === event.id}
                    onClick={() => setSelectedEventId(event.id)}
                  >
                    <ListItemText
                      primary={event.name}
                      secondary={event.startTime ? new Date(event.startTime).toLocaleString() : ''}
                    />
                  </ListItem>
                ))}
            </List>
          </Box>
        )}

        {/* Markets and Selections */}
        {selectedEventId && (
          <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
            <Typography variant="h5" gutterBottom>
              Markets
            </Typography>
            {markets
              .filter(market => market.eventId === selectedEventId)
              .map(market => (
                <Paper key={market.id} sx={{ mb: 2, p: 2 }}>
                  <Typography variant="subtitle1">{market.name}</Typography>
                  <List>
                    {market.selections.map(selId => {
                      const sel = selections.find(s => s.id === selId);
                      return (
                        <ListItem key={selId}>
                          <ListItemText
                            primary={sel?.name}
                            secondary={sel ? `Odds: ${sel.odds}` : ''}
                          />
                        </ListItem>
                      );
                    })}
                  </List>
                </Paper>
              ))}
          </Box>
        )}
      </Box>
    </Container>
  );
}

export default App;
