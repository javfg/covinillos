import React, { useState } from 'react';

import { Grid } from '@material-ui/core';

import CountrySelector from './countrySelector';
import ChartWrapper from './chartWrapper';
import MultiLineChart from './multiLineChart';

import { getMaxY, setTime } from '../utils/utils';

import { Config } from '../config';


function SingleCountryGroup(props) {
  const { countries, colorMap, dataset, show } = props;

  const [selection, setSelection] = useState(props.selection);

  const handleChangeSelection = (_, selection) => {
    if (!selection) selection = Config.defaultMultiCountriesSelection;
    setSelection(selection);
  };


  const prepareData = () => {
    const formattedData = [];

    selection.forEach(country => {
      const values = [];
      const events = [];
      const color = colorMap[country];

      dataset[country].forEach(day => {
        const date = setTime(day.date, 12);
        const value = day[show];
        const captions = day.events;

        values.push({ date, value });
        if (captions.length) {
          events.push({ country, color, date, captions, value });
        }
      });

      formattedData.push({ country, color, values, events });
    });

    return formattedData;
  }


  return (
    <Grid item xs={12} container spacing={3} justify="flex-end">
      <Grid item xs={12}>
        <ChartWrapper>
          <MultiLineChart
            countries={selection}
            dataset={prepareData()}
            maxY={getMaxY(dataset, selection, show)}
            name="multicountrychart"
            show={show}
          />
        </ChartWrapper>
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
  );
}


export default SingleCountryGroup;
