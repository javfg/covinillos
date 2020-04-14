import React, { useState } from 'react';

import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  ThemeProvider,
  createMuiTheme,
} from '@material-ui/core';

import MailIcon from '@material-ui/icons/Mail';

import DataSelector from './DataSelector';
import SingleCountryGroup from './SingleCountryGroup';
import MultiCountryGroup from './MultiCountryGroup';
import ReferenceList from './ReferenceList';

import config from '../config';
import bluGreen from '../styles/theme';


const useStyles = makeStyles({
  title: { flexGrow: 1 },
});


export default function Dashboard(props) {
  const { countries, colorMap, dataset } = props;

  const [showData, setShowData] = useState(config.defaultShowData);
  const [showType, setShowType] = useState(config.defaultShowType);

  const handleChangeShowData = e => { setShowData(e.target.value); };
  const handleChangeShowType = e => {
    setShowType(e.target.checked ? 'total' : 'daily');
  };
  const handleClickSuggestEvent = () => {
    console.log('suggest event');
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

      <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
        <Grid item xs={6}>
          <DataSelector
            name="singlecountrychart-data"
            title="Data to show"
            items={['confirmed', 'deaths', 'recovered']}
            handleChange={handleChangeShowData}
            selection={showData}
          />
        </Grid>
        <Grid item xs={6}>
          <DataSelector
            name="singlecountrychart-type"
            title="Aggregate"
            items={['daily', 'total']}
            handleChange={handleChangeShowType}
            selection={showType}
          />
        </Grid>

        <MultiCountryGroup
          countries={countries}
          colorMap={colorMap}
          dataset={dataset}
          selection={config.defaultMultiCountriesSelection}
          show={`${showData}_${showType}`}
        />

        <SingleCountryGroup
          countries={countries}
          colorMap={colorMap}
          dataset={dataset}
          selection={config.defaultSingleCountrySelection}
          show={`${showData}_${showType}`}
        />

        <ReferenceList dataset={dataset} />
      </Grid>
    </ThemeProvider>
  );
}
