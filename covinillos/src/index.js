import React from 'react';
import ReactDOM from 'react-dom';
import { schemeTableau10 as st } from 'd3';

import Dashboard from './components/Dashboard';

import dataset from '../data/dataset.json';
import events from '../data/events.json';

import './styles/main.scss';


const countries = Object.keys(dataset);
const colorMap = countries
  .reduce((acc, country, i) => ({...acc, [country]: st[i % st.length]}), {})


// Render app.
ReactDOM.render(
  <Dashboard
    countries={countries}
    colorMap={colorMap}
    dataset={dataset}
    events={events}
  />
, document.getElementById("app"));
