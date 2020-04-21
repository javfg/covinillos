import React from 'react';
import ReactDOM from 'react-dom';
import { schemeTableau10 as st } from 'd3';

import Dashboard from './components/Dashboard';
import { prepareDataset } from './utils/dataPreparation';
import { ChartSettingsProvider } from './contexts/ChartSettings';
import dataset from '../data/dataset.json';
import events from '../data/events.json';
import './styles/main.scss';


const preparedDataset = prepareDataset(dataset);
const countries = Object.keys(dataset);
const colorMap = countries
  .reduce((acc, country, i) => ({...acc, [country]: st[i % st.length]}), {})


// Render app.
ReactDOM.render(
  <ChartSettingsProvider>
    <Dashboard
      countries={countries}
      colorMap={colorMap}
      dataset={preparedDataset}
      events={events}
    />
  </ChartSettingsProvider>
, document.getElementById("app"));
