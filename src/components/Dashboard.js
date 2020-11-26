import React, { useState, useEffect } from 'react';
import { ThemeProvider, createMuiTheme, Popover, Box, Typography } from '@material-ui/core';
import DoneIcon from '@material-ui/icons/Done';
import { schemeTableau10 as st } from 'd3';

import CookieConsent from './CookieConsent';
import TopBar from './TopBar';
import Charts from './Charts/Charts';
import Lists from './Lists/Lists';
import SuggestEventModal from './SuggestEventModal';
import Footer from './Footer';
import config from '../config';
import bluGreen from '../styles/theme';
import { encode } from '../utils/utils';
import { prepareCountries, prepareDataset } from '../utils/dataPreparation';

export default function Dashboard() {
  const [dataset, setDataset] = useState();
  const [events, setEvents] = useState();
  const [countries, setCountries] = useState();
  const [colorMap, setColorMap] = useState();
  const [lastUpdate, setLastUpdate] = useState();

  const [suggestEventModalOpen, setSuggestEventModalOpen] = useState(false);
  const [popoverOpen, setPopoverOpen] = useState(false);

  useEffect(() => {
    async function fetchData() {
      const datasetRes = await fetch(`${config.dataUrl}/dataset-test.json`);
      const datasetRaw = await datasetRes.json();

      const eventsRes = await fetch(`${config.dataUrl}/events.json`);
      const eventsRaw = await eventsRes.json();

      const preparedDataset = prepareDataset(datasetRaw);
      const newCountries = prepareCountries(preparedDataset);
      const newColorMap = newCountries.reduce((acc, c, i) => ({ ...acc, [c]: st[i % st.length] }), {});
      const newLastUpdate = preparedDataset[newCountries[0]][preparedDataset[newCountries[0]].length - 1].date;

      setEvents(events => eventsRaw);
      setCountries(countries => newCountries);
      setColorMap(colorMap => newColorMap);
      setLastUpdate(lastUpdate => newLastUpdate);
      setDataset(dataset => preparedDataset);
    }

    fetchData();
  }, []);

  useEffect(() => {
    const popoverTimeout = setTimeout(() => {
      setPopoverOpen(false);
    }, config.popoverTimeout);

    return () => clearTimeout(popoverTimeout);
  }, [popoverOpen]);

  const theme = createMuiTheme(bluGreen);

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

  if (!dataset) return <>Loading</>;

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
