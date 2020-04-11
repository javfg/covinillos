import * as d3 from 'd3';

import { Config } from './config';

/*
 * Calculate chart width.
 *
 * The chart width will be either:
 * 1. If window is smaller than chart minimum size:
 *      window size
 * 2. If window is bigger than chart minimum size:
 *      window size / number of charts in that row
 *
 * (It also keeps in account 1 pixel per chart per row)
 */
export const calcChartDimensions = function(heightDivisor, widthDivisor) {
  const windowWidth = document.body.clientWidth - 15;
  let width = windowWidth;

  if (windowWidth >= (Config.chartSize + widthDivisor)) {
    width = parseInt((windowWidth - widthDivisor) / widthDivisor);
  }

  const height = parseInt(width / heightDivisor);

  return { height, width };
};


export const calculateMaxY = function(dataset, selection, data, type) {
  return Math.max(
    ...Object.keys(dataset)
      .filter(cn => selection.includes(cn))
      .map(cn => dataset[cn].map(c => c[`${data}_${type}`]))
      .flat()
  );
};


const getScrollbarWidth = () => window.innerWidth - document.documentElement.clientWidth;

export const clean = (str) => str.replace(/\s/g, '').toLowerCase();

export const calculateTooltipX = function(mouseX, windowWidth, offset) {
  const mouseOffset = 15;
  const maxX = windowWidth - offset - getScrollbarWidth() - mouseOffset;

  return mouseX + Config.tooltipWidth < maxX ?
    mouseX + mouseOffset
  :
    mouseX - Config.tooltipWidth - offset - mouseOffset;
};


export const calculateTooltipY = function(mouseY, windowHeight, offset) {
  const mouseOffset = 15;
  const maxY = windowHeight - offset - getScrollbarWidth() - mouseOffset;

  return Config.tooltipHeight < maxY ?
  mouseY + mouseOffset
:
  mouseY - Config.tooltipHeight - offset - mouseOffset;
};


export const monthToPixels = function(timeScale) {
  return timeScale(d3.timeMonth.offset(new Date(), 1)) - timeScale(new Date());
}

export const dayToPixels = function(timeScale) {
  return timeScale(d3.timeDay.offset(new Date(), 1)) - timeScale(new Date());
}

export const getShortDayName = function(d) {
  return ['S', 'M', 'T', 'W', 'R', 'F', 'U'][d.getDay()];
}