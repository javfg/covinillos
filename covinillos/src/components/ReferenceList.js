import React from 'react';

import OpenInNewIcon from '@material-ui/icons/OpenInNew';
import { Link, Typography } from '@material-ui/core';

import DataTable from './DataTable';

import { countryToFlag } from '../utils/utils';


const cols = [{
    id: 'country',
    width: 25,
    sortable: true,
    label: 'Country',
    cellContent: d => <>{countryToFlag(d.country)} {d.country}</>
  }, {
    id:'date',
    width: 25,
    sortable: true,
    label: 'Date',
    cellContent: d => d.date
  }, {
    id:'description',
    width:45,
    sortable:true,
    label:'Description',
    cellContent: d => d.description
  }, {
    id: 'reference',
     width: 5,
     label: 'Reference',
     cellContent: d => <Link href={d.reference} target="blank"><OpenInNewIcon /></Link>
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
