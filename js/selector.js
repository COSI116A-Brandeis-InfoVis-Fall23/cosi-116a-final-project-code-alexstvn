// selector.js
function createSelector(selectorId, data, onChangeCallback) {
    const uniqueRoutes = Array.from(new Set(data.map(d => d.route_id)));
    const uniqueStopsByRoute = new Map();

    // Group stops by route
    data.forEach(d => {
        const routeId = d.route_id;
        if (!uniqueStopsByRoute.has(routeId)) {
            uniqueStopsByRoute.set(routeId, []);
        }
        uniqueStopsByRoute.get(routeId).push(d.stop_name);
    });

    // Create a dropdown selector for routes
    d3.select(selectorId)
        .append("select")
        .on("change", function () {
            const selectedRoute = this.value;
            const selectedStops = uniqueStopsByRoute.get(selectedRoute);
            onChangeCallback(selectedRoute, selectedStops);
        })
        .selectAll("option")
        .data(uniqueRoutes)
        .enter().append("option")
        .attr("value", d => d)
        .text(d => d);
}
// selector.js
const routeSelectorId = "#routeSelector";
const stopSelectorId = "#stopSelector";

// Load your data here
const datA = "data/MBTA_Data.csv"
d3.csv(datA).then(function (data) {
    // Call the createSelector function for route selection
    createSelector(routeSelectorId, data, handleRouteChange);

    // Call a new createSelector function for stop selection
    createSelector(stopSelectorId, data, handleStopChange);
});

// Your callback function for route change
function handleRouteChange(selectedRoute, selectedStops) {
    console.log("Selected Route:", selectedRoute);
    console.log("Available Stops:", selectedStops);
    // Add your logic for handling route change here
}

// Your callback function for stop change
function handleStopChange(selectedStop) {
    console.log("Selected Stop:", selectedStop);
    // Add your logic for handling stop change here
}

