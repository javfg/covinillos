import React from 'react';

import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
} from '@material-ui/core';

import MailIcon from '@material-ui/icons/Mail';

import DataSelector from './Charts/DataSelector';
import useChartSettings from '../hooks/useChartSettings';


const useStyles = makeStyles({
  toolbar: { justifyContent: 'space-between' },
  caps: { textTransform: 'uppercase'},
});


function TopBar({ handleClickSuggestEvent }) {
  const classes = useStyles();
  const { chartSettings, saveChartSettings } = useChartSettings();
  const { showData, showType } = chartSettings;

  const handleChangeShowData = e => {
    saveChartSettings({...chartSettings, showData: e.target.value});
  };

  const handleChangeShowType = e => {
    saveChartSettings({...chartSettings, showType: e.target.checked ? 'total' : 'daily'});
  };


  return (
    <AppBar position="sticky">
      <Toolbar className={classes.toolbar}>
        <Typography variant="h6">
          COVID-19 Pandemic stats
        </Typography>

        <DataSelector
          name="showdata"
          title="Data"
          items={['confirmed', 'deaths', 'recovered']}
          handleChange={handleChangeShowData}
          selection={showData}
        />

        <DataSelector
          name="showtype"
          title="Aggregate"
          items={['daily', 'total']}
          handleChange={handleChangeShowType}
          selection={showType}
        />

        <Button
          color="inherit"
          onClick={handleClickSuggestEvent}
          className={classes.button}
          startIcon={<MailIcon />}
        >
          Suggest an event
        </Button>
      </Toolbar>
    </AppBar>
  );
}


export default TopBar;
