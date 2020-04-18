import React from 'react';

import { Grid } from '@material-ui/core';

import DataList from './DataList';
import ReferenceList from './ReferenceList';

import { prepareDataList } from '../../utils/dataPreparation';


function Lists(props) {
  const { dataset, events } = props;

  const dataListDataset = prepareDataList(dataset);

  return (
    <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
      <Grid item xs={12} xl={6}>
        <DataList
          rows={dataListDataset}
        />
      </Grid>
      <Grid item xs={12} xl={6}>
        <ReferenceList
          rows={events}
        />
      </Grid>
    </Grid>
  );
}


export default Lists;
