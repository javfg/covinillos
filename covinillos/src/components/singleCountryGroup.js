import React, { useState, useEffect } from 'react';

import { Grid } from '@material-ui/core';

import CountrySelector from './countrySelector';
import ChartWrapper from './chartWrapper';
import BarChart from './barChart';

import { getMaxY } from '../utils/utils';

import { Config } from '../config';


export default function SingleCountryGroup(props) {
  const { countries, colorMap, dataset, show } = props;

  const [selection, setSelection] = useState(props.selection);
  const [maxY, setMaxY] = useState(0);

  const handleChangeSelection = (index, value) => {
    if (!value) value = Config.singleCountriesSelection[i];
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
    <Grid item xs={12} container spacing={3}>
      {selection.map((c, i) => {
        const key = `singlecountry-${c}-${i}`;

        return (
          <Grid item container xs={12} xl={6} justify="flex-end" key={key}>
            <Grid item xs={2}>
              <CountrySelector
                name={`singlecountrychart-${i}`}
                countries={countries}
                colorMap={colorMap}
                handleChangeCountry={(_, v) => handleChangeSelection(i, v)}
                selection={c}
                selectorType="dropdown"
              />
            </Grid>
            <Grid item xs={12}>
              <ChartWrapper>
                <BarChart
                  dataset={prepareData(dataset[c])}
                  country={c}
                  color={colorMap[c]}
                  maxY={maxY}
                  />
                </ChartWrapper>
            </Grid>
          </Grid>
        );
      })}
    </Grid>
  );
}
