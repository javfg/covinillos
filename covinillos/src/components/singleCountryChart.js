import React from 'react';

import BarChart from './barChart';
import CountrySelector from './countrySelector';


function SingleCountryChart(props) {
  const {
    countries,
    colorMap,
    selection,
    data,
    index,
    showData,
    showType,
    maxY,
    handleChangeCountry
  } = props;

  const handleSelectCountry = (e, values) => {handleChangeCountry(index, e.target.value, values); };

  return (
    <div>
      <BarChart
        country={selection}
        data={data}
        color={colorMap[selection]}
        maxY={maxY}
        showType={showType}
        showData={showData}
      />

      <CountrySelector
        name="singlecountrychart"
        countries={countries}
        colorMap={colorMap}
        handleChangeCountry={handleSelectCountry}
        selection={selection}
        selectorType="dropdown"
      />
    </div>
  );
}


export default SingleCountryChart;
