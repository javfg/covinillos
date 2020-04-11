import React from 'react';


function CountrySelector(props) {
  const {
    name, countries, colorMap, handleChangeCountry, selection, selectorType
  } = props;

  if (selectorType === 'checkbox' || selectorType === 'radio') {
    return (
      <div className="countries-grid-container countries-container flex-grow-1">
        {countries.map(c => {
          const selectorName = `${name}-${selectorType}-${c}`;

          return (
            <div
              key={selectorName}
              className="country-container"
            >
              <input
                id={selectorName}
                type={selectorType}
                name={c}
                onChange={handleChangeCountry}
                checked={
                  selectorType === 'checkbox' ?
                    selection.includes(c)
                  :
                    selection === c
                }
              />
              <label
                className="ellipsis"
                htmlFor={selectorName}
                style={{'color': colorMap[c]}}
              >
                {c}
              </label>
            </div>
          );
        })}
      </div>
    );
  }

  else if (selectorType === 'dropdown') {
    return (
      <div className="d-flex justify-evenly">
        <select
          id={`${name}-${selectorType}`}
          value={selection}
          onChange={handleChangeCountry}
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
