import React from 'react';

import Checkbox from '@material-ui/core/Checkbox';
import TextField from '@material-ui/core/TextField';
import Autocomplete from '@material-ui/lab/Autocomplete';
import CheckBoxIcon from "@material-ui/icons/CheckBox";
import CheckBoxOutlineBlankIcon from '@material-ui/icons/CheckBoxOutlineBlank';


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
    return (
      <div className="d-flex justify-evenly">
        <select
          id={`${name}-${selectorType}`}
          value={selection}
          onChange={e => handleChangeCountry(e)}
        >
          {countries.map(c =>
            <option key={`${selectorType}-${c}`}>{c}</option>
          )}
        </select>
      </div>
    );
  }
}


export default CountrySelector;
