import React from 'react';
import { List, Paper } from '@mui/material';
import { SportCard } from './SportCard';

const SportsList = ({ sports, selectedSportId, setSelectedSportId, setSelectedEventId }) => {
  return (
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
          <SportCard
            key={sport.id}
            sport={sport}
            selectedSportId={selectedSportId}
            setSelectedSportId={setSelectedSportId}
            setSelectedEventId={setSelectedEventId}
          />
        ))}
      </List>
    </Paper>
  );
};

export default SportsList;