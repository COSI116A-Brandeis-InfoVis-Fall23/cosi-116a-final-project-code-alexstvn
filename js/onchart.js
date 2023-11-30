// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Chart configuration
//STOP HERE
function onchart() {
  const margin = { top: 60, left: 50, right: 30, bottom: 20 };
  let width = 800 - margin.left - margin.right,
      height = 380 - margin.top - margin.bottom,
      xValue = d => d[0],
      yValue = d => d[1],
      xLabelText = "",
      yLabelText = "",
      xLabelOffsetPx = 0,
      xScale = d3.scaleLinear(), // Horizontal scale
      yScale = d3.scaleBand(), // Vertical scale
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

    yScale.domain(data.map(d => yValue(d))).range([0, height]).padding(0.1);
    xScale.domain([0, d3.max(data, d => xValue(d))]).range([0, width]);

    svg.append("g")
      .call(d3.axisLeft(yScale)); // Vertical axis

    svg.append("g")
      .attr("transform", "translate(0," + height + ")") // Shift x-axis to bottom
      .call(d3.axisBottom(xScale)); // Horizontal axis

    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => yScale(yValue(d)))
      .attr("width", d => xScale(xValue(d)))
      .attr("height", yScale.bandwidth())
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
