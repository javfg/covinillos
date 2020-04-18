import React from 'react';

import { Typography, Grid, Paper } from '@material-ui/core';

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
  }, {
    id: 'confirmedNew',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'New confirmed',
    cellContent: d => d.confirmedNew.toLocaleString(),
  },{
    id: 'deaths',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'Deaths',
    cellContent: d => d.deaths.toLocaleString(),
  }, {
    id: 'deathsNew',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'New deaths',
    cellContent: d => d.deathsNew.toLocaleString(),
  },{
    id: 'recovered',
     width: 12,
     label: 'Recovered',
     sortable: true,
     numeric: true,
     cellContent: d => d.recovered.toLocaleString(),
  }, {
    id: 'recoveredNew',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'New recovered',
    cellContent: d => d.recoveredNew.toLocaleString(),
  }, {
    id: 'growth',
    width: 12,
    sortable: true,
    numeric: true,
    label: 'Growth rate',
    cellContent: d => `${parseFloat(d.confirmedNew / d.confirmedPrev * 100).toFixed(2)}%`,
  },
];


export default function DataList(props) {
  const { rows } = props;

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      <Grid item xs={12}>
        <Paper width="90%">
          <Typography variant="h5">Country data</Typography>

          <DataTable
            rows={rows}
            cols={cols}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
