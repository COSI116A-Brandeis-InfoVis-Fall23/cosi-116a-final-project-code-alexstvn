
// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Chart configuration
function barchart() {
  let colorScale;
  let margin = {
    top: 100,
    left: 100,
    right: 100,
    bottom: 100
  },
    width = 800 - margin.left - margin.right,
    height = 600 - margin.top - margin.bottom,


    xValue = d => d[0],
    yValue = d => d[1],
    xLabelText = "",
    yLabelText = "",
    xLabelOffsetPx = 0,
    xScale = d3.scaleBand(),
    yScale = d3.scaleLinear(),
    ourBrush = null,
    selectableElements = d3.select(null),
    dispatcher;

  function chart(selector, data) {
    let svg = d3.select(selector)
      .append("svg")
      .attr("preserveAspectRatio", "xMidYMid meet")
      .attr("viewBox", [0, 0, width + margin.left + margin.right, height + margin.top + margin.bottom].join(' '))
      .classed("svg-content", true);

    svg = svg.append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    //Define scales
    xScale
      .domain(data.map(d => xValue(d)))
      .range([0, width])
      .paddingInner(0.1)
      .paddingOuter(0.1);

    yScale
      .domain([
        0, 16000
      ])
      .rangeRound([height, 0]);

    let xAxis = svg.append("g")
      .attr("transform", "translate(0," + (height) + ")")
      .call(d3.axisBottom(xScale));

    //rotate and resize the x-axis labels
    xAxis.selectAll("text")
      .style("text-anchor", "end")
      .style("font-size", "10px")
      .attr("dx", "-.8em")
      .attr("dy", ".15em")
      .attr("transform", "rotate(-65)");



    // X axis label
    xAxis.append("text")
      .attr("class", "axisLabel")
      .attr("x", width / 2)
      .attr("y", 80)
      .style("text-anchor", "middle")
      .style("font-size", "16px")
      .style("fill", "red")
      .text(xLabelText);


    let yAxis = svg.append("g")
      .call(d3.axisLeft(yScale))
      .append("g")
      .attr("class", "axisLabel")
      .attr("transform", "translate(" + "-30" + ", 40)");

    //y-axis label
    yAxis.append("text")
      .attr("class", "axisLabel")
      .attr("transform", "rotate(-90)")
      .attr("y", -30) // Adjust the vertical position
      .attr("x", -height / 2) // Center the y-axis label
      .style("text-anchor", "middle") // Center the y-axis label
      .style("font-size", "16px")
      .style("fill", "red")
      .text(yLabelText);


    let bars = svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("x", d => xScale(xValue(d)))
      .attr("y", d => yScale(yValue(d)))
      .attr("width", xScale.bandwidth() * 0.8)
      .attr("height", d => height - yScale(yValue(d)))
      .attr("fill", d => colorScale(d.route_id)) // Color by route_id
      .on("click", function (d) {
        dispatcher.call("selectionUpdated", this, [d]);
      });

    selectableElements = bars;


    svg.call(brush);

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



  chart.colorScale = function (scale) {
    colorScale = scale;
    return chart;
  };

  return chart;
}
