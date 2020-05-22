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

  const handleChangeSelection = (event, value) => {
    const selectionIndex = parseInt(event.target.id.split('-')[0]);

    if (!value) value = config.singleCountriesSelection[selectionIndex];
    setSelection(selection.map((c, i) => i !== selectionIndex ? c : value));
  };

  useEffect(() => {
    setMaxY(getMaxY(dataset, selection, show));
  }, [selection, show]);


  const prepareData = dataset => dataset.map(d => ({
    date: new Date(d.date),
    value: d[show],
  }));

  return selection.map((c, i) =>
    <Grid item xs={12} xl={6} key={i}>
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
          <Grid item xs={6} sm={4} md={3} xl={4} className={classes.sepadding}>
            <CountrySelector
              id={`countryselector-${i}`}
              name={i}
              countries={countries}
              colorMap={colorMap}
              handleChangeCountry={handleChangeSelection}
              selection={c}
              selectorType="dropdown"
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
