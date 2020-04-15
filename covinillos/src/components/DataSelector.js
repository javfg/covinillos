import React from 'react';

import {
  Grid,
  FormControlLabel,
  makeStyles,
  RadioGroup,
  Radio,
  Typography,
  Paper,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles(theme => ({
  lbl: { ...theme.typography.button },
  fg: { flexDirection: 'row', justifyContent: 'center' },
  paper: { height: '100%', padding: '.5rem' },
  center: { textAlign: 'center' }
}));


export default function DataSelector(props) {
  const { title, name = 'ds', items, handleChange, selection } = props;

  const classes = useStyles();

  return (
    <Paper className={classes.paper} justify="center">
      <Typography variant="h6">{title}</Typography>
      {items.length === 2 ? (
        <div className={classes.center}>
          <span className={classes.lbl}>{items[0]}</span>
          <Switch
            name="itemName"
            checked={selection === items[1]}
            onChange={handleChange}
          />
          <span className={classes.lbl}>{items[1]}</span>
        </div>
      ) : (
        <RadioGroup name={name} onChange={handleChange} className={classes.fg}>
          {items.map((item, i) => (
            <FormControlLabel
              key={`${name}-${item}-selector`}
              control={<Radio />}
              label={<Typography className={classes.lbl}>{item}</Typography>}
              value={item}
              checked={selection === item}
            />
          ))}
        </RadioGroup>
      )}
    </Paper>
  );
}
