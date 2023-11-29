// Immediately Invoked Function Expression to limit access to our 
// variables and prevent race conditions
((() => {

  // Load the data from a json file (you can make these using
  // JSON.stringify(YOUR_OBJECT), just remove the surrounding "")
  
  d3.json("../data/MBTA_Data.json", (data) => {
    //d3.json({a: 9, b: 20, c:30, d:8, e:12}, (data) => { //dummy data

    
    // General event type for selections, used by d3-dispatch
    // https://github.com/d3/d3-dispatch
    const dispatchString = "selectionUpdated";

    // Create a sun chart
    let scatterplot_delays = scatterplot()
    .x(d => d.Route_Name)
    .xLabel("route")
    .y(d => d.Number_Service_Days)
    .yLabel("number service days")
    .yLabelOffset(150)
    .selectionDispatcher(d3.dispatch(dispatchString))
      ("#scatterplot", data);

    // Create a ons bar graph chart
    //let on_bargraph = onchart()
    //  .selectionDispatcher(d3.dispatch(dispatchString))
    //  ("#onchart", data);

    // Create a off bar chart
    //let off_bargraph = offchart()
    //  .selectionDispatcher(d3.dispatch(dispatchString))
    //  ("#sunchart", data);



    // When the sun chart selection is updated via brushing, 
    // tell the on and off graphs to update it's selection (linking)
    scatterplot_delays.selectionDispatcher().on(dispatchString, function(selectedData) {
      //on_bargraph.updateSelection(selectedData);
      //off_bargraph.updateSelection(selectedData);

    });

        // When the sun chart selection is updated via brushing, 
    // tell the on and off graphs to update it's selection (linking)
    //on_bargraph.selectionDispatcher().on(dispatchString, function(selectedData) {
      //sunchart_mbta.updateSelection(selectedData);
      //off_bargraph.updateSelection(selectedData);

    //});

        // When the sun chart selection is updated via brushing, 
    // tell the on and off graphs to update it's selection (linking)
    //off_bargraph.selectionDispatcher().on(dispatchString, function(selectedData) {
      //on_bargraph.updateSelection(selectedData);
      //sunchart.updateSelection(selectedData);

    //});




  });

})());