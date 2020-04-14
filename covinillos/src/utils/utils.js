import * as d3 from 'd3';

import { countryMapping } from "./countryMapping";

import config from '../config';


export const getMaxY = function(dataset, selection, show) {
  return Math.max(
    ...Object.keys(dataset)
      .filter(cn => selection.includes(cn))
      .map(cn => dataset[cn].map(c => c[show]))
      .flat()
  );
};


export const cleanStr = (str) => str.replace(/\s/g, '').toLowerCase();


export const getTooltipX = function(mouseX, windowWidth, offset = 0) {
  const mouseOffset = 15;
  const maxX = windowWidth - offset;

  return mouseX + config.tooltipWidth < maxX ?
    mouseX + mouseOffset
  :
    mouseX - config.tooltipWidth - mouseOffset;
};


export const monthToPixels = function(timeScale) {
  return timeScale(d3.timeMonth.offset(new Date(), 1)) - timeScale(new Date());
};

export const dayToPixels = function(timeScale) {
  return timeScale(d3.timeDay.offset(new Date(), 1)) - timeScale(new Date());
};

export const setTime = function(date, hours, minutes = 0, seconds = 0) {
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);

  return newDate;
};


export const countryToFlag = function(country) {
  const isoCode = countryMapping[country];

  // Ships.
  if (typeof isoCode === "number") {
    return String.fromCodePoint('128674');
  }

  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
        .toUpperCase()
        .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

// Add days in Date proto.
// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
Date.prototype.addDays = function(d){return new Date(this.valueOf()+864E5*d);};


// finds the index of the longest array in a dataset using a key
export const longest = (dataset, field) => {
  let maxLength = 0;
  let indexOfLongest = 0;

  dataset.forEach((d, i) => {
    if (d[field].length > maxLength) {
      maxLength = d[field].length;
      indexOfLongest = i;
    }
  });

  return indexOfLongest;
};


const translate_map = {
  confirmed_total: 'confirmed cases',
  deaths_total: 'total deaths',
  recovered_total: 'total recovered',
  confirmed_daily: 'daily confirmed cases',
  deaths_daily: 'daily deaths',
  recovered_daily: 'daily recovered',
};

export const translate = (str) => translate_map[str];
