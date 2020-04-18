import React from 'react';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link, Typography, Paper, Grid } from '@material-ui/core';

import DataTable from './DataTable';

import { countryToFlag } from '../../utils/utils';


const cols = [{
    id: 'country',
    width: 16,
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
    width: 60,
    sortable:true,
    label: 'Description',
    cellContent: d => d.description
  }, {
    id: 'reference',
     width: 10,
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
    <>
      <Typography variant="h5">Reference list</Typography>

      <DataTable
        rows={rows}
        cols={cols}
      />
    </>
  );
}
