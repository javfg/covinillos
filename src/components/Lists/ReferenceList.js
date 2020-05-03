import React from 'react';
import { Link, Typography, Grid } from '@material-ui/core';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import DataTable from './DataTable';
import { countryToFlag } from '../../utils/utils';


const cols = [{
    id: 'country',
    width: 20,
    sortable: true,
    label: 'Country',
    cellContent: d => <>{countryToFlag(d.country)} {d.country}</>
  }, {
    id: 'date',
    width: 15,
    sortable: true,
    label: 'Date',
    align: 'center',
    cellContent: d => d.date
  }, {
    id: 'description',
    width: 50,
    sortable:true,
    label: 'Description',
    cellContent: d => d.description
  }, {
    id: 'reference',
     width: 15,
     label: 'Reference',
     align: 'center',
     cellContent: d =>
      <Link href={d.reference} target="blank">
        <OpenInNewIcon style={{ verticalAlign: 'text-top' }}/>
      </Link>
  },
];


export default function ReferenceList({ rows }) {
  return (
    <Grid item xs={12} xl={5}>
      <Typography variant="h5">Reference list</Typography>

      <DataTable
        rows={rows}
        cols={cols}
        defaultSort={['date', 'asc']}
      />
    </Grid>
  );
}
