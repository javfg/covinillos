import React from 'react';
import { makeStyles, Chip } from '@material-ui/core';
import { Checkbox, TextField } from '@material-ui/core';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';

import { countryLabel } from '../../utils/utils';


const useStyles = makeStyles({
  option: { padding: 2, '& > span': { marginRight: 10 }, },
  input: props => ({ color: props.colorMap[props.selection], padding: '0px' }),
  checkbox: { marginRight: 8, padding: 0 },
});


export default function CountrySelector(props) {
  const { name, countries, colorMap, handleChangeCountry, selection, selectorType } = props;

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
        classes={{ option: classes.option }}
        renderOption={(c, { selected }) => (
          <>
            <Checkbox
              icon={icon}
              checkedIcon={checkedIcon}
              className={classes.checkbox}
              checked={selected}
            />
            <span id={`${name}-${selectorType}-${c}`} style={{color: colorMap[c]}}>
              {countryLabel(c)}
            </span>
          </>
        )}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Choose up to 10 countries"
            variant="outlined"
            placeholder={selection.length < 10 ? 'Select countries...' : ''}
            inputProps={{
              ...params.inputProps,
              autoComplete: 'new-password',
              overflow: 'hidden',
            }}
          />
        )}
        renderTags={(value, getTagProps) =>
          value.map((c, index) => (
            <Chip
              style={{
                backgroundColor: colorMap[c],
                color: 'white',
                textShadow: '0px 0px 4px black',
                maxWidth: '15%',
                fontSize: '.9rem',
              }}
              size="small"
              className={classes.chip}
              label={<span>{countryLabel(c)}</span>}
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
        classes={{ option: classes.option }}
        renderOption={
          c => <span id={`${name}-${selectorType}-${c}`} style={{color: colorMap[c]}}>
            {countryLabel(c)}
          </span>
        }
        renderInput={params =>
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
        }
      />
    );
  }
}
