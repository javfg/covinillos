import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import { makeStyles } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { countryToFlag } from '../utils/utils';


const useStyles = makeStyles({
  option: {
    fontSize: 15,
    '& > span': {
      marginRight: 10,
      fontSize: 18,
    },
  },
});


function CountrySelector(props) {
  const {
    name, countries, colorMap, handleChangeCountry, selection, selectorType
  } = props;

  if (selectorType === 'checkbox' || selectorType === 'radio') {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    return (
      <Autocomplete
        multiple
        disableCloseOnSelect
        id={`${name}-${selectorType}`}
        options={countries}
        onChange={handleChangeCountry}
        value={selection}
        renderOption={(option, { selected }) => (
          <>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8 }}
              checked={selected}
            />
            {option}
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            variant="outlined"
            label="Countries"
            placeholder="Select countries..."
          />
        )}
      />
    );
  }

  else if (selectorType === 'dropdown') {
    const classes = useStyles();

    return (
      <Autocomplete
        autoHighlight
        disableClearable
        id={`${name}-${selectorType}`}
        options={countries}
        onChange={handleChangeCountry}
        value={selection}
        classes={{ option: classes.option, }}
        // getOptionLabel={(option) => option}
        renderOption={(c) => (<><span>{countryToFlag(c)}</span>{c}</>)}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a country"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        )}
      />
    );
  }
}


export default CountrySelector;
