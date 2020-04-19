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
  box: { display: 'flex', justifyContent: 'center', alignItems: 'center' },
  caps: { textTransform: 'uppercase'},
  title: { fontWeight: 'bold', marginRight: '1rem' },
  radiogroup: { flexDirection: 'row' },
}));


export default function DataSelector(props) {
  const { title, name = 'ds', items, handleChange, selection } = props;

  const classes = useStyles();


  return (
    items.length === 2 ? (
      <Box component="label" className={classes.box} >
        <span className={`${classes.title} ${classes.caps}`}>{title}</span>
        <span className={classes.caps}>{items[0]}</span>
        <Switch
          name="itemName"
          checked={selection === items[1]}
          onChange={handleChange}
        />
        <span className={classes.caps}>{items[1]}</span>
      </Box>
    ) : (
      <Box className={classes.box}>
        <span className={`${classes.title} ${classes.caps}`}>{title}</span>
        <RadioGroup name={name} onChange={handleChange} className={classes.radiogroup}>
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
