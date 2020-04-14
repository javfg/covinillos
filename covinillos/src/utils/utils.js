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