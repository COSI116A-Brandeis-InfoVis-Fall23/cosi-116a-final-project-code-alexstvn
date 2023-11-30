// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Chart configuration
//STOP HERE
function onchart() {

  
  const margin = { top: 60, right: 150, bottom: 40, left: 150 };
  let width = 800 - margin.left - margin.right,
  height = 380 - margin.top - margin.bottom,
  xValue = d => d[0],
  yValue = d => d[1],
  xLabelText = "",
  yLabelText = "",
  yLabelOffsetPx = 0,
  xScale = d3.scaleBand(),
  yScale = d3.scaleLinear(),
  dispatcher,
  selectableElements = d3.select(null);
  
  function chart(selector, data) {
    let svg = d3.select(selector)
    .append("svg")
    .attr("preserveAspectRatio", "xMidYMid meet")
    .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
    .classed("svg-content", true)
    .append("g")
    .attr("transform", "translate(" + margin.left + "," + margin.top + ")");
    
    xScale.domain(data.map(d => xValue(d))).range([0, width]).padding(0.1);
    yScale.domain([0, d3.max(data, d => yValue(d))]).range([height, 0]);
    
    svg.append("g")
    .attr("transform", "translate(0," + (height) + ")")
    .call(d3.axisBottom(xScale));
    
    svg.append("g")
    .call(d3.axisLeft(yScale));
    
    svg.selectAll(".bar")
    .data(data)
    .enter().append("rect")
    .attr("class", "bar")
    .attr("x", d => xScale(xValue(d)))
    .attr("y", d => yScale(yValue(d)))
    .attr("width", xScale.bandwidth())
    .attr("height", d => height - yScale(yValue(d)))
    .attr("fill", "steelblue")
    .on("click", function(d) {
      dispatcher.call("selectionUpdated", this, [d]);
    });
    
    return chart;
  }
  
  // The x-accessor from the datum
  function X(d) {
    return xScale(xValue(d));
  }
  
  // The y-accessor from the datum
  function Y(d) {
    return yScale(yValue(d));
  }
  
  chart.margin = function (_) {
    if (!arguments.length) return margin;
    margin = _;
    return chart;
  };
  
  chart.width = function (_) {
    if (!arguments.length) return width;
    width = _;
    return chart;
  };
  
  chart.height = function (_) {
    if (!arguments.length) return height;
    height = _;
    return chart;
  };
  
  chart.x = function (_) {
    if (!arguments.length) return xValue;
    xValue = _;
    return chart;
  };
  
  chart.y = function (_) {
    if (!arguments.length) return yValue;
    yValue = _;
    return chart;
  };
  
  chart.xLabel = function (_) {
    if (!arguments.length) return xLabelText;
    xLabelText = _;
    return chart;
  };
  
  chart.yLabel = function (_) {
    if (!arguments.length) return yLabelText;
    yLabelText = _;
    return chart;
  };
  
  chart.yLabelOffset = function (_) {
    if (!arguments.length) return yLabelOffsetPx;
    yLabelOffsetPx = _;
    return chart;
  };
  
  // Gets or sets the dispatcher we use for selection events
  chart.selectionDispatcher = function (_) {
    if (!arguments.length) return dispatcher;
    dispatcher = _;
    return chart;
  };
  
  // Given selected data from another visualization 
  // select the relevant elements here (linking)
  chart.updateSelection = function (selectedData) {
    if (!arguments.length) return;
    
    // Select an element if its datum was selected
    selectableElements.classed("selected", d => {
      return selectedData.includes(d)
    });
  };
  
  return chart;
}
