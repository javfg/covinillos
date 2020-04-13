import React from 'react';

import SingleCountryGroup from './singleCountryGroup';
import MultiCountryChart from './multiCountryChart';


class Dashboard extends React.Component {
  constructor(props) {
    super(props);
  }


  render() {
    const {
      countries,
      colorMap,
      dataset,
      startingMultiCountriesSelection,
      startingMultiCountriesShowData,
      startingMultiCountriesShowType,
      startingSingleCountriesSelection,
    } = this.props;

    return (
      <>
        <header>
          <h1>COVID-19 Pandemic stats</h1>
        </header>

        <MultiCountryChart
          countries={countries}
          colorMap={colorMap}
          dataset={dataset}
          selection={startingMultiCountriesSelection}
          showData={startingMultiCountriesShowData}
          showType={startingMultiCountriesShowType}
        />

        <SingleCountryGroup
          countries={countries}
          colorMap={colorMap}
          dataset={dataset}
          selection={startingSingleCountriesSelection}
        />

        <div className="ass"></div>
      </>
    );
  }
}


export default Dashboard;
