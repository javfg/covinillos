import { setTime, longest } from './utils';


// initial preparation
export const prepareDataset = dataset => {
  const dataMap = [
    'confirmed_total',
    'deaths_total',
    'recovered_total',
    'confirmed_daily',
    'deaths_daily',
    'recovered_daily',
  ];

  Object.keys(dataset).forEach(country => {
    dataset[country].forEach(day => {
      dataMap.forEach((key, i) => {
        day[key] = day.data[i] >= 0 ? day.data[i] : 0;
        if (!day.events) day.events = [];
      });
    });
  });

  return dataset;
};

export const prepareCountries  = dataset => Object.keys(dataset)
  .sort((a, b) => {
    const confirmed_a = dataset[a][dataset[a].length - 1].confirmed_total;
    const confirmed_b = dataset[b][dataset[b].length - 1].confirmed_total;

    return confirmed_b - confirmed_a;
  });


export const prepareMultiCountry = (dataset, colorMap, selection, show, alt) =>
  !alt
    ? prepareMultiCountryNormal(dataset, colorMap, selection, show)
    : prepareMultiCountryAlt(dataset, colorMap, selection, show);


//
// Prepares dataset for multi country chart.
//
function prepareMultiCountryNormal(dataset, colorMap, selection, show) {
  const pDataset = [];

  selection.forEach(country => {
    const values = [];
    const events = [];
    const color = colorMap[country];

    dataset[country].forEach(day => {
      const date = setTime(day.date, 12);
      const value = day[show];
      const items = day.events.map(e => ({ caption: e.description, group: e.group }));

      values.push({ date, value });
      if (items.length) {
        events.push({ country, color, date, items, value });
      }
    });

    pDataset.push({ country, color, values, events });
  });

  return pDataset;
}


//
// Prepares dataset matching all selected countries at 100 of a given value.
//
function prepareMultiCountryAlt(dataset, colorMap, selection, show) {
  const pDataset = [];
  console.log('dataset', dataset);
  console.log('show', show);

  selection.forEach(country => {
    console.log('country', country);
    const values = [];
    const color = colorMap[country];
    const startIndex = dataset[country].findIndex(day => day[show] >= 100);
    let startDate = setTime(new Date(), 12);
    let date = new Date(startDate);

    dataset[country].slice(startIndex).forEach(day => {
      const value = day[show];

      values.push({ date, value });
      date = date.addDays(1);
    });

    pDataset.push({ country, color, values, events: [] });
  });

  const dataLength = pDataset[longest(pDataset, 'values')]?.values.length;

  // fill null values
  pDataset.forEach(c => {
    const datesToFill = dataLength - c.values.length;
    let date = new Date(c.values[c.values.length - 1].date);

    [...Array(datesToFill).keys()].forEach(i => {
      date = new Date(date.addDays(1));
      c.values.push({ date, value: null });
    });
  });

  return pDataset;
}


//
// Prepares dataset for the data list.
//
export function prepareDataList(dataset) {
  const pDataset = Object.keys(dataset).map((d, i) => {
    const values = dataset[d][dataset[d].length - 1];

    return {
      country: d,
      confirmed: values.confirmed_total,

      confirmedPrev: dataset[d][dataset[d].length - 2].confirmed_total,
      confirmedNew: values.confirmed_daily,
      deaths: values.deaths_total,
      deathsNew: values.deaths_daily,
      recovered: values.recovered_total,
      recoveredNew: values.recovered_daily,
    };
  });

  return pDataset;
}