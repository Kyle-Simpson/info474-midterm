// Load Data
let svg = '';

window.onload = function () {
  svg = d3.select('body')
    .append('svg')
    .attr('width', 500)
    .attr('height', 500);
  d3.csv("./data/data.csv")
    .then((csvData) => drawPlot(csvData));
}

function drawPlot(data) {
  makeLabels();

  let map = drawAxes({ xMin: 1989, xMax: 2015, yMin: 0, yMax: 30 },
    "year", "avg", svg,
    { min: 50, max: 450 }, { min: 50, max: 450 });

  plotData(map, data)
}

function plotData(map, data) {
  // mapping functions
  let xMap = map.x;
  let yMap = map.y;

  // make tooltip
  let div = d3.select("body").append("div")
    .attr("class", "tooltip")
    .attr('id', 'tooltip')
    .style("opacity", 0);

  // append data to SVG and plot as points
  svg.selectAll('.bar')
    .data(data)
    .enter()
    .append('rect')
    .attr('x', (x) => xMap(x) - 6)
    .attr('y', (y) => yMap(y))
    .attr('width', 12)
    .attr('height', (y) => 450 - yMap(y))
    .attr('fill', (d) => d3.rgb(d["c1"], d["c2"], d["c3"]))
    .style("stroke", d3.rgb(124, 116, 111))
    .on("mouseover", (d) => {
      div.transition()
        .duration(200)
        .style("opacity", .9);
      div.html("Season #" + d.season + "<br/>" +
        "Year: " + d.year + "<br/>" +
        "Episodes: " + d.num_episodes + "<br/>" +
        "Avg Viewers (mil): " + d.avg + "<br/>" +
        "<br/>" +
        "Most Watched Episode: " + d.most_watched + "<br/>" +
        "Viewers (mil): " + d.total_viewers)
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
      div.transition()
        .duration(500)
        .style("opacity", 0);
    });

  let barText = svg.selectAll(".bar") 
    .data(data)
    .enter()
    .append("g")

  barText.append("text")
    .attr("class", "label")
    .attr("y", (y) => yMap(y) - 4)
    .attr("x", (x) => xMap(x) - 7)
    .attr("text-anchor", "start")
    .text(function(data) { return `${Number(data.avg).toFixed(1)}`; })
    .style("font-size", "8px")

  // Average line
  let div2 = d3.select("body").append("div")
    .attr("class", "tooltip2")
    .attr('id', 'tooltip')
    .style("opacity", 0);

  const avg = [(data.reduce((acc, cur) => acc + Number(cur['avg']), 0) / data.length).toFixed(2)];

  var line = svg.selectAll(".line")
    .data(avg)
    .enter()
    .append("g")
    .on("mouseover", (d) => {
      div2.transition()
        .duration(200)
        .style("opacity", .9);
      div2.html("Average = " + avg[0])
        .style("left", (d3.event.pageX) + "px")
        .style("top", (d3.event.pageY - 28) + "px");
    })
    .on("mouseout", (d) => {
      div2.transition()
        .duration(500)
        .style("opacity", 0);
    });

  const num = { avg: avg[0] };
  
  line.append("line")
    .attr("x1", 50)
    .attr("y1", (line) => yMap(num))
    .attr("x2", 450)
    .attr("y2", (line) => yMap(num))
    .attr("stroke-width", 2)
    .attr("stroke", "black")
    .style("stroke-dasharray", ("3, 3"))
    .style("stroke", d3.rgb(124, 116, 111))

  line.append("rect")
      .attr("class", "title")
      .attr("x", 55)
      .attr("y", () => yMap(num) - 10)
      .attr("text-anchor", "start")
      .attr("width", 25)
      .attr("height", 10)
      .attr("opacity", 0.5)
      .attr("fill", 'white');
  
  line.append("text")
    .attr("class", "label")
    .attr("y", (line) => yMap(num) - 2)
    .attr("x", 55)
    .attr("text-anchor", "start")
    .text(avg[0])
    .style("font-size", "10px")

  // Legend
  var legend = svg.selectAll(".legend")
    .data(data)
    .enter()
    .append("g")

  legend.append("text")
    .attr("class", "label")
    .attr("y", 70)
    .attr("x", 360)
    .attr("text-anchor", "start")
    .text("Viewership Data")
    .attr("font-weight", "bold")
    .style("font-size", "14px")
  
  legend.append("rect")
    .attr("class", "label")
    .attr("x", 360)
    .attr("y", 79)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d3.rgb(86, 154, 224))
    .style("stroke", d3.rgb(124, 116, 111))

  legend.append("text")
    .attr("class", "label")
    .attr("y", 90)
    .attr("x", 380)
    .attr("font-weight", "normal")
    .attr("text-anchor", "start")
    .text("Actual")
    .style("font-size", "14px")

  legend.append("text")
    .attr("class", "label")
    .attr("y", 110)
    .attr("x", 380)
    .attr("text-anchor", "start")
    .text("Estimated")
    .style("font-size", "14px")
  
  legend.append("rect")
    .attr("class", "label")
    .attr("x", 360)
    .attr("y", 99)
    .attr("width", 12)
    .attr("height", 12)
    .attr("fill", d3.rgb(124, 116, 111))
    .style("stroke", d3.rgb(124, 116, 111))

}

// Axis & Labels
function makeLabels() {

  svg.append("rect")
    .attr("class", "title")
    .attr("x", 15)
    .attr("y", 13)
    .attr("width", 450)
    .attr("height", 23)
    .attr("fill", d3.rgb(86, 154, 224))
  svg.append('text')
    .attr('x', 20)
    .attr('y', 30)
    .style('font-size', '14pt')
    .attr('fill', 'white')
    .attr("font-style", "italic")
    .text("Average Viewership By Season");

  svg.append('text')
    .attr('x', 230)
    .attr('y', 495)
    .style('font-size', '10pt')
    .text('Year');

  svg.append('text')
    .attr('transform', 'translate(15, 300)rotate(-90)')
    .style('font-size', '10pt')
    .text('Avg. Viewers (in millions)');
}

function xAxisMap(year) {
  if (year >= 1990 && year <= 2014) {
      return `${year}`;
  }
  return '';
}

function drawAxes(limits, x, y, svg, rangeX, rangeY) {
  // return x value from a row of data
  let xValue = function (d) { return +d[x]; }

  // function to scale x value
  let xScale = d3.scaleLinear()
    .domain([limits.xMin, limits.xMax]) // give domain buffer room
    .range([rangeX.min, rangeX.max]);

  // xMap returns a scaled x value from a row of data
  let xMap = function (d) { return xScale(xValue(d)); };

  // plot x-axis at bottom of SVG
  let xAxis = d3.axisBottom().scale(xScale).tickFormat(xAxisMap).ticks(25);
  svg.append("g")
    .attr('transform', 'translate(0, ' + rangeY.max + ')')
    .call(xAxis)
    .selectAll("text")	
      .style("text-anchor", "end")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "translate(-7, 0)rotate(-90)");

  // return y value from a row of data
  let yValue = function (d) { return +d[y] }

  // function to scale y
  let yScale = d3.scaleLinear()
    .domain([limits.yMax, limits.yMin]) // give domain buffer
    .range([rangeY.min, rangeY.max]);

  // yMap returns a scaled y value from a row of data
  let yMap = function (d) { return yScale(yValue(d)); };

  // plot y-axis at the left of SVG
  let yAxis = d3.axisLeft().scale(yScale);
  svg.append('g')
    .attr('transform', 'translate(' + rangeX.min + ', 0)')
    .call(yAxis);

  // return mapping and scaling functions
  return {
    x: xMap,
    y: yMap,
    xScale: xScale,
    yScale: yScale
  };
}

// find min and max for arrays of x and y
function findMinMax(x, y) {
  // get min/max x values
  let xMin = d3.min(x);
  let xMax = d3.max(x);

  // get min/max y values
  let yMin = d3.min(y);
  let yMax = d3.max(y);

  // return formatted min/max data as an object
  return {
    xMin: xMin,
    xMax: xMax,
    yMin: yMin,
    yMax: yMax
  }
}