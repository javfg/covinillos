import React from 'react';
import * as d3 from 'd3';

import { calcChartDimensions } from '../utils';


class BarChart extends React.Component {
  constructor(props) {
    super(props);

    // globals
    this.heightDivisor = 5;
    this.widthDivisor = 2;

    this.state = {
      ...calcChartDimensions(this.heightDivisor, this.widthDivisor),
    };

    this.margin = {top: 20, right: 20, bottom: 40, left: 40};

    this.h = undefined;
    this.w = undefined;
    this.updateMarginTransform();

    this.xScale = undefined;
    this.yScale = undefined;
    this.updateScales();

    this.svg = undefined;
    this.main = undefined;
    this.xAxisGroup = undefined;
    this.yGridGroup = undefined;
  }

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
    const { state: { height, width }, margin } = this;

    this.h = height - (margin.top + margin.bottom);
    this.w = width - (margin.left + margin.right);
  };


  // chart drawing
  createChart() {
    this.svg = d3.select(this.node);
    this.svg.selectAll('*').remove();

    this.main = this.svg.append('g')
      .attr('transform', `translate(${this.margin.left}, ${this.margin.top})`);

    this.xAxisGroup = this.main.append('g')
      .attr('class', 'x axis')
      .attr('transform', `translate(0, ${this.h})`);

    this.yGridGroup = this.main.append('g')
      .attr('class', 'grid');
  }


  updateScales() {
    this.xScale = d3.scaleBand()
      .range([0, this.w])
      .paddingInner(0.4)
      .paddingOuter(0.4);

    this.yScale = d3.scaleLinear()
      .range([this.h, 0]);
  }

  updateChart() {
    const {
      h, w, main, yScale, xScale, xAxisGroup, yGridGroup,
      props: { color, data, maxY, showType, showData }
    } = this;

    // console.log('data', data, maxY);

    const dataSource = `${showData}_${showType}`;
    const t = d3.transition().duration(500);

    // update scale domains
    xScale.domain(data.map(d => new Date(d.date)));
    yScale.domain([0, maxY]);

    // update grid/axes
    xAxisGroup.call(d3.axisBottom(xScale)
      .ticks(1)
      .tickFormat(d3.timeFormat('%-d-%-m')))
    .selectAll('text')
      .attr('dx', '-.8em')
      .attr('dy', '-.6em')
      .attr('text-anchor', 'end')
      .attr('transform', 'rotate(-90)');

    yGridGroup.transition(t).call(d3.axisLeft(yScale)
      .ticks(5)
      .tickSize(-w)
      .tickFormat(d3.format(".2s")))
      .selectAll('line')
      .attr('stroke-width', .33);

    // bars
    const rects = main.selectAll('rect').data(data, d => new Date(d.date));

    rects.exit()
      .attr('fill', 'red')
    .transition(t)
      .attr('y', yScale(0))
      .attr('height', 0)
      .remove();

    rects.enter()
      .append("rect")
      .attr("fill", "grey")
      .attr("y", yScale(0))
      .attr("height", 0)
      .attr('x', d => xScale(new Date(d.date)))
      .attr('width', xScale.bandwidth)
    .merge(rects)
    .transition(t)
      .attr('y', d => yScale(d[dataSource]))
      .attr('height', d => h - yScale(d[dataSource]))
      .attr('fill', color)
      .attr('fill-opacity', 1);
  }


  render() {
    const {
      props: { country },
      state: { height, width },
    } = this;

    console.log(`Barchart [${country}] rerender (${width}x${height})`);

    return (
      <svg
        ref={node => this.node = node}
        height={height}
        width={width}
      />
    );
   }
}

export default BarChart;
