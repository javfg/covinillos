import React, { useState, useEffect } from 'react';
import { ThemeProvider, createMuiTheme, Popover, Button, Box, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

import Charts from './Charts/Charts';
import Lists from './Lists/Lists';
import SuggestEventModal from './SuggestEventModal';
import TopBar from './TopBar';
import config from '../config';
import bluGreen from '../styles/theme';


export default function Dashboard({ countries, colorMap, dataset, events }) {
  const [suggestEventModalOpen, setSuggestEventModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  const handleClickSuggestEvent = () => {
    setSuggestEventModalOpen(true);
  };
  const handleCloseSuggestEvent = () => {
    setSuggestEventModalOpen(false);
  };
  const handleClosePopover = () => {
    setPopoverOpen(false);
  };

  const handleSendEventSuggestion = (country, date, description, reference) => {
    setSuggestEventModalOpen(false);
    setPopoverOpen(true);

    // TODO: SEND HERE
    console.log(country, date, description, reference);
  };


  useEffect(() => {
    const popoverTimeout = setTimeout(() => { setPopoverOpen(false); }, config.popoverTimeout);
    return () => clearTimeout(popoverTimeout);
  }, [popoverOpen]);


  const theme = createMuiTheme(bluGreen);


  return (
    <ThemeProvider theme={theme}>
      <TopBar
        handleClickSuggestEvent={handleClickSuggestEvent}
      />

      <Charts
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
      />

      <Lists
        dataset={dataset}
        events={events}
      />

      <SuggestEventModal
        countries={countries}
        colorMap={colorMap}
        handleSendEventSuggestion={handleSendEventSuggestion}
        onClose={handleCloseSuggestEvent}
        open={suggestEventModalOpen}
      />

      <Popover
        anchorPosition={{ top: 20, left: window.innerWidth - 35 }}
        anchorReference="anchorPosition"
        disableScrollLock
        onClose={handleClosePopover}
        open={popoverOpen}
        transformOrigin={{ vertical: 'top', horizontal: 'right' }}
      >
        <Box style={{ flexDirection: 'row', display: 'flex', width: 'auto', padding: '1rem' }}>
          <DoneIcon color="secondary" />
          <Typography>Event suggestion sent!</Typography>
        </Box>
      </Popover>
    </ThemeProvider>
  );
}
