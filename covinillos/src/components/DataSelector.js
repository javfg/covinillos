import React from 'react';

import {
  Grid,
  FormControlLabel,
  makeStyles,
  RadioGroup,
  Radio,
  Typography,
  Card,
  CardHeader,
  CardContent,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles(theme => ({
  root: { ...theme.typography.button },
  fullHeightCard: {
    height: "100%",
  },
}));


export default function DataSelector(props) {
  const {
    title,
    name = 'dataselector',
    items,
    handleChange,
    selection
  } = props;

  const classes = useStyles();

  return (
    <Card className={classes.fullHeightCard}>
    <CardHeader title={title} />
    <CardContent>
      {
        items.length === 2 ? (
          <Grid container alignItems="center">
            <Grid item className={classes.root}>{items[0]}</Grid>
            <Grid item>
              <Switch
                name="itemName"
                checked={selection === items[1]}
                onChange={handleChange}
              />
            </Grid>
            <Grid item className={classes.root}>{items[1]}</Grid>
          </Grid>
        ) : (
          <RadioGroup name={name} onChange={handleChange}>
            <Grid container>
              {items.map((item, i) => (
                <Grid item key={`${name}-${item}-selector`}>
                  <FormControlLabel
                    control={<Radio />}
                    label={<Typography className={classes.root}>{item}</Typography>}
                    value={item}
                    checked={selection === item}
                  />
                </Grid>
              ))}
            </Grid>
          </RadioGroup>
        )
      }
    </CardContent>
    </Card>
  );
}
