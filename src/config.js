const config = {
  // dashboard defalts
  defaultMultiCountriesNormalSelection: [
    'France',
    'Germany',
    'Italy',
    'Spain',
    'United Kingdom',
  ],
  defaultMultiCountriesAltSelection: [
    'Austria',
    'Belgium',
    'France',
    'Germany',
    'Italy',
    'Netherlands',
    'Spain',
    'Switzerland',
    'United Kingdom',
    'United States',
  ],
  defaultSingleCountrySelection: [
    'Spain',
    'United Kingdom',
  ],
  defaultShowData: 'confirmed',
  defaultShowType: 'total',

  // chart config
  tooltipHeight: 120,
  tooltipWidth: 200,
  tooltipWideWidth: 400,

  transitionData: 750,
  transitionLong: 250,
  transitionShort: 100,

  // suggest event form
  popoverTimeout: 5000,

  // data url
  dataUrl: 'http://covid-data.meneillos.com'
};

export default config;
