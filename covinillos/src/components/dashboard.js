import React from 'react';

import SingleCountryGroup from './singleCountryGroup';
import MultiCountryChart from './multiCountryChart';

import { Config } from '../config';


export default function Dashboard(props) {
  const { countries, colorMap, dataset } = props;

  return (
    <>
      <header>
        <h1>COVID-19 Pandemic stats</h1>
      </header>

      <MultiCountryChart
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
        selection={Config.startingMultiCountriesSelection}
        showData={Config.startingMultiCountriesShowData}
        showType={Config.startingMultiCountriesShowType}
      />

      <SingleCountryGroup
        countries={countries}
        colorMap={colorMap}
        dataset={dataset}
        selection={Config.startingSingleCountriesSelection}
      />

      <div className="ass"></div>
    </>
  );
}
