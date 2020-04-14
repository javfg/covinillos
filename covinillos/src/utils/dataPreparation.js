import { setTime, longest } from './utils';


export const prepareMultiCountry = (dataset, colorMap, selection, show) => {
  const pDataset = [];

  selection.forEach(country => {
    const values = [];
    const events = [];
    const color = colorMap[country];

    dataset[country].forEach(day => {
      const date = setTime(day.date, 12);
      const value = day[show];
      const captions = day.events.map(e => e.description);

      values.push({ date, value });
      if (captions.length) {
        events.push({ country, color, date, captions, value });
      }
    });

    pDataset.push({ country, color, values, events });
  });

  return pDataset;
};


export const prepareMultiCountry100 = (dataset, colorMap, selection, show) => {
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

  const dataLength = pDataset[longest(pDataset, 'values')].values.length;

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
};
