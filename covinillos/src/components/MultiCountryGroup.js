import React, { useState } from 'react';

import { Grid, Switch, makeStyles, Paper } from '@material-ui/core';

import CountrySelector from './CountrySelector';
import ChartWrapper from './ChartWrapper';
import MultiLineChart from './MultiLineChart';

import { getMaxY, translate } from '../utils/utils';
import {
  prepareMultiCountry,
  prepareMultiCountry100
} from '../utils/dataPreparation';

import config from '../config';


const useStyles = makeStyles(theme => ({
  root: { ...theme.typography.button },
  paper: { width: '100%', height: '100%', padding: '.5rem', margin: '.5rem' },
}));


export default function MultiCountryGroup(props) {
  const { countries, colorMap, dataset, show } = props;

  const [selection, setSelection] = useState(props.selection);
  const [startAt100, setStartAt100] = useState(false);

  const handleChangeSelection = (_, selection) => {
    if (!selection.length) selection = config.defaultMultiCountriesSelection;
    if (selection.length > 10) return;
    setSelection(selection);
  };
  const handleChangeStartAt100Selector = e => {
    setStartAt100(e.target.checked)
  };


  const pDataset = startAt100 ?
    prepareMultiCountry100(dataset, colorMap, selection, show)
  :
    prepareMultiCountry(dataset, colorMap, selection, show);

  const classes = useStyles();


  return (
    <Paper className={classes.paper}>
      <Grid item xs={12} container spacing={3}>
        <Grid item xs={12}>
          <ChartWrapper>
            <MultiLineChart
              type={startAt100 ? 'startAt100' : 'normal'}
              countries={selection}
              dataset={pDataset}
              maxY={getMaxY(dataset, selection, show)}
              name="multicountrychart"
              show={show}
            />
          </ChartWrapper>
        </Grid>

        <Grid item xs={6}>
          <Grid container justify="center" alignItems="center">
            <Switch
              name="startAt100Selector"
              checked={startAt100}
              onChange={handleChangeStartAt100Selector}
            />
            <Grid item className={classes.root}>
              Start at 100 {translate(show)}
            </Grid>
          </Grid>
        </Grid>

        <Grid item xs={6}>
          <CountrySelector
            name="singlecountrychart"
            countries={countries}
            colorMap={colorMap}
            handleChangeCountry={handleChangeSelection}
            selection={selection}
            selectorType="checkbox"
          />
        </Grid>
      </Grid>
    </Paper>
  );
}
