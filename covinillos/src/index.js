import React from 'react';
import ReactDOM from 'react-dom';
import { schemeTableau10 as st} from 'd3';

import Dashboard from './components/dashboard';

import dataset from '../data/dataset.json';

import { Config } from './config';

import './styles/main.scss';


const countries = Object.keys(dataset);
const colorMap = countries.reduce((acc, country, i) => ({...acc, [country]: st[i % st.length]}), {})


// Render app.
ReactDOM.render(
  <Dashboard
    countries={countries}
    colorMap={colorMap}
    dataset={dataset}
    startingMultiCountriesSelection={Config.startingMultiCountriesSelection}
    startingMultiCountriesShowData={Config.startingMultiCountriesShowData}
    startingMultiCountriesShowType={Config.startingMultiCountriesShowType}
    startingSingleCountriesSelection={Config.startingSingleCountriesSelection}
  />
, document.getElementById("app"));
