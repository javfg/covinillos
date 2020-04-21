import React from 'react';
import ReactDOM from 'react-dom';
import { schemeTableau10 as st } from 'd3';

import Dashboard from './components/Dashboard';

import { ChartSettingsProvider } from './contexts/ChartSettings';

// import dataset from '../data/dataset.json';
// import events from '../data/events.json';

let dataset = {};
let events = [];

(async () => {
  const datasetRequest = await fetch('data/dataset.json');
  console.log('datasetRequest', datasetRequest);

  dataset = await datasetRequest.json();

  console.log('datasetRequest', dataset);

})()

import './styles/main.scss';


const countries = Object.keys(dataset);
const colorMap = countries
  .reduce((acc, country, i) => ({...acc, [country]: st[i % st.length]}), {})


// Render app.
ReactDOM.render(
  <ChartSettingsProvider>
    {/* <Dashboard
      countries={countries}
      colorMap={colorMap}
      dataset={dataset}
      events={events}
    /> */}
  </ChartSettingsProvider>
, document.getElementById("app"));
