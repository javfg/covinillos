import React from 'react';
import ReactDOM from 'react-dom';
import ReactGA from 'react-ga';

import Dashboard from './components/Dashboard';
import { ChartSettingsProvider } from './contexts/ChartSettings';
import './styles/main.scss';

ReactGA.initialize('UA-169060166-1');
ReactGA.pageview(window.location.pathname + window.location.search);



// Render app.
ReactDOM.render(
  <ChartSettingsProvider>
    <Dashboard />
  </ChartSettingsProvider>,
  document.getElementById('app'),
);
