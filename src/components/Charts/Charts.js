import React from 'react';
import { Grid } from '@material-ui/core';

import SingleCountryGroup from './SingleCountryGroup';
import MultiCountryGroup from './MultiCountryGroup';
import useChartSettings from '../../hooks/useChartSettings';
import config from '../../config';


export default function Dashboard({ countries, colorMap, dataset }) {
  const { chartSettings } = useChartSettings();
  const { showData, showType } = chartSettings;

  const searchParams = new URLSearchParams(location.search);
  const multiCountrySelection = searchParams.get('msc') && searchParams.get('msc').split(',') || config.defaultMultiCountriesNormalSelection;
  const singleCountrySelection = searchParams.get('ssc') && searchParams.get('ssc').split(',') || config.defaultSingleCountrySelection;

  return (
    <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
      <MultiCountryGroup
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
        normalSelection={multiCountrySelection}
        altSelection={config.defaultMultiCountriesAltSelection}
        show={`${showData}_${showType}`}
      />

      <SingleCountryGroup
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
        selection={singleCountrySelection}
        show={`${showData}_${showType}`}
      />
    </Grid>
  );
}
