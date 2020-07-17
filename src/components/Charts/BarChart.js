import React, { useRef, useEffect } from 'react';
import * as d3 from 'd3';
import { isEqual } from 'lodash';

import { getTooltipX, countryLabel, translate, dateFormatLong, cleanStr } from '../../utils/utils';
import config from '../../config';


function BarChart(props) {
  const svgRef = useRef();
  const ts = d3.transition().duration(config.transitionShort);
  const tl = d3.transition().duration(config.transitionLong);
  const td = d3.transition().duration(config.transitionData);
  const width = props.dimensions.width;
  const height = Math.max(width / 5, 200);
  const miniMapHeight = 20;
  const margin = {top: 10, right: 0, bottom: 40, left: 30};
  const w = width - (margin.left + margin.right);
  const h = height - (margin.top + margin.bottom + miniMapHeight);
  const miniMapY = height - miniMapHeight;


  useEffect(() => {
    const { name, color, dataset, maxY, show } = props;
    const svg = d3.select(svgRef.current);
    const main = svg.select('.main');
    const miniMap = svg.select('g.minimap');
    const tooltip = d3.select(`.${cleanStr(name)}-tooltip`);

    // scale domains
    const xScale = d3.scaleBand()
      .range([0, w])
      .domain(dataset.map(d => d.date))
      .padding(.2);

    const xMiniMapScale = d3.scaleBand()
      .range([0, w])
      .domain(dataset.map(d => d.date))
      .padding(.5);

    const yScale = d3.scaleLinear()
      .range([h, 0])
      .domain([0, maxY])
      .nice();

    const yMiniMapScale = d3.scaleLinear()
      .range([0, miniMapHeight])
      .domain([0, maxY]);

    // DRAW AXES
    function drawAxes() {
      // grids/axes
      main.select('.xaxis').call(d3.axisBottom(xScale)
        .tickSize(5)
        .tickFormat(d3.timeFormat(''))) // .tickFormat(d3.timeFormat('%-d/%-m')))
        .selectAll('text')
        .attr('class', 'xaxis count')
        .attr('text-anchor', 'start')
        .attr('pointer-events', 'none')
        .attr('y', -2)
        .attr('x', 6)
        .attr('transform', 'rotate(90)');

      main.select('.ygrid').transition(tl).call(d3.axisLeft(yScale)
        .ticks(10, 's')
        .tickSize(-w)
        .tickFormat(d3.format('.2s')))
        .selectAll('line')
        .attr('stroke-width', .33)
        .attr('pointer-events', 'none');

      main.select('.ygrid').select('.domain').remove();

      main.select('.ygrid').select('.tick:last-of-type text').clone()
        .attr('class', 'legend text-stroke text-uppercase')
        .attr('x', 3)
        .attr('text-anchor', 'start')
        .attr('font-weight', 'bold')
        .text(translate(show));
    };


    // DRAW DATA
    function drawData() {
      // bars
      const rects = main.selectAll('rect.bar')
        .data(dataset.filter(day => xScale.domain().includes(day.date)), d => d.date);

      rects.exit()
        .attr('y', yScale(0))
        .attr('height', 0)
        .remove();

      rects.enter()
        .append('rect')
        .attr('class', d => `bar ${d.date}`)
        .attr('fill', 'grey')
        .attr('x', d => xScale(d.date))
        .attr('y', yScale(0))
        .attr('width', xScale.bandwidth)
        .attr('height', 0)
      .merge(rects)
        .transition(td)
        .attr('x', d => xScale(d.date))
        .attr('y', d => yScale(d.value))
        .attr('width', xScale.bandwidth)
        .attr('height', d => h - yScale(d.value))
        .attr('fill', color)
        .attr('fill-opacity', 1)
        .attr('pointer-events', 'none');
    };


    // calls drawing functions
    drawAxes();
    drawData();


    // minimap bars
    const miniMapRects = miniMap.selectAll('rect.minimapbar')
      .data(dataset, d => d.date);

    miniMapRects.enter()
      .append('rect')
      .attr('class', 'minimapbar')
      .attr('fill', 'lightgrey')
      .attr('x', d => xScale(d.date))
      .attr('y', yMiniMapScale(0))
      .attr('width', xMiniMapScale.bandwidth)
      .attr('height', 0)
    .merge(miniMapRects)
      .transition(td)
      .attr('x', d => xScale(d.date))
      .attr('y', d => miniMapHeight - yMiniMapScale(d.value))
      .attr('width', xMiniMapScale.bandwidth)
      .attr('height', d => yMiniMapScale(d.value))
      .attr('fill', 'lightgrey')
      .attr('fill-opacity', 1)
      .attr('pointer-events', 'none');

    // brush
    const selectionStart = xScale(new Date('2020-03-01'));
    const selectionEnd = xScale.range()[1];

    const xBrush = d3.brushX()
      .extent([[0, 0], [w, miniMapHeight]])
      .on('end', () => brushEnd());

    miniMap.select('.brush').remove();
    miniMap.append('g')
      .attr('class', 'brush')
      .call(xBrush)
      .call(xBrush.move, [selectionStart, selectionEnd])

    updateDomain([selectionStart, selectionEnd]);


    // INTERACTIVITY FUNCTIONS
    main.selectAll('.mainoverlay')
      .on('mouseover', () => barMouseOver())
      .on('mouseout', () => barMouseOut())
      .on('mousemove', () => barMouseMove());

    // overlay mouse functions: show/hide and move line and dots
    const barMouseOver = () => { tooltip.transition(t => ts).style('opacity', 1); };
    const barMouseOut = () => { tooltip.transition(t => ts).style('opacity', 0); };

    const barMouseMove = () => {
      const x = d3.mouse(svg.select('.mainoverlay').node())[0];
      const eachBand = xScale.step();
      const i = Math.floor(x / eachBand);
      const slicedDataset = dataset.filter(day => xScale.domain().includes(day.date));
      const d = slicedDataset[i < slicedDataset.length ? i : slicedDataset.length - 1];

      tooltip
        .html(`
          <div class="tooltip-date">
            ${dateFormatLong(d.date)}
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

    // brush functions: brushed adjusts the brush to bars, and brushEnd updates scale
    function updateDomain(selection) {
      const newDomain = [];

      xMiniMapScale.domain().forEach(d => {
        const pos = xMiniMapScale(d) + xMiniMapScale.bandwidth() / 2;
        if (pos >= selection[0] && pos <= selection[1]) {
          newDomain.push(d);
        }
      });

      // set new domain
      xScale.domain(selection ? newDomain : dataset.map(d => d.date));

      // update axis and line position
      drawAxes();
      drawData();

      return newDomain;
    }

    function brushEnd() {
      if (!d3.event.sourceEvent) return;

      const newDomain = updateDomain(d3.event.selection || xMiniMapScale.range());

      // snap to closest rect
		  const left = xMiniMapScale(d3.min(newDomain));
      const right = xMiniMapScale(d3.max(newDomain)) + xMiniMapScale.bandwidth();

  	  svg.select('.brush').transition(tl).call(d3.event.target.move, [left, right]);
    }

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
        <g className="minimap" transform={`translate(${margin.left}, ${miniMapY})`}>
          <rect className='minimapoverlay' height={miniMapHeight} width={w} fill="white" />
        </g>
      </svg>
      <div
        className={`${cleanStr(props.name)}-tooltip tooltip tooltip-narrow`}
        style={{'opacity': 0}}
      />
    </>
  );
}


export default React.memo(BarChart, (prevProps, nextProps) => isEqual(prevProps, nextProps));
