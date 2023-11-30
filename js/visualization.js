// Immediately Invoked Function Expression to limit access to our 
// variables and prevent race conditions
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")

  d3.csv("../data/MBTA_Data.csv", (data) => {
    //d3.json({a: 9, b: 20, c:30, d:8, e:12}, (data) => { //dummy data


    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Create a scatterplot chart
    let scatterplot_delays = scatterplot()
      .x(d => d.year)
      .xLabel("year")
      .y(d => d.number_service_days)
      .yLabel("number_service_days")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", data);

    const routeColors = {
      'Red': 'red',
      'Orange': 'orange',
      'Green': 'green',
      'Blue':'blue',
    };

    let mbta_ons = onchart()
      .x(d => d.average_ons)
      .xLabel("average_ons")
      .y(d => d.stop_name)
      .yLabel("stop_name")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      .colorScale(d3.scaleOrdinal()
        .domain(data.map(d => d.route_id))
        .range(data.map(d => routeColors[d.route_id])))
      ("#onchart", data);

        
    let mbta_offs = offchart()
    .x(d => d.average_offs)
    .xLabel("average_offs")
    .y(d => d.stop_name)
    .yLabel("stop_name")
    .yLabelOffset(150)
    .selectionDispatcher(d3.dispatch(dispatchString))
      ("#offchart", data);

    // When the sun chart selection is updated via brushing, 
    // tell the on and off graphs to update it's selection (linking)
    scatterplot_delays.selectionDispatcher().on(dispatchString, function(selectedData) {
      //mbta_ons.updateSelection(selectedData);
      //mbta_offs.updateSelection(selectedData);

    });

    mbta_ons.selectionDispatcher().on(dispatchString, function(selectedData) {
      //scatterplot_delays.updateSelection(selectedData);
      //mbta_offs.updateSelection(selectedData);

    });

    mbta_offs.selectionDispatcher().on(dispatchString, function(selectedData) {
      //scatterplot_delays.updateSelection(selectedData);
      //mbta_ons.updateSelection(selectedData);

    });
  });

})());