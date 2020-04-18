import React, { useRef, useEffect } from 'react';

import * as d3 from 'd3';
import { isEqual } from 'lodash';
import { getTooltipX, countryLabel, translate } from '../../utils/utils';


function BarChart(props) {
  const svgRef = useRef();
  const t = d3.transition().duration(250);
  const width = props.dimensions.width;
  const height = width / 6;
  const margin = {top: 10, right: 0, bottom: 40, left: 30};
  const w = width - (margin.left + margin.right);
  const h = height - (margin.top + margin.bottom);


  useEffect(() => {
    const { name, dataset, color, maxY, show } = props;
    const svg = d3.select(svgRef.current);
    const main = svg.select('.main');
    const tooltip = d3.select(`.${name}-tooltip`);
    const dateFormat = d3.timeFormat('%d-%m-%Y');

    // scale domains
    const xScale = d3.scaleBand()
      .range([0, w])
      .padding(0.2)
      .domain(dataset.map(d => d.date));

    const yScale = d3.scaleLinear()
      .range([h, 0])
      .domain([0, maxY]);

    // grids/axes
    main.select('.xaxis').call(d3.axisBottom(xScale)
      .tickSize(5)
      .tickFormat(d3.timeFormat('%-d/%-m')))
    .selectAll('text')
      .attr('class', 'xaxis count')
      .attr('text-anchor', 'start')
      .attr('pointer-events', 'none')
      .attr("y", -2)
      .attr("x", 6)
      .attr('transform', 'rotate(90)');

    main.select('.ygrid').transition(t).call(d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-w)
      .tickFormat(d3.format(".2s")))
    .selectAll('line')
      .attr('stroke-width', .33)
      .attr('pointer-events', 'none');

    // bars
    const rects = main.selectAll('rect.bar')
      .data(dataset, d => d.date);

    rects.exit()
      .attr('fill', 'red')
      .transition(t)
      .attr('y', yScale(0))
      .attr('height', 0)
      .remove();

    rects.enter()
      .append('rect')
      .attr('class', 'bar')
      .attr('fill', 'grey')
      .attr('x', d => xScale(d.date))
      .attr('y', yScale(0))
      .attr('width', xScale.bandwidth)
      .attr('height', 0)
    .merge(rects)
      .transition(t)
      .attr('x', d => xScale(d.date))
      .attr('y', d => yScale(d.value))
      .attr('width', xScale.bandwidth)
      .attr('height', d => h - yScale(d.value))
      .attr('fill', color)
      .attr('fill-opacity', 1)
      .attr('pointer-events', 'none');


    // INTERACTIVITY FUNCTIONS
    main.selectAll('.mainoverlay')
      .on('mouseover', () => barMouseOver())
      .on('mouseout', () => barMouseOut())
      .on('mousemove', () => barMouseMove());

    // overlay mouse functions: show/hide and move line and dots
    const barMouseOver = () => { tooltip.transition(t => ts).style('opacity', 1); };
    const barMouseOut = () => { tooltip.transition(t => ts).style('opacity', 0); };

    const barMouseMove = () => {
      const x = d3.mouse(d3.select('.mainoverlay').node())[0];
      const eachBand = xScale.step();
      const i = Math.floor(x / eachBand);
      const d = dataset[i < dataset.length ? i : dataset.length - 1];

      tooltip
        .html(`
          <div class="tooltip-date">
            ${dateFormat(d.date)}
          </div>
          <div class="tooltip-content mt-xs">
            <table class="tooltip-table">
              <tr>
                <td><strong style="color:${color}">${countryLabel(name)}</strong></td>
                <td class="text-right">${d.value}</td>
              </tr>
            </table>
          </div>
          <div class="tooltip-footer">
            ${translate(show)}
          </div>
        `)
        .style('left', `${getTooltipX(
          d3.event.clientX,
          window.innerWidth,
          margin.left
        )}px`)
        .style('top', `${d3.event.clientY + 5}px`);
    };

  }, [props.dataset, props.maxY, props.dimensions]);

  console.log(`BarChart [${props.country}] r (${width}x${parseInt(height)})`);


  return (
    <>
      <svg ref={svgRef} height={height} width={width}>
        <g className="main" transform={`translate(${margin.left}, ${margin.top})`}>
          <rect className='mainoverlay' height={h} width={w} fill="white" />
          <g className="xaxis" transform={`translate(0, ${h})`} />
          <g className="ygrid" />
        </g>
      </svg>
      <div
        className={`${props.name}-tooltip tooltip tooltip-narrow`}
        style={{'opacity': 0}}
      />
    </>
  );
}


function areEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}


export default React.memo(BarChart, areEqual);
