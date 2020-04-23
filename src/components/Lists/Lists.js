import React from 'react';
import { Grid } from '@material-ui/core';

import DataList from './DataList';
import ReferenceList from './ReferenceList';
import { prepareDataList } from '../../utils/dataPreparation';


function Lists({ dataset, events, lastUpdate }) {
  const dataListDataset = prepareDataList(dataset);

  return (
    <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
      <DataList rows={dataListDataset} lastUpdate={lastUpdate} />
      <ReferenceList rows={events} />
    </Grid>
  );
}


export default Lists;
