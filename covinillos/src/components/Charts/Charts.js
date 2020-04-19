import React, { useState } from 'react';

import { Grid } from '@material-ui/core';

import DataSelector from './DataSelector';
import SingleCountryGroup from './SingleCountryGroup';
import MultiCountryGroup from './MultiCountryGroup';

import config from '../../config';
import useChartSettings from '../../hooks/useChartSettings';


export default function Dashboard(props) {
  const { countries, colorMap, dataset } = props;
  const { chartSettings } = useChartSettings();
  const { showData, showType } = chartSettings;

  return (
    <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
      <MultiCountryGroup
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
        normalSelection={config.defaultMultiCountriesNormalSelection}
        altSelection={config.defaultMultiCountriesAltSelection}
        show={`${showData}_${showType}`}
      />

      <SingleCountryGroup
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
        selection={config.defaultSingleCountrySelection}
        show={`${showData}_${showType}`}
      />
    </Grid>
  );
}
