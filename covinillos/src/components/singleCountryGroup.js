import React from 'react';

import { Grid } from '@material-ui/core';

import DataSelector from './dataSelector';
import CountrySelector from './countrySelector';
import ChartWrapper from './chartWrapper';
import BarChart from './barChart';

import { calculateMaxY } from '../utils/utils';
import { Config } from '../config';


// TODO: Convert to hooks.
class SingleCountryGroup extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      selection: this.props.selection || [],
      showData: 'confirmed',
      showType: 'daily',
      maxY: calculateMaxY(
        this.props.dataset,
        this.props.selection,
        'confirmed',
        'daily'
      ),
    };
  }


  // handlers
  handleChangeSelection = (e, index, value) => {
    if (!value) {
      value = Config.startingSingleCountriesSelection[0];
    }

    this.setStateAndScale({
      selection: this.state.selection.map((c, i) => i !== index ? c : value)
    });
  };

  handleChangeShowData = (e) => {
    this.setStateAndScale({ showData: e.target.value });
  };

  handleChangeShowType = (e) => {
    this.setStateAndScale({
      showType: this.state.showType === 'daily' ? 'total' : 'daily' }
    );
  }


  // utilities
  setStateAndScale = (state) => {
    const { selection, showData, showType } = {...this.state, ...state};
    const maxY = calculateMaxY(this.props.dataset, selection, showData, showType);

    this.setState({ ...state, selection, showData, showType, maxY });
  };

  getValueField = () => `${this.state.showData}_${this.state.showType}`;
  prepareData = (dataset) => dataset.map(d => ({
    date: new Date(d.date),
    value: d[this.getValueField()],
  }));


  render() {
    const {
      handleChangeShowData,
      handleChangeShowType,
      handleChangeSelection,
      prepareData,
      state: { selection, showData, showType, maxY },
      props: { countries, colorMap, dataset },
    } = this;

    return (
      <Grid container spacing={3} style={{margin: 0, width: '100%'}}>
        <Grid item xs={6}>
          <DataSelector
            name="singlecountrychart-data"
            items={['confirmed', 'deaths', 'recovered']}
            handleChange={handleChangeShowData}
            selection={showData}
          />
        </Grid>
        <Grid item xs={6}>
          <DataSelector
            name="singlecountrychart-type"
            items={['daily', 'total']}
            handleChange={handleChangeShowType}
            selection={showType}
          />
        </Grid>

        {selection.map((c, i) => {
          const key = `singlecountry-${c}-${i}`;

          return (
            <Grid item container justify="flex-end" xs={12} xl={6} key={key}>
              <Grid item xs={2}>
                <CountrySelector
                  name={`singlecountrychart-${i}`}
                  countries={countries}
                  colorMap={colorMap}
                  handleChangeCountry={(e, v) => handleChangeSelection(e, i, v)}
                  selection={c}
                  selectorType="dropdown"
                />
              </Grid>
              <Grid item xs={12}>
                <ChartWrapper>
                  <BarChart
                    country={c}
                    dataset={prepareData(dataset[c])}
                    color={colorMap[c]}
                    maxY={maxY}
                    showType={showType}
                    showData={showData}
                    />
                  </ChartWrapper>
              </Grid>
            </Grid>
          );
        })}
      </Grid>
    );
  }
}


export default SingleCountryGroup;
