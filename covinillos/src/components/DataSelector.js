import React from 'react';

import {
  Grid,
  FormControlLabel,
  makeStyles,
  RadioGroup,
  Radio,
  Typography,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles((theme) => ({
  root: {
    ...theme.typography.button,
    // backgroundColor: theme.palette.background.paper,
    // padding: theme.spacing(1),
  },
}));


export default function DataSelector(props) {
  const { name = 'dataselector', items, handleChange, selection } = props;

  const classes = useStyles();

  if (items.length === 2) return (
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
  )

  return (
    <RadioGroup name={name} onChange={handleChange}>
      <Grid container>
        {items.map((item, i) => (
          <Grid item>
            <FormControlLabel
              key={`${name}-${item}-selector`}
              control={<Radio />}
              label={<Typography className={classes.root}>{item}</Typography>}
              value={item}
              checked={selection === item}
            />
          </Grid>
        ))}
      </Grid>
    </RadioGroup>
  );
}
