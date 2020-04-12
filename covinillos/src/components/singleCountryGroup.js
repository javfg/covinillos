import React from 'react';

import { Grid } from '@material-ui/core';

import DataSelector from './dataSelector';
import CountrySelector from './countrySelector';
import BarChart from './barChart';

import { calculateMaxY } from '../utils/utils';
import { Config } from '../config';


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


  render() {
    const {
      handleChangeShowData,
      handleChangeShowType,
      handleChangeSelection,
      state: { selection, showData, showType, maxY },
      props: { countries, colorMap, dataset },
    } = this;

    return (
      <Grid
        container
        spacing={3}
        style={{margin: 0,width: '100%',}}
      >
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

        {selection.map((c, i) =>
          <Grid
            item
            container
            justify="flex-end"
            xs={12}
            xl={6}
            key={`singlecountry-${c}-${i}`}
          >
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
            <BarChart
              country={c}
              data={dataset[c]}
              color={colorMap[c]}
              maxY={maxY}
              showType={showType}
              showData={showData}
            />
          </Grid>
        )}
      </Grid>
    );
  }
}


export default SingleCountryGroup;
