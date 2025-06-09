import React from 'react';
import PropTypes from 'prop-types';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';

const EventsList = ({ events, selectedEventId, setSelectedEventId }) => {
  return (
    <Box sx={{ mt: 4, width: '100%', maxWidth: 600 }}>
      <Typography variant="h5" gutterBottom>
        Events
      </Typography>
      <List>
        {events.map(event => (
          <ListItem
            button={true.toString()}
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
  );
};

EventsList.propTypes = {
  events: PropTypes.array.isRequired,
  selectedEventId: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  setSelectedEventId: PropTypes.func.isRequired,
};

export default EventsList;