import { setTime, longest } from './utils';


export const prepareMultiCountry = (dataset, colorMap, selection, show, alt) =>
  !alt
    ? prepareMultiCountryNormal(dataset, colorMap, selection, show)
    : prepareMultiCountryAlt(dataset, colorMap, selection, show);


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

  selection.forEach(country => {
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
  const pDataset = [{
    country: 'World',
    confirmed: 0,
    confirmedNew: 0,
    confirmedPrev: 0,
    deaths: 0,
    deathsNew: 0,
    recovered: 0,
    recoveredNew: 0,
  }];

  pDataset.push(...Object.keys(dataset).map((d, i) => {
    const values = dataset[d][dataset[d].length - 1];

    pDataset[0].confirmed += values.confirmed_total;
    pDataset[0].confirmedNew += values.confirmed_daily;
    pDataset[0].deaths += values.deaths_total;
    pDataset[0].deathsNew += values.deaths_daily;
    pDataset[0].recovered += values.recovered_total;
    pDataset[0].recoveredNew += values.recovered_daily;

    if (i < dataset[d].length - 1) {
      pDataset[0].confirmedPrev += values.confirmed_total;
    }

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
  }));

  return pDataset;
}