import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { isEqual } from 'lodash';

import {
  cleanStr,
  getTooltipX,
  monthToPixels,
  dayToPixels,
  setTime,
  getEventClasses,
  translate,
  stringList,
  countryLabel,
} from '../../utils/utils';
import config from '../../config';


function MultiLineChart(props) {
  const svgRef = useRef();
  const tl = d3.transition().duration(config.transitionLong);
  const ts = d3.transition().duration(config.transitionShort);
  const td = d3.transition().duration(config.transitionData);
  const width = props.dimensions.width;
  const height = Math.max(width / 7, 250);
  const margin = {top: 10, right: 0, bottom: 40, left: 30};
  const w = width - (margin.left + margin.right);
  const h = height - (margin.top + margin.bottom);

  useEffect(() => {
    const { dataset, maxY, type, show } = props;
    const svg = d3.select(svgRef.current);
    const main = svg.select('.main');
    const focus = main.select('.focus');

    // exit if no data
    if (!dataset.length) return;

    const dateRange = d3.extent(dataset[0].values, d => d.date);
    const dateFormat = d3.timeFormat('%d-%m-%Y');


    // scale domains
    const xScale = d3.scaleTime().range([0, w]).domain(dateRange);
    const yScale = d3.scaleLinear().range([h, 0]).domain([0, maxY]);

    // this group contains all country lines and is below event dots (used in drawData 1)
    const CountryLinesGroup = main.select('.allcountrylines');

    // this group contains all event dots and is above the country lines (used in drawData 2)
    const countryEventsGroup = main.select('.allcountryevents');

    // brush
    const xBrush = d3.brushX().extent([[0, 0], [width, height]]).on("end", () => brushEnd());

    CountryLinesGroup.select('.brush').remove();
    CountryLinesGroup.append('g')
      .attr('class', 'brush')
      .call(xBrush);

    CountryLinesGroup.on('dblclick', () => resetZoom());


    // DRAW AXES
    const drawAxes = () => {
      // grids/axes
      main.select('.xaxismonth').call(d3.axisBottom(xScale)
        .ticks(d3.timeMonth, 1)
        .tickSize(15)
        .tickFormat(d3.timeFormat('%B')))
      .selectAll('text')
        .attr('class', 'xaxis month')
        .attr('text-anchor', 'center')
        .attr('pointer-events', 'none')
        .attr('transform', `translate(${monthToPixels(xScale) / 2}, 6)`);

      if (type === 'normal') {
        main.selectAll('.x100').transition(t => tl).attr('opacity', 0);
        main.selectAll('.xnormal').transition(t => tl).attr('opacity', 1);

        main.select('.xaxisweek').call(d3.axisBottom(xScale)
          .ticks(d3.timeWeek, 1)
          .tickSize(12)
          .tickFormat(''));

        main.select('.xaxisday').call(d3.axisBottom(xScale)
          .ticks(d3.timeDay, 1)
          .tickSize(5)
          .tickFormat(d3.timeFormat('%-d')))
        .selectAll('text')
          .attr('class', 'xaxis day')
          .attr('text-anchor', 'center')
          .attr('pointer-events', 'none')
          .attr('transform', `translate(${dayToPixels(xScale) / 2}, -4)`);
      }

      if (type === 'startAt100') {
        main.selectAll('.xnormal').transition(t => tl).attr('opacity', 0);
        main.selectAll('.x100').transition(t => tl).attr('opacity', 1);

        main.select('.xaxiscount').call(d3.axisBottom(xScale)
          .ticks(d3.timeDay, 1)
          .tickSize(5)
          .tickFormat((d, i) => i))
        .selectAll('text')
          .attr('class', 'xaxis day')
          .attr('text-anchor', 'center')
          .attr('pointer-events', 'none')
          .attr('transform', `translate(${dayToPixels(xScale) / 2}, -4)`);
      }

      main.select('.ygrid').transition(t => tl).call(d3.axisLeft(yScale)
        .ticks(10, 's')
        .tickSize(-w)
        .tickFormat(d3.format('.2s')))
      .selectAll('line')
        .attr('stroke-width', .33)
        .attr('pointer-events', 'none');

      main.selectAll('.domain').remove();
      main.select('.ygridlegend').remove();

      // timeout to wait for transition
      setTimeout(() => {
        main.select('.ygrid').select('.tick:last-of-type text')
          .clone()
            .attr('class', 'ygridlegend')
            .attr('x', 3)
            .attr('text-anchor', 'start')
            .attr('font-weight', 'bold')
            .style('text-transform', 'uppercase')
            .attr('opacity', 0)
            .transition(t => tl)
            .attr('opacity', 1)
            .text(translate(show))
      }, config.transitionLong);
    };

    // DRAW DATA
    const drawData = () => {
      // add mouse focus groups
      const focusAll = focus.selectAll('.focusgroup')
        .data(dataset, d => d.country);

      focusAll.exit().remove();

      focusAll.enter().append('g')
        .attr('class', 'focusgroup')
        .attr('pointer-events', 'none')
      .append('circle')
        .attr('class', 'focuscircle')
        .attr('r', 7)
        .attr('stroke', d => d.color)
        .attr('fill', 'none')
        .attr('stroke-width', '1.5px');

      // overlay interactivity functions
      svg.select('.overlay')
        .on('mouseover', () => overlayMouseOver())
        .on('mouseout', () => overlayMouseOut())
        .on('mousemove', () => overlayMouseMove());


      // DATA DRAWING
      // line definition
      const dataLine = d3.line()
        .defined(d => d.value !== null)
        .x(d => xScale(d.date))
        .y(d => yScale(d.value))

      // 1. GROUPS
      // add event groups for each country (in case we have to add something beside lines)
      const countryAll = CountryLinesGroup.selectAll('g.countryline')
        .data(dataset, d => d.country);

      // remove event groups for countries that got unchecked
      countryAll.exit().remove();

      // add groups for countries that arrived
      const countryEnter = countryAll.enter()
        .append('g')
        .attr('class', d => `countryline countryline-${cleanStr(d.country)}`);

      // 2. PATHS
      // add paths for countries that arrived
      countryEnter.append('path')
        .attr('class', 'countryline-path')
        .attr('id', d => `${cleanStr(d.country)}-path`)
        .style('stroke', d => d.color)
        .style('stroke-width', '2px')
        .style('fill', 'none')
        .attr('d', d => dataLine(d.values))
        .attr('pointer-events', 'none');

      // update paths for countries that are already there when data changes
      countryAll.selectAll('.countryline-path')
        .data(dataset, d => d.country)
        .transition(t => td)
        .attr('d', d => dataLine(d.values));


      // 3. EVENT DOTS
      // a group is created for each country's events
      const countryEventAll = countryEventsGroup.selectAll('g.countryevent')
        .data(dataset, d => d.country);

      // remove event groups for countries that got unchecked
      countryEventAll.exit().remove();

      // add groups for countries that arrived
      countryEventAll.enter()
        .append('g')
        .attr('class', d => `countryevent countryevent-${cleanStr(d.country)}`);

      const eventDots = main.selectAll('g.countryevent')
        .data(dataset, d => d.country)
        .selectAll('.eventdot')
        .data(d => d.events);

      // remove event dots for countries that left
      eventDots.exit().remove()

      // add event dots for countries that arrived
      eventDots.enter().append('circle')
        .attr('class', d => `eventdot ${getEventClasses(d).join(' ')}`)
        .attr('stroke-width', '1.66px')
        .attr('stroke', d => d.color)
        .attr('fill', 'white')
        .attr('opacity', 0)
        .attr('r', 0)
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.value))
        // update event dots for countries alredy there
      .merge(eventDots)
        .transition(t => td)
        .attr('r', 4.5)
        .attr('cx', d => xScale(d.date))
        .attr('cy', d => yScale(d.value))
        .attr('opacity', 1);

      main.selectAll('.eventdot')
        .on('mouseover', d => eventDotMouseOver(d))
        .on('mouseout', d => eventDotMouseOut(d))

      const eventTexts = main.selectAll('g.countryevent')
        .data(dataset, d => d.country)
        .selectAll('.eventdot-text')
        .data(d => d.events);

      eventTexts.exit().remove()

      eventTexts.enter().append('text')
        .attr('class', d => `eventdot-text ${getEventClasses(d).join(' ')}`)
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.value) + 4)
        .attr('text-anchor', 'middle')
        .attr('pointer-events', 'none')
        .attr('font-size', '.66rem')
      .merge(eventTexts)
        .transition(t => td)
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.value) + 4);
    };


    // PAINT THE CHART
    drawAxes();
    drawData();


    // INTERACTIVITY FUNCTIONS
    // overlay mouse functions: show/hide and move line and dots
    const overlayMouseOver = () => {
      focus.transition(t => ts).style('opacity', 1);
    };

    const overlayMouseOut = () => {
      focus.transition(t => ts).style('opacity', 0);

      d3.select(`.${props.name}-tooltip`)
        .transition(t => ts)
        .style('opacity', 0);
    };

    const overlayMouseMove = () => {
      const { name, dataset, type } = props;
      const mouseX = d3.mouse(d3.select('.mainoverlay').node())[0];
      const x = setTime(xScale.invert(mouseX), 11, 59);
      const bisectDate = d3.bisector(d => d.date).left;
      const i = bisectDate(dataset[0].values, x, 1);

      const dataAtX = dataset
        .map(c => ({
          country: c.country,
          color: c.color,
          value: c.values[i].value,
        }))
        .filter(c => c.value !== null)
        .sort((a, b) => b.value - a.value);

      focus.select('line.focusline')
        .attr('x1', xScale(x))
        .attr('x2', xScale(x))
        .attr('y1', 0)
        .attr('y2', h);

      focus.selectAll('.focusgroup')
        .data(dataset, d => d.country)
        .attr(
          'transform',
          d => {
            const y = d.values[i].value !== null ? yScale(d.values[i].value) : -50;
            return `translate (${xScale(x)}, ${y})`;
          }
        );

      d3.select(`.${name}-tooltip`)
      .html(`
        <div class="tooltip-date">
          ${type === 'normal' ? dateFormat(dataset[0].values[i].date) : 'Day ' + i}
        </div>
        <div class="tooltip-content mt-xs">
          <table class="tooltip-table">
            ` + dataAtX.map(c => `
              <tr>
                <td><strong style="color:${c.color}"}>${countryLabel(c.country)}</strong></td>
                <td class="text-right">${c.value}</td>
              </tr>
            `).join('') + `
          </table>
        </div>
        <div class="tooltip-footer">
          ${translate(show)}
        </div>
      `)
      .transition().duration(25)
      .style('opacity', 1)
      .style('left', `${getTooltipX(
        d3.event.clientX,
        window.innerWidth,
        margin.left
      )}px`)
      .style('top', `${d3.event.clientY + 5}px`);
    };


    // event dot mouse over function: show tooltip and color event dot
    const eventDotMouseOver = d => {
      const { name, show } = props;

      const tooltipX = `${getTooltipX(d3.event.pageX, window.innerWidth, 0, true, true)}px`;
      const tooltipY = `${svgRef.current.getBoundingClientRect().bottom - 25}px`;

      // get all countries data for that event group
      d3.select(d3.event.target)
        .transition(t => ts).attr('fill', d => d.color);

      let tooltipHtml = '';

      d.items.forEach((item, i) => {
        const eventCircles = d3.selectAll(`.eventdot.event-${item.group}`);
        const eventTexts = d3.selectAll(`.eventdot-text.event-${item.group}`);

        tooltipHtml += `
          <div class="d-flex border-dark mb-xxs">
            <div class="d-flex align-items-center px-md m-xxs bg-dark fg-light">
              <h1>${i + 1}</h1>
            </div>
            <div class="flex-grow-1">
              <div class="flex-grow-1">
                <span class="event p-xs d-block mt-xxs mr-xxs bg-danger fg-w text-center">
                  ${item.caption}
                </span>
              </div>
            <div>
              <table class="w-100">
                <tr class="bg-light font-75"">
                  <th class="text-light">Date</th>
                  <th class="text-light">Country</th>
                  <th class="text-light text-capitalize">${translate(show)}</th>
                </th>
                <tr>
                  <td><span class="text-bold">${dateFormat(d.date)}</span></td>
                  <td>
                    <strong style="color:${d.color}"}>
                      ${countryLabel(d.country)}
                    </strong>
                  </td>
                  <td class="text-right">${d.value}</td>
                </tr>
                <tr>
                  <td colspan="3" class="font-75">Other countries...</td>
                </tr>
        `;

        eventCircles
          .transition(t => ts)
          .attr('r', 9)
          .attr('fill', 'lightgrey');

        eventTexts
          .text(function(d) { return stringList([d3.select(this).text(), i + 1]); });

        const countriesData = eventCircles.data().map(d => d);

        tooltipHtml += countriesData
          .filter(c => c.country !== d.country)
          .sort((a, b) => a.date - b.date)
          .map(event => `
            <tr>
              <td><span class="text-bold">${dateFormat(event.date)}</span></td>
              <td>
                <strong style="color:${event.color}"}>
                  ${countryLabel(event.country)}
                </strong>
              </td>
              <td class="text-right">${event.value}</td>
            </tr>`).join('');
          tooltipHtml += '</table></div></div></div>';
      });

      d3.select(`.${name}-eventstooltip`)
        .style('left', tooltipX)
        .style('top', tooltipY)
        .html(tooltipHtml)
        .transition(t => ts).style('opacity', 1);
    }


    // event dot mouse out function: hide tooltip
    const eventDotMouseOut = d => {
      d3.selectAll('.eventdot')
        .transition(t => tl)
        .attr('r', 4.5)
        .attr('fill', 'white');

      d3.selectAll('.eventdot-text')
        .text('');

      d3.select(`.${props.name}-eventstooltip`)
        .transition(t => tl)
        .style('opacity', 0);
    };


    // brush: zooming
    const brushEnd = () => {
      const selection = d3.event.selection;
      if (!selection) return;

      xScale.domain([ xScale.invert(selection[0]), xScale.invert(selection[1]) ]);
      svg.select('.brush').call(xBrush.clear);

      // update axis and line position
      drawAxes();
      drawData();
    };

    // double click on chart area: reset zoom
    const resetZoom = () => {
      xScale.domain(dateRange);

      // update axis and line position
      drawAxes();
      drawData();
    }

    console.log(`MultiLineChart r (${width}x${parseInt(height)})`);

  }, [props.dataset, props.show, props.maxY, props.dimensions]);

  return (
    <>
      <svg ref={svgRef} height={height} width={width}>
        <g
          className="main"
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <g className="xaxismonth xnormal" transform={`translate(0, ${h})`} />
          <g className="xaxisweek xnormal" transform={`translate(0, ${h})`} />
          <g className="xaxisday xnormal" transform={`translate(0, ${h})`} />
          <g className="xaxiscount x100" transform={`translate(0, ${h})`} />
          <g className="allcountrylines" />
          <g className="allcountryevents" />
          <g className="ygrid" />
          <g className="focus" opacity={0}>
            <line
              className="focusline"
              opacity={1}
              stroke="black"
              strokeWidth=".1px"
              pointerEvents="none"
            />
          </g>
        </g>
      </svg>
      <div
        className={`${props.name}-tooltip tooltip tooltip-narrow`}
        style={{'opacity': 0}}
      />
      <div
        className={`${props.name}-eventstooltip tooltip tooltip-wide`}
        style={{'opacity': 0}}
      />
    </>
  );
}

function areEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}


export default React.memo(MultiLineChart, areEqual);
