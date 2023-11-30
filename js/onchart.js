// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Immediately Invoked Function Expression to limit access to our 
// variables and prevent 
// Chart configuration
function onchart() {

  const margin = { top: 60, right: 150, bottom: 40, left: 150 };
  let width = 800 - margin.left - margin.right;
  let height = 380 - margin.top - margin.bottom;
  
  // SVG container
  const svg = d3.select("#onchart")
    .append("svg")
      .attr("width", width + margin.left + margin.right)
      .attr("height", height + margin.top + margin.bottom)
    .append("g")
    .attr("transform", `translate(${margin.left},${margin.top})`);
  
  // X-axis scale
  const xScale = d3.scaleLinear().range([0, width]);
  
  // Y-axis scale
  const yScale = d3.scaleBand().range([0, height]).padding(0.1);
  
  // X-axis
  const xAxis = d3.axisBottom(xScale);
  
  // Y-axis
  const yAxis = d3.axisLeft(yScale);
  
  // Append X-axis to the SVG
  svg.append("g")
    .attr("transform", `translate(0,${height})`)
    .call(xAxis);
  
  // Append Y-axis to the SVG
  svg.append("g")
    .call(yAxis);
  
  // Add chart title
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", -margin.top / 2)
    .attr("text-anchor", "middle")
    .style("font-size", "16px")
    .style("font-weight", "bold")
    .text("Stops Bar Chart - Average On");
  
  svg.append("text")
    .attr("x", width / 2)
    .attr("y", height + margin.bottom - 2)
    .attr("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Number Of Riders");
  
  svg.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", -margin.left + 10)
    .attr("x", -height / 2)
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "14px")
    .text("Stop Names");
  
  // Load data
  d3.csv("../data/MBTA_Data.csv", function (data) {
    console.log(data);
  
    // Update scale domains with loaded data
    xScale.domain([0, d3.max(data, d => +d.average_ons)]);
    yScale.domain(data.map(d => d.stop_name));
  
    // Create bars with blue color
    svg.selectAll(".bar")
      .data(data)
      .enter().append("rect")
      .attr("class", "bar")
      .attr("y", d => yScale(d.stop_name))
      .attr("width", d => xScale(+d.average_ons))
      .attr("height", yScale.bandwidth())
      .attr("fill", "blue"); // Set the fill color to blue
  });
  
}
