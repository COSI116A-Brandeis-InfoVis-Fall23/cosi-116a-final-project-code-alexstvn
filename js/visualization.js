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
    let scatterplot_distance = scatterplot()
      .x(d => d.stop_name)
      .xLabel("Stop Name")
      .y(d => d.distance_to_center)
      .yLabel("Distance to Center of Boston")
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
    let mbta_ons = barchart()
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


    let mbta_offs = barchart()
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

    // tell the on and off graphs to update it's selection (linking)
    scatterplot_distance.selectionDispatcher().on(dispatchString, function (selectedData) {
      console.log(scatterplot_distance.selectionDispatcher);
      mbta_ons.updateSelection(selectedData);
      mbta_offs.updateSelection(selectedData);
    });

    mbta_ons.selectionDispatcher().on(dispatchString, function (selectedData) {
      console.log(mbta_ons.selectionDispatcher);
      scatterplot_distance.updateSelection(selectedData);
      mbta_offs.updateSelection(selectedData);
    });

    mbta_offs.selectionDispatcher().on(dispatchString, function (selectedData) {
      scatterplot_distance.updateSelection(selectedData);
      mbta_ons.updateSelection(selectedData);
    });

  });

})());
