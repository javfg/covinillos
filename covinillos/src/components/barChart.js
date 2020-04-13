import React, { useRef, useEffect } from 'react';

import * as d3 from 'd3';

import { isEqual } from 'lodash';


function BarChart(props) {
  const svgRef = useRef();
  const t = d3.transition().duration(250);
  const width = props.dimensions.width;
  const height = width / 4;
  const margin = {top: 20, right: 20, bottom: 40, left: 40};
  const w = width - (margin.left + margin.right);
  const h = height - (margin.top + margin.bottom);


  useEffect(() => {
    const { dataset, color, maxY } = props;
    const svg = d3.select(svgRef.current);
    const main = svg.select('.main');

    // scale domains
    const xScale = d3.scaleBand()
      .range([0, w])
      .padding(0.4)
      .domain(dataset.map(d => d.date));

    const yScale = d3.scaleLinear()
      .range([h, 0])
      .domain([0, maxY]);

    // grid/axes
    main.select('.xaxis').call(d3.axisBottom(xScale)
      .ticks(d3.timeDay, 1)
      .tickSize(5)
      .tickFormat(d3.timeFormat('%-d')))
    .selectAll('text')
      .attr('class', 'xaxis day')
      .attr('text-anchor', 'center')
      .attr('pointer-events', 'none');

    main.select('.ygrid').transition(t).call(d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-w)
      .tickFormat(d3.format(".2s")))
    .selectAll('line')
      .attr('stroke-width', .33);

    // bars
    const rects = main.selectAll('rect')
      .data(dataset, d => d.date);

    rects.exit()
      .attr('fill', 'red')
      .transition(t)
      .attr('y', yScale(0))
      .attr('height', 0)
      .remove();

    rects.enter()
      .append('rect')
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
      .attr('fill-opacity', 1);

    }, [props.dataset, props.maxY, props.dimensions]);

  console.log(`BarChart [${props.country}] rerender (${w}x${h})`);


  return (
    <svg ref={svgRef} height={height} width={width}>
      <g className="main" transform={`translate(${margin.left}, ${margin.top})`}>
        <g className="xaxis" transform={`translate(0, ${h})`} />
        <g className="ygrid" />
      </g>
    </svg>
  );
}


function areEqual(prevProps, nextProps) {
  return isEqual(prevProps, nextProps);
}


export default React.memo(BarChart, areEqual);
