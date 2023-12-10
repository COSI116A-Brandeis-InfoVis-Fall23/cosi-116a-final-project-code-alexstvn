// Immediately Invoked Function Expression to limit access to our 
// variables and prevent race conditions
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")

  d3.csv("data/MBTA_Data.csv", (data) => {
    //d3.json({a: 9, b: 20, c:30, d:8, e:12}, (data) => { //dummy data

    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Extract all unique route IDs from your data
    const allRouteIDs = Array.from(new Set(data.map(d => d.route_id)));

    let filteredData = data.filter(d => d.route_id === 'Red');

    // Create a scatterplot chart
    let scatterplot_delays = scatterplot()
      .x(d => d.stop_name)
      .xLabel("Stop Name")
      .y(d => d.number_service_days)
      .yLabel("Number Service Days")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", filteredData);

    const routeColors = {
      'Red': 'red',
      'Orange': 'orange',
      'Green': 'green',
      'Blue': 'blue',
    };

    // Use filtered data
    let mbta_ons = offchart()
      .x(d => d.stop_name)
      .xLabel("Stop Name")
      .y(d => d.average_ons)
      .yLabel("Average Ons")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      .colorScale(d3.scaleOrdinal()
        .domain(allRouteIDs) // Use allRouteIDs here
        .range(filteredData.map(d => routeColors[d.route_id])))
      ("#onchart", filteredData);


    let mbta_offs = offchart()
      .x(d => d.stop_name)
      .xLabel("Stop Name")
      .y(d => d.average_offs)
      .yLabel("Average Offs")
      .yLabelOffset(150)
      .selectionDispatcher(d3.dispatch(dispatchString))
      .colorScale(d3.scaleOrdinal()
        .domain(allRouteIDs) // Use allRouteIDs here
        .range(filteredData.map(d => routeColors[d.route_id])))
      ("#offchart", filteredData);

    // When the sun chart selection is updated via brushing, 
    // tell the on and off graphs to update it's selection (linking)
    scatterplot_delays.selectionDispatcher().on(dispatchString, function (selectedData) {
      mbta_ons.updateSelection(selectedData);
      mbta_offs.updateSelection(selectedData);
    });

    mbta_ons.selectionDispatcher().on(dispatchString, function (selectedData) {
      scatterplot_delays.updateSelection(selectedData);
      mbta_offs.updateSelection(selectedData);
    });

    mbta_offs.selectionDispatcher().on(dispatchString, function (selectedData) {
      scatterplot_delays.updateSelection(selectedData);
      mbta_ons.updateSelection(selectedData);
    });

  });

})());
