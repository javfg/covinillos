import React from 'react';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link, Typography, Paper, Grid } from '@material-ui/core';

import DataTable from './DataTable';

import { countryToFlag } from '../../utils/utils';


const cols = [{
    id: 'country',
    width: 25,
    sortable: true,
    label: 'Country',
    cellContent: d => <>{countryToFlag(d.country)} {d.country}</>
  }, {
    id: 'date',
    width: 25,
    sortable: true,
    label: 'Date',
    cellContent: d => d.date
  }, {
    id: 'description',
    width: 45,
    sortable:true,
    label: 'Description',
    cellContent: d => d.description
  }, {
    id: 'reference',
     width: 5,
     label: 'Reference',
     align: 'center',
     cellContent: d =>
      <Link href={d.reference} target="blank">
        <OpenInNewIcon style={{ verticalAlign: 'text-top' }}/>
      </Link>
  },
];


export default function ReferenceList(props) {
  const { rows } = props;

  return (
    <Grid container spacing={3} style={{ margin: 0, width: '100%' }}>
      <Grid item xs={12}>
        <Paper width="90%">
          <Typography variant="h5">Reference list</Typography>

          <DataTable
            rows={rows}
            cols={cols}
          />
        </Paper>
      </Grid>
    </Grid>
  );
}
