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
    'confirmed_pm_total',
    'confirmed_pm_daily',
    'deaths_pm_total',
    'deaths_pm_daily',
    'tests_total',
    'tests_daily',
    'tests_pt_total',
    'tests_pt_daily',
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
// Has to calculate world recovered, as it comes from JHU.
//
export function prepareDataList(dataset) {
  let worldRecoveredTotal = 0;
  let worldRecoveredDaily = 0;

  const preparedDataList = Object.keys(dataset)
    .map(d => {
      const data = { ...dataset[d][dataset[d].length - 1] };
      const prev = dataset[d][dataset[d].length - 2];

      data['country'] = d;
      data['growth'] = data.confirmed_daily / prev.confirmed_total * 100;

      if (data.recovered_total === 0) {
        data.recovered_total = prev.recovered_total;
        data.recovered_daily = prev.recovered_daily;
      }

      worldRecoveredTotal += data.recovered_total;
      worldRecoveredDaily += data.recovered_daily;

      return data;
    })
    .sort((a, b) => b.confirmed_total - a.confirmed_total);

  const world = preparedDataList.find(c => c.country === 'World');
  world.recovered_total = worldRecoveredTotal;
  world.recovered_daily = worldRecoveredDaily;


  return preparedDataList;
}
