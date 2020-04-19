import React, { useState } from 'react';
import { ThemeProvider, createMuiTheme, Modal } from '@material-ui/core';

import Charts from './Charts/Charts';
import Lists from './Lists/Lists';
import SuggestEventModal from './SuggestEventModal';
import TopBar from './TopBar';
import bluGreen from '../styles/theme';




export default function Dashboard({ countries, colorMap, dataset, events }) {
  const [suggestEventModalOpen, setSuggestEventModalOpen] = useState(false);

  const handleClickSuggestEvent = () => {
    setSuggestEventModalOpen(true);
  };
  const handleCloseSuggestEvent = () => {
    setSuggestEventModalOpen(false);
  };


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
        open={suggestEventModalOpen}
        onClose={handleCloseSuggestEvent}
      />
    </ThemeProvider>
  );
}
