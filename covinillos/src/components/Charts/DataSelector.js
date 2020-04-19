import React from 'react';

import {
  FormControlLabel,
  makeStyles,
  RadioGroup,
  Radio,
  Typography,
  Box,
} from '@material-ui/core';
import Switch from '@material-ui/core/Switch';


const useStyles = makeStyles(theme => ({
  caps: { textTransform: 'uppercase'},
  title: { textTransform: 'uppercase', fontWeight: 'bold', marginRight: '1rem' },
  fg: { flexDirection: 'row', justifyContent: 'center' },
  radiogroup: { flexDirection: 'row', display: 'flex', alignItems: 'center' },
  radio: { backgroundColor: 'black '},
  paper: { height: '100%', padding: '.5rem' },
  center: { textAlign: 'center' }
}));


export default function DataSelector(props) {
  const { title, name = 'ds', items, handleChange, selection } = props;

  const classes = useStyles();

  return (
    items.length === 2 ? (
      <Box>
        <span className={classes.title}>{title}</span>
        <span className={classes.caps}>{items[0]}</span>
        <Switch
          name="itemName"
          checked={selection === items[1]}
          onChange={handleChange}
        />
        <span className={classes.caps}>{items[1]}</span>
      </Box>
    ) : (
      <Box className={classes.radiogroup}>
        <span className={classes.title}>{title}</span>
        <RadioGroup name={name} onChange={handleChange} className={classes.fg}>
          {items.map((item, i) => (
            <FormControlLabel
              key={`${name}-${item}-selector`}
              control={<Radio />}
              label={<Typography className={classes.caps}>{item}</Typography>}
              value={item}
              checked={selection === item}
            />
          ))}
        </RadioGroup>
      </Box>
    )
  );
}
