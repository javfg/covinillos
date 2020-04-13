import React, { useState } from 'react';

import { Grid } from '@material-ui/core';

import DataSelector from './dataSelector';
import SingleCountryGroup from './singleCountryGroup';
import MultiCountryChart from './multiCountryChart';

import { Config } from '../config';


export default function Dashboard(props) {
  const { countries, colorMap, dataset } = props;

  const [showData, setShowData] = useState(Config.defaultShowData);
  const [showType, setShowType] = useState(Config.defaultShowType);

  const handleChangeShowData = e => { setShowData(e.target.value); };
  const handleChangeShowType = e => { setShowType(e.target.value); };


  return (
    <>
      <header>
        <h1>COVID-19 Pandemic stats</h1>
      </header>

      <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
        <Grid item xs={6}>
          <DataSelector
            name="singlecountrychart-data"
            items={['confirmed', 'deaths', 'recovered']}
            handleChange={handleChangeShowData}
            selection={showData}
          />
        </Grid>
        <Grid item xs={6}>
          <DataSelector
            name="singlecountrychart-type"
            items={['daily', 'total']}
            handleChange={handleChangeShowType}
            selection={showType}
          />
        </Grid>

        {/* <MultiCountryChart
          countries={countries}
          colorMap={colorMap}
          dataset={dataset}
          selection={Config.defaultMultiCountriesSelection}
          show={`${showData}_${showType}`}
        /> */}

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
