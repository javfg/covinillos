import React, { useState } from 'react';

import { Grid, Switch, FormControlLabel } from '@material-ui/core';

import CountrySelector from './CountrySelector';
import ChartWrapper from './ChartWrapper';
import MultiLineChart from './MultiLineChart';

import { getMaxY, translate } from '../utils/utils';
import {
  prepareMultiCountry,
  prepareMultiCountry100
} from '../utils/dataPreparation';

import config from '../config';


export default function MultiCountryGroup(props) {
  const { countries, colorMap, dataset, show } = props;

  const [selection, setSelection] = useState(props.selection);
  const [startAt100, setStartAt100] = useState(false);

  const handleChangeSelection = (_, selection) => {
    if (!selection.length) selection = config.defaultMultiCountriesSelection;
    setSelection(selection);
  };
  const handleChangeStartAt100Selector = e => {
    setStartAt100(e.target.checked)
  };


  const pDataset = startAt100 ?
    prepareMultiCountry100(dataset, colorMap, selection, show)
  :
    prepareMultiCountry(dataset, colorMap, selection, show);


  return (
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
      <FormControlLabel
        control={
          <Switch
            name="startAt100Selector"
            checked={startAt100}
            onChange={handleChangeStartAt100Selector}
          />
        }
        label={`Start at 100 ${translate(show)}`}
      />
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
