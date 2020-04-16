import * as d3 from 'd3';

import { countryMapping } from "./countryMapping";

import config from '../config';


export function getMaxY(dataset, selection, show) {
  return Math.max(
    ...Object.keys(dataset)
      .filter(cn => selection.includes(cn))
      .map(cn => dataset[cn].map(c => c[show]))
      .flat(),
  );
}


export const cleanStr = (str) => str.replace(/\s/g, '').toLowerCase();


export function getTooltipX(mouseX, windowWidth, offset = 0, mid = false) {
  const mouseOffset = 15;
  const maxX = windowWidth - offset;

  const result = mouseX + config.tooltipWidth < maxX
    ? mouseX + mouseOffset
    : mouseX - config.tooltipWidth - mouseOffset;

  console.log('mid', mid);
  console.log('result', result);
  console.log('config.tooltipWidth', config.tooltipWidth / 2);




  return mid ? result - config.tooltipWidth / 2 : result;
}


export function monthToPixels(timeScale) {
  return timeScale(d3.timeMonth.offset(new Date(), 1)) - timeScale(new Date());
}

export function dayToPixels(timeScale) {
  return timeScale(d3.timeDay.offset(new Date(), 1)) - timeScale(new Date());
}

export function setTime(date, hours, minutes = 0, seconds = 0) {
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);

  return newDate;
}


export function countryToFlag(country) {
  const isoCode = countryMapping[country];

  // Ships.
  if (typeof isoCode === 'number') {
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
Date.prototype.addDays = function addDays(d) { return new Date(this.valueOf() + 864E5 * d); };


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


const translateMap = {
  confirmed_total: 'confirmed cases',
  deaths_total: 'total deaths',
  recovered_total: 'total recovered',
  confirmed_daily: 'daily confirmed cases',
  deaths_daily: 'daily deaths',
  recovered_daily: 'daily recovered',
};

export const translate = (str) => translateMap[str];
