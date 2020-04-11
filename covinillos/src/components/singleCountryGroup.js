import React from 'react';

import DataSelector from './dataSelector';
import SingleCountryChart from './singleCountryChart';

import { calculateMaxY } from '../utils';


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
  handleChangeSelection = (index, newCountry) => {
    this.setStateAndScale({
      selection: this.state.selection.map((c, i) => i !== index ? c : newCountry)
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
      <>
        <div className="d-flex justify">
          <DataSelector
            name="singlecountrychart-data"
            items={['confirmed', 'deaths', 'recovered']}
            handleChange={handleChangeShowData}
            selection={showData}
          />
          <DataSelector
            name="singlecountrychart-type"
            items={['daily', 'total']}
            handleChange={handleChangeShowType}
            selection={showType}
          />
        </div>

        <div className="singlecountrygroup-grid-container">
          {selection.map((c, i) =>
            <SingleCountryChart
              key={`singlecountry-${c}-${i}`}
              countries={countries}
              colorMap={colorMap}
              selection={c}
              data={dataset[c]}
              index={i}
              showData={showData}
              showType={showType}
              maxY={maxY}
              handleChangeCountry={handleChangeSelection}
            />
          )}
        </div>
      </>
    );
  }
}


export default SingleCountryGroup;
