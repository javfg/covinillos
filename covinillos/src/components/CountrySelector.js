import React from 'react';

import { makeStyles, Chip } from '@material-ui/core';
import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { countryToFlag } from '../utils/utils';


const useStyles = makeStyles({
  option: {
    padding: 2,
    '& > span': { marginRight: 10 },
  },
  input: props => ({
    color: props.colorMap[props.selection],
    padding: 0,
  }),
});


export default function CountrySelector(props) {
  const {
    name,
    countries,
    colorMap,
    handleChangeCountry,
    selection,
    selectorType,
  } = props;

  if (selectorType === 'checkbox' || selectorType === 'radio') {
    const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
    const checkedIcon = <CheckBoxIcon fontSize="small" />;

    const classes = useStyles(props);

    return (
      <Autocomplete
        size="small"
        multiple
        disableCloseOnSelect
        id={`${name}-${selectorType}`}
        options={countries}
        onChange={handleChangeCountry}
        value={selection}
        classes={{ option: classes.option, }}
        renderOption={(c, { selected }) => (
          <>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              style={{ marginRight: 8, padding: 0 }}
              checked={selected}
            />
            <span>{countryToFlag(c)}</span>
            <span style={{color: colorMap[c]}}>{c}</span>
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Countries"
            variant="outlined"
            placeholder={selection.length < 10 ? 'Select countries...' : ''}
            style={{ padding: 3 }}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((c, index) => (
            <Chip
              style={{
                backgroundColor: colorMap[c],
                color: 'white',
                textShadow: '0px 0px 4px black'
              }}
              className={classes.chip}
              label={<span>{countryToFlag(c)} {c}</span>}
              {...getTagProps({ index })}
            />
          ))
        }
      />
    );
  }

  else if (selectorType === 'dropdown') {
    const classes = useStyles(props);

    return (
      <Autocomplete
        autoHighlight
        disableClearable
        id={`${name}-${selectorType}`}
        options={countries}
        onChange={handleChangeCountry}
        value={selection}
        classes={{ option: classes.option, }}
        renderOption={c => (
          <>
            <span>{countryToFlag(c)}</span>
            <span style={{color: colorMap[c]}}>{c}</span>
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose a country"
            variant="outlined"
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
              className: classes.input,
            }}

          />
        )}
      />
    );
  }
}
