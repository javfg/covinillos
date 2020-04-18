import React, { useState } from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  ThemeProvider,
  createMuiTheme,
  Modal,
} from '@material-ui/core';

import MailIcon from '@material-ui/icons/Mail';

import Charts from './Charts/Charts';
import ReferenceList from './Lists/ReferenceList';
import DataList from './Lists/DataList';

import bluGreen from '../styles/theme';

import { prepareDataList } from '../utils/dataPreparation';
import Lists from './Lists/Lists';


const useStyles = makeStyles({
  title: { flexGrow: 1 },
});


export default function Dashboard(props) {
  const { countries, colorMap, dataset, events } = props;

  const [suggestEventModalOpen, setSuggestEventModalOpen] = useState(false);

  const handleClickSuggestEvent = () => {
    setSuggestEventModalOpen(true);
  };
  const handleCloseSuggestEvent = () => {
    console.log('event suggested');
    setSuggestEventModalOpen(false);
  };

  const classes = useStyles();
  const theme = createMuiTheme(bluGreen);


  return (
    <ThemeProvider theme={theme}>
      <AppBar position="sticky">
        <Toolbar>
          <Typography variant="h6" className={classes.title}>
            COVID-19 Pandemic stats
          </Typography>
          <Button
            color="inherit"
            onClick={handleClickSuggestEvent}
            className={classes.button}
            startIcon={<MailIcon />}
          >
            Suggest an event
          </Button>
        </Toolbar>
      </AppBar>

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
