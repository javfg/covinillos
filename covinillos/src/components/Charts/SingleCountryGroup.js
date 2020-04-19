import React, { useState, useEffect } from 'react';

import { Grid, Paper, makeStyles } from '@material-ui/core';

import CountrySelector from './CountrySelector';
import ChartWrapper from './ChartWrapper';
import BarChart from './BarChart';

import { getMaxY } from '../../utils/utils';

import config from '../../config';


const useStyles = makeStyles({
  sepadding: { padding: '0 3px 3px 0' },
});


export default function SingleCountryGroup(props) {
  const { countries, colorMap, dataset, show } = props;

  const [selection, setSelection] = useState(props.selection);
  const [maxY, setMaxY] = useState(0);

  const classes = useStyles();

  const handleChangeSelection = (index, value) => {
    if (!value) value = config.singleCountriesSelection[i];
    setSelection(selection.map((c, i) => i !== index ? c : value));
  };

  useEffect(() => {
    setMaxY(getMaxY(dataset, selection, show));
  }, [selection, show]);


  const prepareData = dataset => dataset.map(d => ({
    date: new Date(d.date),
    value: d[show],
  }));


  return (
    selection.map((c, i) => {
      const key = `singlecountry-${c}-${i}`;

      return (
      <Grid item xs={12} xl={6} key={key}>
        <Paper>
          <Grid container justify="flex-end">
            <Grid item xs={12}>
              <ChartWrapper>
                <BarChart
                  name={c}
                  dataset={prepareData(dataset[c])}
                  country={c}
                  color={colorMap[c]}
                  maxY={maxY}
                  show={show}
                />
              </ChartWrapper>
            </Grid>
            <Grid item xs={2} className={classes.sepadding}>
              <CountrySelector
                name={key}
                countries={countries}
                colorMap={colorMap}
                handleChangeCountry={(_, v) => handleChangeSelection(i, v)}
                selection={c}
                selectorType="dropdown"
              />
            </Grid>
          </Grid>
        </Paper>
      </Grid>
      );
    })
  );
}
