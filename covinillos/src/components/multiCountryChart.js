import React from 'react';

import CountrySelector from './countrySelector';
import DataSelector from './dataSelector';
import TimeSeriesChart from './timeSeriesChart';

import { calculateMaxY, setTime } from '../utils/utils';

import { Config } from '../config';


class MultiCountryChart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: this.props.selection || [],
      showData: this.props.showData || 'confirmed',
      showType: this.props.showType || 'total',
    };
  }


  // handlers
  handleChangeShowData = (e) => {
    this.setState({ showData: e.target.value });
  };

  handleChangeShowType = (e) => {
    this.setState(
      { showType: this.state.showType === 'daily' ? 'total' : 'daily' }
    );
  }

  handleChangeSelection = (e, selection) => {
    if (!selection.length) {
      selection = Config.startingMultiCountriesSelection;
    }

    this.setState({ selection });
  }


  // tools
  prepareData = () => {
    const {
      state: { selection, showData, showType },
      props: { colorMap, dataset },
    } = this;

    const datum = `${showData}_${showType}`;
    const formattedData = [];

    selection.forEach(country => {
      const values = [];
      const events = [];
      const color = colorMap[country];

      dataset[country].forEach(day => {
        const date = setTime(day.date, 12);
        const value = day[datum];
        const captions = day.events;

        values.push({ date, value });
        if (captions.length) {
          const eventDate = new Date(date.getTime());
          events.push({ country, color, date: eventDate, captions, value });
        }
      });

      formattedData.push({ country, color, values, events });
    });

    return formattedData;
  }


  render() {
    const {
      handleChangeSelection,
      handleChangeShowType,
      handleChangeShowData,
      prepareData,
      state: { selection, showData, showType },
      props: { countries, colorMap, dataset },
    } = this;

    return (
      <>
        <TimeSeriesChart
          countries={selection}
          dataset={prepareData()}
          maxY={calculateMaxY(dataset, selection, showData, showType)}
          name="multicountrychart"
          showType={showType}
          showData={showData}
        />

        <div className="d-flex justify">
          <DataSelector
            name="multicountrychart-type"
            items={['daily', 'total']}
            handleChange={handleChangeShowType}
            selection={showType}
          />
          <DataSelector
            name="multicountrychart-data"
            items={['confirmed', 'deaths', 'recovered']}
            handleChange={handleChangeShowData}
            selection={showData}
          />
        </div>

        <CountrySelector
          name="singlecountrychart"
          countries={countries}
          colorMap={colorMap}
          handleChangeCountry={handleChangeSelection}
          selection={selection}
          selectorType="checkbox"
        />
      </>
    );
  }
}


export default MultiCountryChart;
