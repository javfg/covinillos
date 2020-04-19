import React, { useState } from 'react';

import { ThemeProvider, createMuiTheme, Modal } from '@material-ui/core';

import Charts from './Charts/Charts';
import Lists from './Lists/Lists';

import bluGreen from '../styles/theme';
import TopBar from './AppBar';




export default function Dashboard(props) {
  const { countries, colorMap, dataset, events } = props;

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
      <TopBar />

      <Charts
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
      />

      <Lists
        dataset={dataset}
        events={events}
      />

      <Modal
        open={suggestEventModalOpen}
        onClose={handleCloseSuggestEvent}
      >
          <div>
            <h2 id="simple-modal-title">Text in a modal</h2>
            <p id="simple-modal-description">
              Duis mollis, est non commodo luctus, nisi erat porttitor ligula.
            </p>
          </div>
      </Modal>
    </ThemeProvider>
  );
}
