import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';
import { schemeTableau10 as st } from 'd3';

import Dashboard from './components/Dashboard';
import { prepareDataset, prepareCountries } from './utils/dataPreparation';
import { ChartSettingsProvider } from './contexts/ChartSettings';
import dataset from '../data/dataset.json';
import events from '../data/events.json';
import './styles/main.scss';

ReactGA.initialize('UA-169060166-1');
ReactGA.pageview(window.location.pathname + window.location.search);

const preparedDataset = prepareDataset(dataset);
const countries = prepareCountries(preparedDataset);
const colorMap = countries.reduce((acc, c, i) => ({ ...acc, [c]: st[i % st.length] }), {});
const lastUpdate = dataset[countries[0]][dataset[countries[0]].length - 1].date;

// Render app.
ReactDOM.render(
  <ChartSettingsProvider>
    <Dashboard
      countries={countries}
      colorMap={colorMap}
      dataset={preparedDataset}
      events={events}
      lastUpdate={lastUpdate}
    />
  </ChartSettingsProvider>,
  document.getElementById('app'),
);
