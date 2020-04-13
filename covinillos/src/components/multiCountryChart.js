import React from 'react';

import { Grid } from '@material-ui/core';

import CountrySelector from './countrySelector';
import DataSelector from './dataSelector';
import ChartWrapper from './chartWrapper';
import MultiLineChart from './multiLineChart';

import { calculateMaxY, setTime } from '../utils/utils';

import { Config } from '../config';


// TODO: Convert to hooks.
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
      selection = Config.multiCountriesSelection;
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
      <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
        <Grid item xs={12}>
          <ChartWrapper>
            <MultiLineChart
              countries={selection}
              dataset={prepareData()}
              maxY={calculateMaxY(dataset, selection, showData, showType)}
              name="multicountrychart"
              showType={showType}
              showData={showData}
            />
          </ChartWrapper>
        </Grid>

        <Grid item container xs={12}>
          <Grid item xs={6}>
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
        </Grid>

          <Grid item xs={6}>
            <CountrySelector
              name="singlecountrychart"
              countries={countries}
              colorMap={colorMap}
              handleChangeCountry={handleChangeSelection}
              selection={selection}
              selectorType="checkbox"
            />
          </Grid>
        </Grid>
      </Grid>
    );
  }
}


export default MultiCountryChart;
