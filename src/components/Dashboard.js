import React, { useState, useEffect } from 'react';
import { ThemeProvider, createMuiTheme, Popover, Box, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';

import CookieConsent from './CookieConsent';
import TopBar from './TopBar';
import Charts from './Charts/Charts';
import Lists from './Lists/Lists';
import SuggestEventModal from './SuggestEventModal';
import Footer from './Footer';
import config from '../config';
import bluGreen from '../styles/theme';
import { encode } from '../utils/utils';

export default function Dashboard({ countries, colorMap, dataset, events, lastUpdate }) {
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

  const handleSendEventSuggestion = async (country, date, description, reference) => {
    setSuggestEventModalOpen(false);

    await fetch('/', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: encode({
        'form-name': 'suggest-event',
        'suggest-event-country': country,
        'suggest-event-date': date,
        'suggest-event-description': description,
        'suggest-event-reference': reference,
      }),
    });

    setPopoverOpen(true);
  };

  useEffect(() => {
    const popoverTimeout = setTimeout(() => {
      setPopoverOpen(false);
    }, config.popoverTimeout);

    return () => clearTimeout(popoverTimeout);
  }, [popoverOpen]);

  const theme = createMuiTheme(bluGreen);

  return (
    <ThemeProvider theme={theme}>
      <TopBar
        handleClickSuggestEvent={handleClickSuggestEvent}
        lastUpdate={lastUpdate}
      />

      <Charts
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
      />

      <Lists
        dataset={dataset}
        events={events}
        lastUpdate={lastUpdate}
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

      <Footer />
      <CookieConsent />
    </ThemeProvider>
  );
}
