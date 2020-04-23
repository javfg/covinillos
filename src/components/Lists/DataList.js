import React from 'react';
import { Typography, Grid } from '@material-ui/core';

import DataTable from './DataTable';
import { countryToFlag } from '../../utils/utils';


const cols = [{
    id: 'country',
    width: 16,
    sortable: true,
    label: 'Country',
    cellContent: d => <>{countryToFlag(d.country)} {d.country}</>,
  }, {
    id: 'confirmed',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'Confirmed',
    cellContent: d => d.confirmed.toLocaleString(),
    cellStyle: { backgroundColor: '#fffbf2' },
  }, {
    id: 'confirmedNew',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'New',
    cellContent: d => `+${d.confirmedNew.toLocaleString()}`,
    cellStyle: { backgroundColor: '#fff3cd' },
  },{
    id: 'deaths',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'Deaths',
    cellContent: d => d.deaths.toLocaleString(),
    cellStyle: { backgroundColor: '#fdf4f5' },
  }, {
    id: 'deathsNew',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'New',
    cellContent: d => `+${d.deathsNew.toLocaleString()}`,
    cellStyle: { backgroundColor: '#f8d7da' },
  },{
    id: 'recovered',
    width: 12,
    label: 'Recovered',
    sortable: true,
    numeric: true,
    cellContent: d => d.recovered.toLocaleString(),
    cellStyle: { backgroundColor: '#f4faf5' },
  }, {
    id: 'recoveredNew',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'New',
    cellContent: d => `+${d.recoveredNew.toLocaleString()}`,
    cellStyle: { backgroundColor: '#d4edda' },
  }, {
    id: 'growth',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'Growth',
    cellContent: d => `${parseFloat(d.confirmedNew / d.confirmedPrev * 100).toFixed(2)}%`,
  },
];


export default function DataList({ rows, lastUpdate }) {
  rows[0].rowStyle = { fontWeight: 'bold' };


  return (
    <Grid item xs={12} xl={6}>
      <Typography variant="h5">Country data - {lastUpdate}</Typography>

      <DataTable
        rows={rows}
        cols={cols}
        defaultSort={['confirmed', 'desc']}
      />
    </Grid>
  );
}
