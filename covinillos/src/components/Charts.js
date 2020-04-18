import React, { useState } from 'react';

import { Grid } from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';

import DataSelector from './DataSelector';
import SingleCountryGroup from './SingleCountryGroup';
import MultiCountryGroup from './MultiCountryGroup';

import config from '../config';


export default function Dashboard(props) {
  const { countries, colorMap, dataset } = props;

  const [showData, setShowData] = useState(config.defaultShowData);
  const [showType, setShowType] = useState(config.defaultShowType);

  const handleChangeShowData = e => { setShowData(e.target.value); };
  const handleChangeShowType = e => { setShowType(e.target.checked ? 'total' : 'daily'); };


  return (
    <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
      <Grid item sm={12} md={6} lg={4} xl={3}>
        <DataSelector
          name="singlecountrychart-data"
          title="Data to show"
          items={['confirmed', 'deaths', 'recovered']}
          handleChange={handleChangeShowData}
          selection={showData}
        />
      </Grid>
      <Grid item xs={12} md={6} lg={2}>
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
