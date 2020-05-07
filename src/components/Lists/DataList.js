import React from 'react';
import { Typography, Grid } from '@material-ui/core';

import DataTable from './DataTable';
import { countryLabel } from '../../utils/utils';


const lastUpdateLabel = (data, lastUpdate) => data.date !== lastUpdate ? ` (${data.date})` : '';


export default function DataList({ rows, lastUpdate }) {
  const cols = [{
    id: 'country',
    width: 16,
    label: 'Country',
    cellContent: d => <>{countryLabel(d.country)}{lastUpdateLabel(d, lastUpdate)}</>,
  }, {
    id: 'confirmed_total',
    width: 10,
    numeric: true,
    label: 'Confirmed',
    cellContent: d => d.confirmed_total.toLocaleString(),
    cellStyle: { backgroundColor: '#fffbf2' },
  }, {
    id: 'confirmed_pm_total',
    width: 8,
    numeric: true,
    label: 'Per M',
    cellContent: d => d.confirmed_pm_total.toLocaleString(),
    cellStyle: { backgroundColor: '#ffe79f' },
  }, {
    id: 'confirmed_daily',
    width: 10,
    numeric: true,
    label: 'New',
    cellContent: d => `+${d.confirmed_daily.toLocaleString()}`,
    cellStyle: { backgroundColor: '#fff3cd' },
  }, {
    id: 'deaths_total',
    width: 10,
    numeric: true,
    label: 'Deaths',
    cellContent: d => d.deaths_total.toLocaleString(),
    cellStyle: { backgroundColor: '#fdf4f5' },
  }, {
    id: 'deaths_pm_total',
    width: 8,
    numeric: true,
    label: 'Per M',
    cellContent: d => d.deaths_pm_total.toLocaleString(),
    cellStyle: { backgroundColor: '#f1afb5' },
  }, {
    id: 'deaths_daily',
    width: 10,
    numeric: true,
    label: 'New',
    cellContent: d => `+${d.deaths_daily.toLocaleString()}`,
    cellStyle: { backgroundColor: '#f8d7da' },
  },{
    id: 'recovered_total',
    width: 10,
    label: 'Recovered',
    numeric: true,
    cellContent: d => d.recovered_total.toLocaleString(),
    cellStyle: { backgroundColor: '#f4faf5' },
  }, {
    id: 'recovered_daily',
    width: 10,
    numeric: true,
    label: 'New',
    cellContent: d => `+${d.recovered_daily.toLocaleString()}`,
    cellStyle: { backgroundColor: '#d4edda' },
  }, {
    id: 'growth',
    width: 8,
    numeric: true,
    label: 'Growth',
    cellContent: d => `${d.growth.toFixed(2)}%`,
  }];

  rows.find(r => r.country === 'World').rowStyle = { fontWeight: 'bold' };

  return (
    <Grid item xs={12} xl={7}>
      <Typography variant="h5">Country data - {lastUpdate}</Typography>

      <DataTable
        rows={rows}
        cols={cols}
        defaultSort={['confirmed_total', 'desc']}
      />
    </Grid>
  );
}
