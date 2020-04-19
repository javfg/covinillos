import React, { useState } from 'react';

import { Grid, Switch, makeStyles, Paper } from '@material-ui/core';

import CountrySelector from './CountrySelector';
import ChartWrapper from './ChartWrapper';
import MultiLineChart from './MultiLineChart';
import { getMaxY, translate } from '../../utils/utils';
import { prepareMultiCountry } from '../../utils/dataPreparation';
import config from '../../config';


const useStyles = makeStyles({
  caps: { textTransform: 'uppercase' },
  sepadding: { padding: '0 3px 3px 0' },
});

export default function MultiCountryGroup(props) {
  const { countries, colorMap, dataset, show } = props;

  const [normalSelection, setNormalSelection] = useState(props.normalSelection);
  const [altSelection, setAltSelection] = useState(props.altSelection);
  const [alt, setAlt] = useState(false);

  const handleChangeSelection = (_, selection) => {
    if (selection.length > 10) return;
    if (alt) {
      setAltSelection(selection.length ? selection : config.defaultMultiCountriesAltSelection);
    } else {
      setNormalSelection(selection.length ? selection : config.defaultMultiCountriesNormalSelection);
    }
  };

  const handleChangeAlt = (e) => { setAlt(e.target.checked); };

  const selection = alt ? altSelection : normalSelection;
  const type = alt ? 'startAt100' : 'normal';
  const pDataset = prepareMultiCountry(dataset, colorMap, selection, show, alt);
  const maxY = getMaxY(dataset, selection, show, alt);

  const classes = useStyles();

  return (
    <Grid item xs={12}>
      <Paper>
        <Grid container>
          <Grid item xs={12}>
            <ChartWrapper>
              <MultiLineChart
                type={type}
                countries={selection}
                dataset={pDataset}
                maxY={maxY}
                name="multicountrychart"
                show={show}
              />
            </ChartWrapper>
          </Grid>

          <Grid item xs={4} lg={3}>
            <Grid component="label" container justify="center" alignItems="center">
              <Switch name="altSelector" checked={alt} onChange={handleChangeAlt} />
              <Grid item className={classes.caps}>
                Start at 100 {translate(show)}
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={8} lg={9} className={classes.sepadding}>
            <CountrySelector
              name="singlecountrychart"
              countries={countries}
              colorMap={colorMap}
              handleChangeCountry={handleChangeSelection}
              selection={selection}
              selectorType="checkbox"
            />
          </Grid>
        </Grid>
      </Paper>
    </Grid>
  );
}
