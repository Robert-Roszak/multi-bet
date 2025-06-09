import React from 'react';
import PropTypes from 'prop-types';
import { ListItem, ListItemIcon, ListItemText } from '@mui/material';
import { sportIcons } from '../icons/Icons';

export const SportCard = ({ sport, selectedSportId, setSelectedSportId, setSelectedEventId }) => {
  return (
    <ListItem
      button={true.toString()}
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
        {sportIcons[sport.name] || sportIcons['Football']}
      </ListItemIcon>
      <ListItemText
        primary={sport.name}
        primaryTypographyProps={{
          fontSize: '1.1rem',
          textAlign: 'center',
        }}
      />
    </ListItem>
  );
};

SportCard.propTypes = {
  sport: PropTypes.shape({
    id: PropTypes.oneOfType([PropTypes.string, PropTypes.number]).isRequired,
    name: PropTypes.string.isRequired,
  }).isRequired,
  selectedSportId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedSportId: PropTypes.func.isRequired,
  setSelectedEventId: PropTypes.func.isRequired,
};