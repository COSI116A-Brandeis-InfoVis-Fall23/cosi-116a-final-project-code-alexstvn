// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Chart configuration
function offchart() {
  let colorScale;
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

    yScale.domain(data.map(d => yValue(d))).range([0, height]).paddingInner(0.1).paddingOuter(0.1);

    svg.append("g")
      .attr("transform", "translate(0, 0)") // Shift y-axis to left
      .call(d3.axisLeft(yScale).ticks(data.length)) // Vertical axis
      .selectAll(".tick text") // Adjust font size for y-axis labels
      .style("font-size", (d, i) => i % 2 === 0 ? "5px" : "0px"); // Font size 5 for even indices, hide odd indices

    xScale.domain([0, d3.max(data, d => xValue(d))]).range([0, width]);

    svg.append("g")
      .attr("transform", "translate(0," + height + ")") // Shift x-axis to bottom
      .call(d3.axisBottom(xScale)) // Horizontal axis
      .selectAll(".tick text") // Rotate and adjust font size for x-axis labels
      .attr("transform", "rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "5px");

      svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", 0)
      .attr("y", d => yScale(yValue(d)))
      .attr("width", d => xScale(xValue(d)))
      .attr("height", yScale.bandwidth())
      .attr("fill", d => colorScale(d.route_id)) // Color by route_id
      .on("click", function (d) {
        dispatcher.call("selectionUpdated", this, [d]);
      });

      function brush(g) {
        const brush = d3.brush() // Create a 2D interactive brush
          .on("start brush", highlight) // When the brush starts/continues do...
          .on("end", brushEnd) // When the brush ends do...
          .extent([
            [-margin.left, -margin.bottom],
            [width + margin.right, height + margin.top]
          ]);
  
        ourBrush = brush;
  
        g.call(brush); // Adds the brush to this element
  
        // Highlight the selected rectangles (bars)
        function highlight() {
          if (d3.event.selection === null) return;
          const [
            [x0, y0],
            [x1, y1]
          ] = d3.event.selection;
  
          svg.selectAll(".bar")
            .classed("selected", d =>
              x0 <= X(d) && X(d) <= x1 && y0 <= Y(d) && Y(d) <= y1
            );
  
          dispatcher.call("selectionUpdated", this, svg.selectAll(".bar.selected").data());
        }
  
        function brushEnd() {
          if (d3.event.sourceEvent.type !== "end") {
            d3.select(this).call(brush.move, null);
          }
        }
      }
  
      svg.call(brush);

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

  chart.colorScale = function(scale) {
    colorScale = scale;
    return chart;
  };

  return chart;
}
