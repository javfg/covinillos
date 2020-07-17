import React from 'react';
import {
  AppBar,
  Toolbar,
  Typography,
  Button,
  makeStyles,
  Grid,
  useMediaQuery,
} from '@material-ui/core';
import MailIcon from '@material-ui/icons/Mail';

import DataSelector from './Charts/DataSelector';
import useChartSettings from '../hooks/useChartSettings';

const useStyles = makeStyles({
  caps: { textTransform: 'uppercase' },
  button: { padding: 0 },
  reduceheight: { marginTop: '-36px' },
  reducewidth: { width: '56%' },
  toolbar: { justifyContent: 'space-between', padding: '0 8px !important' },
  title: { textTransform: 'uppercase', fontWeight: 'bold' },
  subtitle: {
    fontSize: '0.8rem',
    textAlign: 'right',
    textTransform: 'uppercase',
    margin: '-9px 0 0 0',
  },
});

function TopBar({ handleClickSuggestEvent, lastUpdate, mobile }) {
  const classes = useStyles();
  const matchesDownMd = useMediaQuery(theme => theme.breakpoints.down('md'));
  const matchesUpMd = useMediaQuery(theme => theme.breakpoints.up('md'));

  const { chartSettings, saveChartSettings } = useChartSettings();
  const { showData, showType } = chartSettings;

  const handleChangeShowData = e => {
    saveChartSettings({ ...chartSettings, showData: e.target.value });
  };

  const handleChangeShowType = e => {
    saveChartSettings({ ...chartSettings, showType: e.target.checked ? 'total' : 'daily' });
  };

  return (
    <AppBar position="sticky">
      <Toolbar className={classes.toolbar}>
        <div>
          <Typography variant="h6" className={classes.title}>
            COVID-19 Pandemic stats
          </Typography>
          <p className={classes.subtitle}>Last updated: {lastUpdate}</p>
        </div>

        {mobile ? null : (
          <>
            <Grid container className={matchesUpMd ? classes.reducewidth : null} spacing={3}>
              <Grid item xs={12} lg={8} xl={6}>
                <DataSelector
                  name="showdata"
                  title="Data"
                  items={['confirmed', 'deaths', 'recovered']}
                  handleChange={handleChangeShowData}
                  selection={showData}
                />
              </Grid>
              <Grid
                item
                className={matchesDownMd ? classes.reduceheight : ''}
                xs={12}
                lg={4}
                xl={6}
              >
                <DataSelector
                  name="showtype"
                  title="Aggregate"
                  items={['daily', 'total']}
                  handleChange={handleChangeShowType}
                  selection={showType}
                />
              </Grid>
            </Grid>
            <Button
              color="inherit"
              onClick={handleClickSuggestEvent}
              className={classes.button}
              startIcon={<MailIcon />}
            >
              Suggest an event
            </Button>
          </>
        )}
      </Toolbar>
    </AppBar>
  );
}

export default TopBar;
