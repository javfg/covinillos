import * as d3 from 'd3';

import { countryMapping } from "./countryMapping";
import config from '../config';


//
// Chart utils.
//
// calculate common max y for data used in singlecountrycharts
export function getMaxY(dataset, selection, show) {
  return Math.max(
    ...Object.keys(dataset)
      .filter(cn => selection.includes(cn))
      .map(cn => dataset[cn].map(c => c[show]))
      .flat(),
  );
}

// calculate tooltip position x coordinate
export function getTooltipX(mouseX, windowWidth, offset = 0, mid = false, wide = false) {
  const mouseOffset = 15;
  const maxX = windowWidth - offset;
  const tooltipWidth = wide
    ? config.tooltipWideWidth
    : config.tooltipWidth;

  const result = mouseX + config.tooltipWidth < maxX
    ? mouseX + mouseOffset
    : mouseX - tooltipWidth - mouseOffset;

  return mid ? result - tooltipWidth / 2 : result;
}

// multicountrychart x axis helpers
export function monthToPixels(timeScale) {
  return timeScale(d3.timeMonth.offset(new Date(), 1)) - timeScale(new Date());
}

export function dayToPixels(timeScale) {
  return timeScale(d3.timeDay.offset(new Date(), 1)) - timeScale(new Date());
}

// get event classes from a chart
export const getEventClasses = d => d.items.map(i => 'event-' + i.group);

// clean strings: convert to lowercase and remove spaces
export const cleanStr = (str) => str.replace(/\s/g, '').toLowerCase();

// date formats for charts
export const dateFormatLong = d3.timeFormat('%Y-%m-%d (%a)');
export const dateFormat = d3.timeFormat('%Y-%m-%d');

// remove falsy values from a list
export const stringList = strList => strList.filter(e => !!e).join(',');

// converts countries to unicode flags
export function countryToFlag(country) {
  const isoCode = countryMapping[country];

  // ships
  if (typeof isoCode === 'number') {
    return String.fromCodePoint('128674');
  }

  // world
  if (isoCode === 'W') {
    return String.fromCodePoint('127758');
  }

  return typeof String.fromCodePoint !== 'undefined'
    ? isoCode
      .toUpperCase()
      .replace(/./g, (char) => String.fromCodePoint(char.charCodeAt(0) + 127397))
    : isoCode;
}

// generates country label with a flag
export const countryLabel = country => `${countryToFlag(country)} ${country}`;


//
// Time utils.
//
// set time in a date object
export function setTime(date, hours, minutes = 0, seconds = 0) {
  const newDate = new Date(date);
  newDate.setHours(hours);
  newDate.setMinutes(minutes);
  newDate.setSeconds(seconds);

  return newDate;
}

// Add days in Date proto.
// https://stackoverflow.com/questions/563406/add-days-to-javascript-date
Date.prototype.addDays = function addDays(d) { return new Date(this.valueOf() + 864E5 * d); };


//
// Misc utils.
//
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

// translate dataset keys to strings
const translateMap = {
  confirmed_total: 'confirmed cases',
  deaths_total: 'total deaths',
  recovered_total: 'total recovered',
  confirmed_daily: 'daily confirmed cases',
  deaths_daily: 'daily deaths',
  recovered_daily: 'daily recovered',
};

export const translate = str => translateMap[str];

// encode suggest event form data
export const encode = data => Object.keys(data)
  .map(key => encodeURIComponent(key) + "=" + encodeURIComponent(data[key]))
  .join("&");


export const exists = val => typeof val !== 'undefined' && val !== null && val !== undefined;
