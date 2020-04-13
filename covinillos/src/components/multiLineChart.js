import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { isEqual } from 'lodash';

import {
  clean,
  getTooltipX,
  monthToPixels,
  dayToPixels,
  setTime,
} from '../utils/utils';


function MultiLineChart(props) {
  const svgRef = useRef();
  const tl = d3.transition().duration(250);
  const ts = d3.transition().duration(100);
  const width = props.dimensions.width;
  const height = width / 4;
  const margin = {top: 20, right: 20, bottom: 40, left: 40};
  const w = width - (margin.left + margin.right);
  const h = height - (margin.top + margin.bottom);


  useEffect(() => {
    const { dataset, maxY } = props;
    const svg = d3.select(svgRef.current);
    const main = svg.select('.main');
    const focus = main.select('.focus');
    const dateRange = d3.extent(dataset[0].values, d => d.date);
    const dateFormat = d3.timeFormat('%e-%m-%Y');


    // scale domains
    const xScale = d3.scaleTime().range([0, w]).domain(dateRange);
    const yScale = d3.scaleLinear().range([h, 0]).domain([0, maxY]);


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

    main.select('.ygrid').transition(t => tl).call(d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-w)
      .tickFormat(d3.format('.2s')))
    .selectAll('line')
      .attr('stroke-width', .33);


    // add mouse focus groups
    const focusAll = focus.selectAll('.focuscircle')
      .data(dataset, d => d.country);

    focusAll.exit().remove();

    const focusGroups = focusAll.enter().append('g')
      .attr('class', 'focusgroup')
      .attr('pointer-events', 'none');

    focusGroups.append('circle')
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
      .x(d => xScale(d.date))
      .y(d => yScale(d.value));

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
      .on('mouseout', d => eventDotMouseOut(d))
      .attr('r', 0)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      // update event dots for countries alredy there
    .merge(eventDots)
      .transition(t => tl)
      .attr('r', 4.5)
      .attr('cx', d => xScale(d.date))
      .attr('cy', d => yScale(d.value))
      .attr('opacity', 1);


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
      const { name, dataset } = props;
      const x = setTime(xScale.invert(d3.event.x - margin.left - 15), 11, 59);
      const bisectDate = d3.bisector(d => d.date).left;
      const i = bisectDate(dataset[0].values, x, 1);
      const dataAtX = dataset.map(country => ({
        country: country.country,
        color: country.color,
        value: country.values[i].value,
      }));

      focus.select('line.focusline')
        .attr('x1', xScale(x))
        .attr('x2', xScale(x))
        .attr('y1', 0)
        .attr('y2', h);

      focus.selectAll('.focusgroup')
        .data(dataset, d => d.country)
        .attr(
          'transform',
          d => `translate (${xScale(x)}, ${yScale(d.values[i].value)})`
        );

      d3.select(`.${name}-tooltip`)
      .html(
        '<div class="tooltip-date">' +
          dateFormat(dataset[0].values[i].date) +
        '</div>' +
        '<div class="tooltip-content mt-xs"><table class="tooltip-table">' +
        dataAtX.sort((a, b) => b.value - a.value).map(c =>
          `<tr>
            <td><strong style="color:${c.color}"}>${c.country}</strong></td>
            <td class="text-right">${c.value}</td>
          </tr>`
        ).join('') + '</table></div>'
      )
      .transition().duration(25)
      .style('opacity', .85)
      .style('left', `${getTooltipX(
        d3.event.pageX,
        window.innerWidth,
        margin.left
      )}px`)
      .style('top', `${d3.event.pageY + 5}px`);
    };


    // event dot mouse over function: show tooltip and color event dot
    const eventDotMouseOver = d => {
      const { name, showType, showData } = props;

      d3.select(d3.event.target)
        .transition(t => ts).attr('fill', d => d.color);

      d3.select(`.${name}-eventstooltip`)
        .style('top', `${d3.event.pageY + 5}px`)
        .style('left', `${getTooltipX(
          d3.event.pageX,
          window.innerWidth
        )}px`)
        .html(
          '<div class="tooltip-date">' +
            dateFormat(d.date) +
          '</div><div class="tooltip-content mt-xs"><div class="mb-xs">' +
          `<strong style="color:${d.color}" class="event"}>
            ${d.country}
          </strong>` +
          `<small> at ${d.value} ${showType} ${showData}</small></div>` +
          d.captions.map(c => `<div class="event">${c}</div>`).join('') +
          '</div>'
        )
        .transition(t => ts).style('opacity', .85);
    }


    // event dot mouse out function: hide tooltip
    const eventDotMouseOut = d => {
      d3.selectAll('.eventdot')
        .transition(t => tl)
        .attr('fill', 'white');

      d3.select(`.${props.name}-eventstooltip`)
        .transition(t => tl)
        .style('opacity', 0);
    };

  }, [props.dataset, props.maxY, props.dimensions]);

  console.log(`MultiLineChart rerender (${w}x${h})`);


  return (
    <>
      <svg ref={svgRef} height={height} width={width}>
        <g
          className="main"
          transform={`translate(${margin.left}, ${margin.top})`}
        >
          <rect className='overlay' height={h} width={w} fill="white" />
          <g className="xaxismonth" transform={`translate(0, ${h})`} />
          <g className="xaxisweek" transform={`translate(0, ${h})`} />
          <g className="xaxisday" transform={`translate(0, ${h})`} />
          <g className="ygrid" />
          <g className="focus">
            <line
              className="focusline"
              opacity={.8}
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
        className={`${props.name}-eventstooltip tooltip`}
        style={{'opacity': 0}}
      />
    </>
  );
}

function areEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}


export default React.memo(MultiLineChart, areEqual);
