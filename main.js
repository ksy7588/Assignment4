// import {scaleLinear} from "d3-scale-break"

var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 900 - margin.left - margin.right,
    height = 400 - margin.top - margin.bottom;

var marginTwo = {top: 30, right: 30, bottom: 70, left: 60},
width2 = 900 - marginTwo.left - marginTwo.right,
height2 = 400 - marginTwo.top - marginTwo.bottom;


// append the svg object to the body of the page
var svg1 = d3.select("#first")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");

var svg2 = d3.select("#second")
.append("svg")
    .attr("width", width2 + marginTwo.left + marginTwo.right)
    .attr("height", height2 + marginTwo.top + marginTwo.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginTwo.left + "," + marginTwo.top + ")");

// Parse the Data
d3.csv("dataset.csv").then(function(data) {
  // sort data

  // updateChartGDP(data); 
  data.sort(function(a, b) {
    // console.log(d3.descending(+a["GDP per capita in $ (PPP) 2021"], +b["GDP per capita in $ (PPP) 2021"]));
    return d3.descending(+a["GDP per capita in $ (PPP) 2021"], +b["GDP per capita in $ (PPP) 2021"]);
  });

  // X axis
  var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(0.2);
  svg1.append("g")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "6px");


        
  // Add Y axis
  var yScale = d3.scaleLinear()
    .domain([0, 140000])
    .range([ height, 0]);
  svg1.append("g")
    .call(d3.axisLeft(yScale));
  
  

  // Add Y axis label
  svg1.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("GDP per capita in $ (PPP) 2021");

  


  let baseline_value; 
  
  // Bars
  svg1.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        }
        return xScale(d.Country); 
      })
      .attr("y", function(d) { return yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d["GDP per capita in $ (PPP) 2021"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg1.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg1.select(".bar-label").remove(); 
      })
      .on("click", function(d){
        svg1.select(".baseline").remove(); 
        svg1.select(".baseline-country").remove(); 

        baseline_value = yScale(+d["GDP per capita in $ (PPP) 2021"]);
        svg1.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", baseline_value)
          .attr("x2", width)
          .attr("y2", baseline_value)
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
        svg1.append("text")
          .attr("class", "baseline-country")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d["GDP per capita in $ (PPP) 2021"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      }); 


})
// second one

d3.csv("dataset.csv").then(function(data) {
  data.sort(function(a, b) {
    console.log((+a["GDP ($USD billions PPP) 2018"], +b["GDP ($USD billions PPP) 2018"]));
    return d3.descending(+a["GDP ($USD billions PPP) 2018"], +b["GDP ($USD billions PPP) 2018"]);
  });
  /////////
  // X axis
  var xScale2 = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.Country; }))
  .padding(0.2);
svg2.append("g")
  .attr("transform", "translate(0," + height2 + ")")
  .call(d3.axisBottom(xScale2))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "6px");

  

    // var yScale2 = d3.scaleLinear()
    // .domain([[0,7000], [7000, 22000]])
    // .scope([[0, 0.5], [0.5,1]])
    // .range([0,100]);
    // svg2.append("g")
    // .call(d3.axisLeft(yScale2));
    var yScale2 = d3.scaleLinear()
    .domain([0, 4000, 22000])
    .range([height2, 0]);
    svg2.append("g")
    .call(d3.axisLeft(yScale2));

    svg2.append("text")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - marginTwo.left)
    .attr("x",0 - (height2 / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text("GDP ($USD billions PPP) 2018");



  let baseline_value; 
  
  // Bars
  svg2.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale2(+d["GDP ($USD billions PPP) 2018"]);
        }
        return xScale2(d.Country); 
      })
      .attr("y", function(d) { return yScale2(+d["GDP ($USD billions PPP) 2018"]); })
      .attr("width", xScale2.bandwidth())
      .attr("height", function(d) { return height2 - yScale2(+d["GDP ($USD billions PPP) 2018"]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        d3.select(this).attr("fill", "red");
        svg2.append("text")
          .attr("class", "bar-label")
          .attr("x", xScale2(d.Country) + xScale2.bandwidth() / 2)
          .attr("y", yScale2(+d["GDP ($USD billions PPP) 2018"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      })
      .on("mouseout", function(d) {
        d3.select(this).attr("fill", "#69b3a2");
        svg2.select(".bar-label").remove(); 
      })
      .on("click", function(d){
        svg2.select(".baseline").remove(); 
        svg2.select(".baseline-country").remove(); 

        baseline_value = yScale2(+d["GDP ($USD billions PPP) 2018"]);
        svg2.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", baseline_value)
          .attr("x2", width2)
          .attr("y2", baseline_value)
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
        svg2.append("text")
          .attr("class", "baseline-country")
          .attr("x", xScale2(d.Country) + xScale2.bandwidth() / 2)
          .attr("y", yScale2(+d["GDP ($USD billions PPP) 2018"]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country);
      }); 
})


function updateChartHealth(){
  console.log("update chart Health expenditure"); 
}

function updateChartGDP(){
  console.log("update chart GDP per capita"); 
} 

function healthExpenditureAsPercentageClicked(){

}

function militarySpendingAsPercentageClicked(){
  
}