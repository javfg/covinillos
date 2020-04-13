import React, { useState } from 'react';

import {
  Grid,
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';

import MailIcon from '@material-ui/icons/Mail';

import DataSelector from './DataSelector';
import SingleCountryGroup from './SingleCountryGroup';
import MultiCountryGroup from './MultiCountryGroup';

import { Config } from '../config';


const useStyles = makeStyles((theme) => ({
  title: { flexGrow: 1 },
}));


export default function Dashboard(props) {
  const { countries, colorMap, dataset } = props;

  const [showData, setShowData] = useState(Config.defaultShowData);
  const [showType, setShowType] = useState(Config.defaultShowType);

  const handleChangeShowData = e => { setShowData(e.target.value); };
  const handleChangeShowType = e => {
    setShowType(e.target.checked ? 'total' : 'daily');
  };
  const handleClickSuggestEvent = () => {
    console.log('suggest event');
  };

  const classes = useStyles();


  return (
    <>
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
          <Card>
            <CardHeader title="Data" />
            <CardContent>
              <DataSelector
                name="singlecountrychart-data"
                items={['confirmed', 'deaths', 'recovered']}
                handleChange={handleChangeShowData}
                selection={showData}
              />
            </CardContent>
          </Card>
        </Grid>
        <Grid item xs={6}>
          <Card>
            <CardHeader title="Type" />
            <CardContent>
              <DataSelector
                name="singlecountrychart-type"
                items={['daily', 'total']}
                handleChange={handleChangeShowType}
                selection={showType}
              />
            </CardContent>
          </Card>
        </Grid>

        <MultiCountryGroup
          countries={countries}
          colorMap={colorMap}
          dataset={dataset}
          selection={Config.defaultMultiCountriesSelection}
          show={`${showData}_${showType}`}
        />

        <SingleCountryGroup
          countries={countries}
          colorMap={colorMap}
          dataset={dataset}
          selection={Config.defaultSingleCountrySelection}
          show={`${showData}_${showType}`}
        />

        <div className="ass"></div>
      </Grid>
    </>
  );
}
