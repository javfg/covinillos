import React from 'react';
import * as d3 from 'd3';

import {
  calcChartDimensions,
  calculateTooltipX,
  clean,
  monthToPixels,
  dayToPixels,
  setTime,
} from '../utils/utils';


class TimeSeriesChart extends React.Component {
  constructor(props) {
    super(props);

    this.updateMarginTransform();
    this.updateScales();
  }

  // globals
  heightDivisor = 3;
  widthDivisor = 1;
  dateFormat = d3.timeFormat('%e-%m-%Y');

  state = {
    ...calcChartDimensions(this.heightDivisor, this.widthDivisor),
  };

  // chart
  h = undefined;
  w = undefined;
  margin = {top: 20, right: 20, bottom: 40, left: 40};
  svg = undefined;
  main = undefined;
  focus = undefined;
  xScale = undefined;
  yScale = undefined;
  xAxisMonthGroup = undefined;
  xAxisWeekGroup = undefined;
  xAxisDayGroup = undefined;
  yGridGroup = undefined;

  // transitions
  st = d3.transition().duration(125);
  lt = d3.transition().duration(250);


  // lifecycle functions
  componentDidMount() {
    this.createChart();
    this.updateChart();
    this.resizeListener = window.addEventListener('resize', this.updateChartSize);
  }

  componentDidUpdate() {
    this.updateChart();
  }

  componentWillUnmount() {
    window.removeEventListener('resize', this.resizeListener);
  }


  // utils
  updateChartSize = () => {
    this.setState(
      { ...calcChartDimensions(this.heightDivisor, this.widthDivisor) },
      () => {
        this.updateMarginTransform();
        this.updateScales();
        this.createChart();
        this.updateChart();
      }
    );
  };

  updateMarginTransform = () => {
    const {
      state: { height, width },
      margin
    } = this;

    this.h = height - (margin.top + margin.bottom);
    this.w = width - (margin.left + margin.right);
  };


  // chart drawing
  createChart() {
    const {
      props: { name },
      st, lt, margin, mouseMove
    } = this;

    this.svg = d3.select(this.node);
    this.svg.selectAll('*').remove();

    this.main = this.svg.append('g')
      .attr('class', 'main')
      .attr('transform', `translate(${margin.left}, ${margin.top})`);

    this.main.append('rect')
      .attr('class', 'overlay')
      .attr('height', this.h)
      .attr('width', this.w)
      .attr('fill', 'white')
      .attr('pointer-events', 'all')
      .on('mouseover', () => this.focus
        .transition(t => st)
        .style('opacity', 1)
      )
      .on('mouseout', () => {
        this.focus
          .transition(t => st)
          .style('opacity', 0);

        d3.select(`.${name}-tooltip`)
          .transition(t => lt).style('opacity', 0);
      })
      .on('mousemove', mouseMove);

    this.focus = this.main.append('g')
      .attr('class', 'focus');

    this.focus.append('line')
      .attr('class', 'focusline')
      .attr('opacity', .8)
      .attr('stroke', 'black')
      .attr('stroke-width', '.1px')
      .attr('pointer-events', 'none');

    this.xAxisMonthGroup = this.main.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.h})`);

    this.xAxisWeekGroup = this.main.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.h})`);

    this.xAxisDayGroup = this.main.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.h})`);

    this.yGridGroup = this.main.append('g')
      .attr('class', 'grid');
  }


  // chart resizing
  updateScales() {
    this.xScale = d3.scaleTime()
      .range([0, this.w]);

    this.yScale = d3.scaleLinear()
      .range([this.h, 0]);
  }


  // chart updating
  updateChart() {
    const {
      w,
      main,
      yScale,
      xScale,
      xAxisDayGroup,
      xAxisWeekGroup,
      xAxisMonthGroup,
      yGridGroup,
      lt,
      eventDotMouseOver,
      eventDotMouseOut,
      props: { dataset, maxY },
    } = this;

    const dateRange = d3.extent(dataset[0].values, d => d.date);

    // update scale domains
    xScale.domain(dateRange);
    yScale.domain([0, maxY]);

    // update grid/axes
    xAxisMonthGroup.call(d3.axisBottom(xScale)
      .ticks(d3.timeMonth, 1)
      .tickSize(15)
      .tickFormat(d3.timeFormat('%B')))
    .selectAll('text')
    .attr('class', 'xaxis month')
      .attr('text-anchor', 'center')
      .attr('pointer-events', 'none')
      .attr('transform', `translate(${monthToPixels(xScale) / 2}, 6)`);

    xAxisWeekGroup.call(d3.axisBottom(xScale)
      .ticks(d3.timeWeek, 1)
      .tickSize(12)
      .tickFormat(''));

    xAxisDayGroup.call(d3.axisBottom(xScale)
      .ticks(d3.timeDay, 1)
      .tickSize(5)
      .tickFormat(d3.timeFormat('%-d')))
    .selectAll('text')
      .attr('class', 'xaxis day')
      .attr('text-anchor', 'center')
      .attr('pointer-events', 'none')
      .attr('transform', `translate(${dayToPixels(xScale) / 2}, -4)`);

    yGridGroup.transition(t => lt).call(d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-w)
      .tickFormat(d3.format('.2s')))
      .selectAll('line')
      .attr('stroke-width', .33);

    // add mouse focus groups
    const focus = this.focus.selectAll('.focuscircle').data(dataset, d => d.country);

    focus.exit().remove();

    const focusGroups = focus.enter().append('g')
      .attr('class', 'focusgroup')
      .attr('pointer-events', 'none');

    focusGroups.append('circle')
      .attr('class', 'focuscircle')
      .attr('r', 7)
      .attr('stroke', d => d.color)
      .attr('fill', 'none')
      .attr('stroke-width', '1.5px');

    // line drawing
    const dataLine = d3.line()
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));


    // DATA DRAWING

    // 1. GROUPS
    // add event groups for each country
    const countryAll = main.selectAll('g.countrygroup')
      .data(dataset, d => d.country);

    // remove event groups for countries that got unchecked
    countryAll.exit().remove();

    // add groups for countries that arrived
    const countryEnter = countryAll.enter()
      .append('g')
      .attr('class', d => `countrygroup countrygroup-${clean(d.country)}`);


    // 2. PATHS
    // add paths for countries that arrived
    countryEnter.append('path')
      .attr('class', 'countryline')
      .attr('id', d => `${clean(d.country)}-path`)
      .style('stroke', d => d.color)
      .style('stroke-width', '1.66px')
      .style('fill', 'none')
      .attr('d', d => dataLine(d.values))
      .attr('pointer-events', 'none');

    // update paths for countries that are already there when data changes
    countryAll.selectAll('.countryline')
      .data(dataset, d => d.country)
      .transition().duration(200)
      .attr('d', d => dataLine(d.values));


    // 3. EVENT DOTS
    // select country groups and match data from events
    const eventDots = main.selectAll('g.countrygroup')
      .data(dataset, d => d.country)
      .selectAll('.eventdot')
      .data(d => d.events);

    // remove event dots for countries that left
    eventDots.exit().remove()

    // add event dots for countries that arrived
    eventDots.enter().append('circle')
      .attr('class', 'eventdot')
      .attr('stroke-width', '1.66px')
      .attr('stroke', d => d.color)
      .attr('fill', 'white')
      .attr('opacity', 0)
      .on('mouseover', d => eventDotMouseOver(d))
      .on('mouseout', eventDotMouseOut)
      .attr('r', 0)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      // update event dots for countries that are already tehre when data changes
      .merge(eventDots)
      .transition(t => lt)
      .attr('r', 4.5)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('opacity', 1);
  }


  // event dot mouse over function: show tooltip and color event dot
  eventDotMouseOver = d => {
    const {
      st, dateFormat,
      props: { name, showType, showData }
    } = this;

    d3.select(d3.event.target)
      .transition(t => st).attr('fill', d => d.color);

    d3.select(`.${name}-eventstooltip`)
      .style('top', `${d3.event.pageY + 5}px`)
      .style('left', `${calculateTooltipX(
        d3.event.pageX,
        window.innerWidth
      )}px`)
      .html(
        '<div class="tooltip-date">' +
          dateFormat(d.date) +
        '</div><div class="tooltip-content mt-xs"><div class="mb-xs">' +
        `<strong style="color:${d.color}" class="event"}>${d.country}</strong>` +
        `<small> at ${d.value} ${showType} ${showData}</small></div>` +
        d.captions.map(c => `<div class="event">${c}</div>`).join('') +
        '</div>'
      )
      .transition(t => st).style('opacity', .85);
  }


  // event dot mouse out function: hide tooltip
  eventDotMouseOut = d => {
    const { name } = this.props;

    d3.selectAll('.eventdot')
      .transition(t => lt).attr('fill', 'white');

    d3.select(`.${name}-eventstooltip`)
      .transition(t => lt).style('opacity', 0);
  }


  // tooltip interactivity
  mouseMove = () => {
    const {
      xScale, yScale, margin, dateFormat,
      props: { dataset, name },
    } = this;

    const mouseX = d3.mouse(this.node)[0] - margin.left;
    const x0 = setTime(xScale.invert(mouseX), 11, 59, 59);
    const bisectDate = d3.bisector(d => d.date).right;
    const i = bisectDate(dataset[0].values, x0 - margin.left, 0);
    const tooltip = d3.select(`.${name}-tooltip`);

    const dataAtX = dataset.map(country => ({
      country: country.country,
      color: country.color,
      value: country.values[i].value,
    }));

    this.focus.select('line.focusline')
      .attr('x1', this.xScale(x0))
      .attr('x2', this.xScale(x0))
      .attr('y1', 0)
      .attr('y2', this.h);

    const focusGroups = this.focus.selectAll('.focusgroup')
      .data(dataset, d => d.country);

    focusGroups
      .attr('transform', d => `translate (${xScale(x0)}, ${yScale(d.values[i].value)})`);

    tooltip.style('opacity', .85);
    tooltip.html(
      '<div class="tooltip-date">' + dateFormat(dataset[0].values[i].date) + '</div>' +
      '<div class="tooltip-content mt-xs"><table class="tooltip-table">' +
      dataAtX
        .sort((a, b) => b.value - a.value)
        .map(c =>
          `<tr>
              <td>
                <strong style="color:${c.color}"}>${c.country}</strong>
              </td>
              <td class="text-right">${c.value}</td>
            </tr>
          `
        ).join('') + '</table></div>'
    )
    .transition().duration(25)
    .style('left', `${calculateTooltipX(
      d3.event.pageX,
      window.innerWidth,
      this.margin.left
    )}px`)
    .style('top', `${d3.event.pageY + 5}px`);
  };


  render() {
    const {
      props: { name, country },
      state: { height, width },
    } = this;

    console.log(`TimeSeriesChart [${country}] rerender (${width}x${height})`);

    return (
      <>
        <svg
          ref={node => this.node = node}
          height={height}
          width={width}
        />
        <div
          className={`${name}-tooltip tooltip tooltip-narrow`}
          style={{'opacity': 0}}
        />
        <div
          className={`${name}-eventstooltip tooltip`}
          style={{'opacity': 0}}
        />
      </>
    );
   }
}

export default TimeSeriesChart;
