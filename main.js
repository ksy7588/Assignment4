// python -m http.server 8080       
var margin = {top: 30, right: 30, bottom: 70, left: 60},
    width = 1600 - margin.left - margin.right,
    height = 350 - margin.top - margin.bottom;

// margin for second bar chart
var marginTwo = {top: 30, right: 30, bottom: 70, left: 60},
  width2 = 1600 - marginTwo.left - marginTwo.right, // 900 => 2000 testing
  height2 = 350 - marginTwo.top - marginTwo.bottom; // 400 => 600 testing

// append the svg object to the body of the page
// svg for first bar chart
var svg = d3.select("#main")
  .append("svg")
    .attr("width", width + margin.left + margin.right)
    .attr("height", height + margin.top + margin.bottom)
  .append("g")
    .attr("transform",
          "translate(" + margin.left + "," + margin.top + ")");
// svg for second bar chart
var svg2 = d3.select("#second")
.append("svg")
    .attr("width", width2 + marginTwo.left + marginTwo.right)
    .attr("height", height2 + marginTwo.top + marginTwo.bottom)
  .append("g")
    .attr("transform",
          "translate(" + marginTwo.left + "," + marginTwo.top + ")");

// ------------------------------ Line Chart ------------------------------
var currentCategory = 'GDP_Per_Capita in $ (PPP) 2018';
var title = '';
  // Set up the SVG element
var svgWidth = 300;
var svgHeight = 150;
var margin3 = { top: 20, right: 20, bottom: 30, left: 50 };
var width3 = svgWidth - margin3.left - margin3.right;
var height3 = svgHeight - margin3.top - margin3.bottom;
var svg3 = svg.append("svg")
  .attr('class', 'lineC')
  .attr("x", width - 300)
  .attr("y", 0)
  .append("g")
  .attr("transform", "translate(" + margin3.left + "," + margin3.top + ")");

// display line chart
function displayLineChart(countryName) {
  d3.csv('DatasetForLineChart.csv').then(csvdata => {
    svg3.select(".xAxis").remove();
    svg3.select(".yAxis").remove();
    svg3.select(".title").remove();
    svg3.select(".line").remove();
    var countryData = csvdata.filter((d) => d["indicator"] === countryName);

    // Define the data for the GDP values
    var data;
    var isGDP = true;
    if (currentCategory === 'health-2018-bar' || currentCategory === 'health-2019-bar') {
      data = [
        { year: 2014, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2014']) },
        { year: 2015, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2015']) },
        { year: 2016, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2016']) },
        { year: 2017, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2017']) },
        { year: 2018, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2018']) },
        { year: 2019, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2019']) },
        { year: 2020, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2020']) },
        { year: 2021, gdp: parseFloat(countryData[0]['health expenditure % of GDP 2021 or latest']) }
      ];
      isGDP = false;
      title = 'Health Expenditure Change';
    } else {
      data = [
        { year: 2018, gdp: parseFloat(countryData[0]['GDP ($ USD billions PPP) 2018'].replaceAll(',','')) },
        { year: 2019, gdp: parseFloat(countryData[0]['GDP ($ USD billions PPP) 2019'].replaceAll(',','')) },
        { year: 2020, gdp: parseFloat(countryData[0]['GDP ($ USD billions PPP) 2020'].replaceAll(',','')) },
        { year: 2021, gdp: parseFloat(countryData[0]['GDP ($ USD billions PPP) 2021'].replaceAll(',','')) }
      ];
      title = 'GDP Change';
    }

    data = data.map(d => ({
      year: d.year,
      gdp: d.gdp === 0 ? null : +d.gdp
    }));

    console.log(data);

    // Define the scales and axes for the graph
    var xScale = d3.scaleLinear()
      .range([0, width3])
      .domain(d3.extent(data, d => d.year));

    var yScale = d3.scaleLinear()
      .range([height3, 0])
      .domain([d3.min(data, d => d.gdp), d3.max(data, d => d.gdp)])
      .nice();

    var xAxis;
    if (isGDP) {
      xAxis = d3.axisBottom(xScale).tickFormat(d => d.toLocaleString('en-US',{maximumFractionDigits:0})).ticks(4);
    } else {
      xAxis = d3.axisBottom(xScale).tickFormat(d => d.toLocaleString('en-US',{maximumFractionDigits:0})).ticks(8);
    }
    var yAxis = d3.axisLeft(yScale);

    // Define axis
    svg3.append("g")
      .attr("class", "xAxis")
      .attr("transform", "translate(0," + height3 + ")")
      .call(xAxis);

    svg3.append("g")
      .attr("class", "yAxis")
      .call(yAxis);

    svg3.append("text")
      .attr("class", "title")
      .attr("transform", "rotate(-90)")
      .attr("y", -20 - margin.right)
      .attr("x", 75 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "9px")
      .text(title);

    // Define the line generator
    var line = d3.line()
      .x(d => xScale(d.year))
      .y(d => yScale(d.gdp))
      .defined(d => d.gdp !== null);

    // Draw the line for the GDP values
    svg3.append("path")
      .attr("class", "line")
      .datum(data)
      .attr("fill", "none")
      .attr("stroke", "pink")
      .attr("stroke-width", 3)
      .attr("d", line);
  });
}
// --------------------------- End of Line Chart ---------------------------

var sortingValue = "GDP ($USD billions PPP) 2018"; // used to determine what the bar chart is sorted on

var stackedExists = false; 
function onSortingCategoryChanged(){
    var selectElement = document.getElementById("categorySelectSorting");
    var category = selectElement.value;

    sortingValue = category; 
    onCategoryChanged(); 
    onCategoryChangedTwo();

    // Remove line chart
    svg3.select(".xAxis").remove();
    svg3.select(".yAxis").remove();
    svg3.select(".title").remove();
    svg3.select(".line").remove();
}
// Drop down choice updated, fire signal to display the "correct" chart for top chart
function onCategoryChanged() {
  var select = d3.select('#categorySelect').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChart(category);
  currentCategory = category;

  // Remove line chart
  svg3.select(".xAxis").remove();
  svg3.select(".yAxis").remove();
  svg3.select(".title").remove();
  svg3.select(".line").remove();
}

// Drop down choice updated, fire signal to display the "correct" chart for bottom chart
function onCategoryChangedTwo() {
  var select = d3.select('#categorySelectTwo').node();
  // Get current value of select element
  var category = select.options[select.selectedIndex].value;
  // Update chart with the selected category of letters
  updateChartTwo(category);

  // Remove line chart
  svg3.select(".xAxis").remove();
  svg3.select(".yAxis").remove();
  svg3.select(".title").remove();
  svg3.select(".line").remove();
}

/////////////////////////////////////////////////////// Refactoring Completed for bar charts - Caleb: add ur baseline fix here again
function createBarChart(nameOfDataset, targetSVG, width, height, margin, yDomainScaleForAxis, columnTitle) {
d3.csv(nameOfDataset).then(function(dataset) {
  // clear caching 
  targetSVG.selectAll(".bar").remove();
  targetSVG.select(".x-axis").remove();
  targetSVG.select(".y-axis").remove();
  targetSVG.select(".y-axis-title").remove();
  targetSVG.select(".baseline").remove();
  targetSVG.select(".baseline-country").remove();

  data = dataset;
  // always sort by GDP
  let tempColumnTitle = columnTitle
  var yearSplitter = tempColumnTitle.split(/(\s+)/).slice(-1);
  
  data.sort(function(a,b) {
    console.log(sortingValue);
    return d3.descending(+a[sortingValue], +b[sortingValue]);
  });

  // X axis
  var xScale = d3.scaleBand()
  .range([ 0, width ])
  .domain(data.map(function(d) { return d.Country; }))
  .padding(0.2);
  targetSVG.append("g")
  .attr("class", "x-axis")
  .attr("transform", "translate(0," + height + ")")
  .call(d3.axisBottom(xScale))
  .selectAll("text")
    .attr("transform", "translate(-10,0)rotate(-45)")
    .style("text-anchor", "end")
    .style("font-size", "6px");

  var yScale = d3.scaleLinear()
    .domain([0, yDomainScaleForAxis]) // ****** changing the values inside this parenthesis can change the extent of y
    .range([height, 0]);
    targetSVG.append("g")
    .attr("class", "y-axis")
    .call(d3.axisLeft(yScale));

    targetSVG.append("text")
    .attr("class", "y-axis-title")
    .attr("transform", "rotate(-90)")
    .attr("y", 0 - margin.left)
    .attr("x",0 - (height / 2))
    .attr("dy", "1em")
    .style("text-anchor", "middle")
    .style("font-size", "10px")
    .text(columnTitle);

  let baseline_value;
  var callOther;
        if (targetSVG == svg || targetSVG === svg) {
          callOther = "svg2";
        }else {
          callOther = "svg";
        }


  // Bar starts here
  targetSVG.selectAll(".bar")
    .data(data)
    .enter()
    .append("rect")
      .attr("class", "bar")
      .attr("x", function(d) {
        if(d.Country === "United States") {
          baseline_value = yScale(+d[columnTitle]);
        }
        return xScale(d.Country);
      })
      .attr("y", function(d) { return yScale(+d[columnTitle]); })
      .attr("width", xScale.bandwidth())
      .attr("height", function(d) { return height - yScale(+d[columnTitle]); })
      .attr("fill", "#69b3a2")
      .on("mouseover", function(d) {
        // figure out what we need to also call.. If at top call bottom if at bottom call top
        svg.selectAll("bar-label").remove();
        svg2.selectAll("bar-label").remove();
        
        onClickBaseline(d.Country, callOther); 
        
        if (!d3.select(this).classed("bar selected")) {
          d3.select(this).attr("fill", "red");
          targetSVG.append("text")
            .attr("class", "bar-label")
            .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
            .attr("y", yScale(+d[columnTitle]) - 10)
            .attr("text-anchor", "middle")
            .style("font-size", "10px")
            .text(d.Country + " " + d[columnTitle])
        }
      })
      .on("mouseout", function(d) {
        if (!d3.select(this).classed("bar selected")) {
          unClickBaseline(d.Country, callOther); // call to trigger baseline un-highlighting in both places
          d3.select(this).attr("fill", "#69b3a2");
          svg.selectAll(".bar-label").remove();
          svg2.selectAll(".bar-label").remove();
        }
      })
      .on("click", function(d){
        targetSVG.selectAll("bar-label").remove();
        targetSVG.select(".baseline").remove();
        targetSVG.select(".baseline-country").remove();

        targetSVG.selectAll(".bar").classed("selected", false);
        // add the "selected" class to the clicked bar
        d3.select(this).classed("selected", true);
        // set the fill color of the selected bar to red
        targetSVG.selectAll(".bar").attr("fill", "#69b3a2")
        d3.select(this).attr("fill", "yellow");

        baseline_value = yScale(+d[columnTitle]); 
        targetSVG.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", baseline_value)
          .attr("x2", width)
          .attr("y2", baseline_value)
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
        targetSVG.append("text")
          .attr("class", "baseline-country")
          .attr("x", xScale(d.Country) + xScale.bandwidth() / 2)
          .attr("y", yScale(+d[columnTitle]) - 10)
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country + " " + d[columnTitle]);
        syncBaseline(d.Country, callOther);
        displayLineChart(d.Country);
      });
  
})
}

function syncBaseline(countryName, whichSVGToCall) {
  if(whichSVGToCall === "svg2" && !stackedExists2) {
    svg2.selectAll("bar-label").remove(); 
    svg2.selectAll('rect').each(function(d,i) {
      if (d.Country === countryName) {
        svg2.select(".baseline").remove();
        svg2.select(".baseline-country").remove();

        svg2.selectAll(".bar").classed("selected", false);
        // add the "selected" class to the clicked bar
        d3.select(this).classed("selected", true);
        // set the fill color of the selected bar to red
        svg2.selectAll(".bar").attr("fill", "#69b3a2")

        d3.select(this).attr("fill", "yellow");
        // d3.select(this).attr('y') ----- example for getting specific attribute
        // need to show country name too
        svg2.append("text")
        .attr("class", "baseline-country")
        .attr("x", d3.select(this).attr('x'))
        .attr("y", d3.select(this).attr('y'))
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(d.Country)
        svg2.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", d3.select(this).attr('y'))
          .attr("x2", width)
          .attr("y2", d3.select(this).attr('y'))
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
      } else {
        d3.select(this).attr("fill", "#69b3a2");
      }
      // d3.select(i).attr("fill", "red");
    })
  } else if(whichSVGToCall === "svg" && !stackedExists1){
    svg.selectAll("bar-label").remove(); 
    svg.selectAll('rect').each(function(d,i) {
      if (d.Country === countryName) {
        svg.select(".baseline").remove();
        svg.select(".baseline-country").remove();

        svg.selectAll(".bar").classed("selected", false);
        // add the "selected" class to the clicked bar
        d3.select(this).classed("selected", true);
        // set the fill color of the selected bar to red
        svg.selectAll(".bar").attr("fill", "#69b3a2")

        d3.select(this).attr("fill", "yellow");
        // d3.select(this).attr('y') ----- example for getting specific attribute
        // need to show country name too
        svg.append("text")
        .attr("class", "baseline-country")
        .attr("x", d3.select(this).attr('x'))
        .attr("y", d3.select(this).attr('y'))
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(d.Country)
        svg.append("line")
          .attr("class", "baseline")
          .attr("x1", 0)
          .attr("y1", d3.select(this).attr('y'))
          .attr("x2", width)
          .attr("y2", d3.select(this).attr('y'))
          .style("stroke", "#999")
          .style("stroke-dasharray", ("3, 3"));
      } else {
        d3.select(this).attr("fill", "#69b3a2");
      }
      // d3.select(i).attr("fill", "red");
    })
  } else if(stackedExists){
    if(whichSVGToCall === "svg2") {

    }
  }
}

//<rect class="bar" x="400.4707233065442" y="39.03000000000001" height="199.655" width="6.934557979334098" stroke="grey"></rect>

/////////////////////////////////////////////////////// Refactoring completed --- dont touch below this code.
// function createBarChart(nameOfDataset, targetSVG, width, height, margin, yDomainScaleForAxis, columnTitle) // 

// display 2021 GDP per capita for top chart as default
createBarChart("dataset.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2021");
createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 4000, "GDP ($USD billions PPP) 2019");

////
// function updateChart(category){
//   if(category === "gdp-per-capita") {
//     createBarChart("dataset.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2021");
//   } else if (category === "health-expenditure"){
//     createBarChart("dataset.csv", svg, width, height, margin, 11000, "health expenditure per person ($) 2018");
//   } else {
//     createStackedBarChart("2018GDPperCapitaHealth.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2018");
//   }
// }
////
// Let us know what we selected from the top dropdown.
var stackedExists1 = false; 
var stackedExists2 = false; 
function updateChart(category){
  if(category === "gdp-per-capita-2018-bar") {
    stackedExists1 = false; 
    createBarChart("dataset.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2018");
  } else if (category === "gdp-per-capita-2019-bar") {
    stackedExists1 = false; 
    createBarChart("dataset.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2019");
  } else if (category === "gdp-per-capita-2020-bar") {
    stackedExists1 = false; 
    createBarChart("dataset.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2020");
  } else if (category === "gdp-per-capita-2021-bar") {
    stackedExists1 = false; 
    createBarChart("dataset.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2021");
  } else if (category === "health-gdp-cap-2018-stacked") {
    stackedExists1 = true; 
    createStackedBarChart("2018GDPperCapitaHealth.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2018");
  } else if (category === "health-gdp-cap-2019-stacked") {
    stackedExists1 = true; 
    createStackedBarChart("2019GDPperCapitaHealth.csv", svg, width, height, margin, 140000, "GDP per capita in $ (PPP) 2019");
  } else if (category === "health-2018-bar") {
    stackedExists1 = false; 
    createBarChart("dataset.csv", svg, width, height, margin, 11000, "health expenditure per person ($) 2018");
  } else if (category === "health-2019-bar") {
    stackedExists1 = false; 
    createBarChart("dataset.csv", svg, width, height, margin, 11000, "health expenditure per person ($) 2019");
  }
}

// Let us know what we selected from bottom dropdown
// function updateChartTwo(category) {
//   if(category === "gdp") {
//     createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 4000, "GDP ($USD billions PPP) 2019");
//   } else if (category === "healthMilitaryPortion") {
//     createStackedBarChart("2019GDPHealthMilitary.csv", svg2, width2, height2, marginTwo, 500, "GDP ($USD billions PPP) 2019");
//   } else if (category === "unemployement") {
//     createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 50, "unemployment (%) 2021"); 
//   }
// }

function updateChartTwo(category) {
  if(category === "GDP-2018-bar") {
    stackedExists2 = false; 
    createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 4000, "GDP ($USD billions PPP) 2018");
  } else if (category === "GDP-2019-bar") {
    stackedExists2 = false; 
    createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 4000, "GDP ($USD billions PPP) 2019");
  } else if (category === "GDP-2020-bar") {
    stackedExists2 = false; 
    createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 4000, "GDP ($USD billions PPP) 2020");
  } else if (category === "GDP-2021-bar") {
    stackedExists2 = false; 
    createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 4000, "GDP ($USD billions PPP) 2021");
  } else if (category === "health-military-gdp-2019-stacked") {
    stackedExists2 = true; 
    createStackedBarChart("2019GDPHealthMilitary.csv", svg2, width2, height2, marginTwo, 500, "GDP ($USD billions PPP) 2019");
  } else if (category === "health-military-gdp-2021-stacked") {
    stackedExists2 = true; 
    createStackedBarChart("2021GDPHealthMilitary.csv", svg2, width2, height2, marginTwo, 500, "GDP ($USD billions PPP) 2021");
  } else if (category === "unemployement-2021-bar") {
    stackedExists2 = false; 
    createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 50, "unemployment (%) 2021"); 
  } else if (category === "unemployement-2018-bar") {
    stackedExists2 = false; 
    createBarChart("dataset.csv", svg2, width2, height2, marginTwo, 50, "unemployment (%) 2018"); 
  }
}

///////////// Refactoring for stacked bar chart in progress ///////////////////
function createStackedBarChart(nameOfDataset, targetSVG, width, height, margin, yDomainScaleForAxis, columnTitle) {
  d3.csv(nameOfDataset).then(function(data) {
    targetSVG.selectAll(".bar").remove();
    targetSVG.select(".x-axis").remove();
    targetSVG.select(".y-axis").remove();
    targetSVG.select(".y-axis-title").remove();
    targetSVG.select(".baseline").remove();
    targetSVG.select(".baseline-country").remove();

    var callOther;
        if (targetSVG == svg || targetSVG === svg) {
          callOther = "svg2";
        }else {
          callOther = "svg";
        }

    // addition of gdp depends on top or bottom => Top has two to add, bottom has 3
    if (targetSVG == svg || targetSVG === svg) {
      console.log("here");
      // add only gdp and health
      data.sort(function(a, b) {
        // console.log((+a["GDP ($USD billions PPP) 2018"], +b["GDP ($USD billions PPP) 2018"]));
        // GDP column name means gdp - whatever column name
        return d3.descending( (+a["GDPperCapita"]) + (+a["health"]), (+b["GDPperCapita"]) + (+b["health"]))
      });
    } else {
      console.log("reach here");
      data.sort(function(a, b) {
        // console.log((+a["GDP ($USD billions PPP) 2018"], +b["GDP ($USD billions PPP) 2018"]));
        // GDP column name means gdp - whatever column name
        return d3.descending( (+a["GDP"]) + (+a["health"]) + (+a["military"]), (+b["GDP"]) + (+b["health"]) + (+b["military"]))
      });
    }

    var subgroups = data.columns.slice(1); // list of health value, military value, GDP without H and M columns.
    // console.log(subgroups);
    var xScale = d3.scaleBand()
    .range([ 0, width ])
    .domain(data.map(function(d) { return d.Country; }))
    .padding(0.2);
    targetSVG.append("g")
    .attr("class", "x-axis")
    .attr("transform", "translate(0," + height + ")")
    .call(d3.axisBottom(xScale).tickSizeOuter(0))
    .selectAll("text")
      .attr("transform", "translate(-10,0)rotate(-45)")
      .style("text-anchor", "end")
      .style("font-size", "6px");

    var yScale = d3.scaleLinear()
      .domain([0, yDomainScaleForAxis])
      .range([height, 0]);
      targetSVG.append("g")
      .attr("class", "y-axis")
      .call(d3.axisLeft(yScale));
  
    targetSVG.append("text")
      .attr("class", "y-axis-title")
      .attr("transform", "rotate(-90)")
      .attr("y", -15 - margin.right)
      .attr("x",0 - (height / 2))
      .attr("dy", "1em")
      .style("text-anchor", "middle")
      .style("font-size", "10px")
      .text(columnTitle);

       // color palette choices 
    var color = d3.scaleOrdinal()
      .domain(subgroups)
      .range(['#e41a1c','#377eb8','#4daf4a'])
  
        //stack the data? --> stack per subgroup
    var stackedData = d3.stack()
      .keys(subgroups)
      (data)
      // console.log(stackedData);

        //// animation
    var mouseover = function(d) {
      // what subgroup are we hovering?
      var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
      // console.log(subgroupName);
      var subgroupValue = d.data[subgroupName];
      // console.log(subgroupValue);
      // Reduce opacity of all rect to 0.2
      d3.selectAll(".myRect").style("opacity", 0.2)
      
        var taylorMade = subgroupName.replaceAll(' ', '.');
        // console.log(taylorMade);
        // console.log(d3.selectAll(".myRect."+taylorMade));
        d3.selectAll(".myRect."+taylorMade).style("opacity", 1);
    }
  var mouseleave = function(d) {
      // Back to normal opacity: 0.8
      d3.selectAll(".myRect")
        .style("opacity",0.8)
      }

//// animation
  
    targetSVG.append("g")
      .selectAll("g")
      // Enter in the stack data = loop key per key = group per group
      .data(stackedData)
      .enter().append("g")
        .attr("fill", function(d) { return color(d.key); })
        .attr("class", function(d){ return "myRect " + d.key }) // 5/3 animation attempt
        .selectAll("rect")
        // enter a second time = loop subgroup per subgroup to add all rectangles
        .data(function(d) { return d; })
        .enter().append("rect")
          .attr("class", "bar")
          .attr("x", function(d) { return xScale(d.data.Country); })                                                                     //.attr("x", function(d) { return xScale2(d.data.group); })
          .attr("y", function(d) { return yScale(d[1]); })
          .attr("height", function(d) { return yScale(d[0]) - yScale(d[1]); })
          .attr("width",xScale.bandwidth())
          .attr("stroke", "grey")
          .on("mouseover", function(d){
            svg.selectAll("bar-label").remove(); 
            svg2.selectAll("bar-label").remove(); 
            // what subgroup are we hovering?
            var subgroupName = d3.select(this.parentNode).datum().key; // This was the tricky part
            // console.log(subgroupName);
            var subgroupValue = d.data[subgroupName];
            // console.log(subgroupValue);
            // Reduce opacity of all rect to 0.2
            d3.selectAll(".myRect").style("opacity", 0.3)
          
            var taylorMade = subgroupName.replaceAll(' ', '.');
            // console.log(taylorMade);
            // console.log(d3.selectAll(".myRect."+taylorMade));
            d3.selectAll(".myRect."+taylorMade).style("opacity", 0.7);
            targetSVG.append("text")
              .attr("class", "bar-label")
              .attr("x", xScale(d.data.Country))
              .attr("y", yScale(d[1]))
              .attr("text-anchor", "middle")
              .style("font-size", "10px")
              .text(d.data.Country);

            onClickBaseline(d.data.Country, callOther); 
          })
          .on("mouseleave", function(d){
            // Back to normal opacity: 0.8
            
            d3.selectAll(".myRect")
            .style("opacity",1)
            unClickBaseline(d.data.Country, callOther);
          })

  })
}

//////////////// Refactoring for stacked bar chart in progress /////////////////


// Let other svg (top,bottom) know that one chart clicked into baseline.
// make it highlight with red
function onClickBaseline(countryName, whichSVGToCall) {// breakpoint
  // console.log("here");
  // console.log(svg2.selectAll('.rect'));
  svg.select(".bar-label").remove();
  //svg.select(".baseline").remove();
  //svg.select(".baseline-country").remove();
  svg2.select(".bar-label").remove();
  //svg2.select(".baseline").remove();
  //svg2.select(".baseline-country").remove();
  if(stackedExists1 && whichSVGToCall == "svg2"){
    svg2.selectAll('rect').each(function(d,i) {
      if (d.Country == countryName && !d3.select(this).classed("bar selected")) {
        d3.select(this).attr("fill", "red");
        svg2.append("text")
        .attr("class", "bar-label")
        .attr("x", d3.select(this).attr('x'))
        .attr("y", d3.select(this).attr('y'))
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(d.Country)
      } else {
        if (!d3.select(this).classed("bar selected")) {
          //d3.select(this).attr("fill", "#69b3a2");
        }
      }
      // d3.select(i).attr("fill", "red");
    })
  } else if(stackedExists2 && whichSVGToCall == "svg"){
    svg.selectAll('rect').each(function(d,i) {
      if (d.Country == countryName && !d3.select(this).classed("bar selected")) {
        d3.select(this).attr("fill", "red");
        svg.append("text")
        .attr("class", "bar-label")
        .attr("x", d3.select(this).attr('x'))
        .attr("y", d3.select(this).attr('y'))
        .attr("text-anchor", "middle")
        .style("font-size", "10px")
        .text(d.Country)
      } else {
        if (!d3.select(this).classed("bar selected")) {
          //d3.select(this).attr("fill", "#69b3a2");
        }
      }
    })
  }else if((stackedExists1 && whichSVGToCall == "svg") || (stackedExists2 && whichSVGToCall == "svg2")){

  } else {
    if (whichSVGToCall == "svg2") {
      svg2.selectAll('rect').each(function(d,i) {
        if (d.Country == countryName && !d3.select(this).classed("bar selected")) {
          d3.select(this).attr("fill", "red");
          // d3.select(this).attr('y') ----- example for getting specific attribute
          // need to show country name too
          svg2.append("text")
          .attr("class", "bar-label")
          .attr("x", d3.select(this).attr('x'))
          .attr("y", d3.select(this).attr('y'))
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country)
        } else {
          if (!d3.select(this).classed("bar selected")) {
            d3.select(this).attr("fill", "#69b3a2");
          }
        }
        // d3.select(i).attr("fill", "red");
      })
    } else if (whichSVGToCall == "svg") {
      svg.selectAll('rect').each(function(d,i) {
        if (d.Country == countryName && !d3.select(this).classed("bar selected")) {
          d3.select(this).attr("fill", "red");
          svg.append("text")
          .attr("class", "bar-label")
          .attr("x", d3.select(this).attr('x'))
          .attr("y", d3.select(this).attr('y'))
          .attr("text-anchor", "middle")
          .style("font-size", "10px")
          .text(d.Country)
        }
      })
    }
  }
  
}

// Let other svg (top, bottom) know that one chart moved away from baseline.
// back to the green color (which is default)
function unClickBaseline(countryName, whichSVGToCall) { // breakpoint
  
  if((whichSVGToCall == "svg" && stackedExists1) || (whichSVGToCall == "svg2" && stackedExists2)) {
    
  } else {
    svg2.selectAll('rect').each(function(d,i) {
      if (d.Country == countryName) {
        d3.select(this).attr("fill", "#69b3a2");
      }
      // d3.select(i).attr("fill", "red");
    })
  
    svg.selectAll('rect').each(function(d,i) {
      if (d.Country == countryName) {
        d3.select(this).attr("fill", "#69b3a2");
      }
      // d3.select(i).attr("fill", "red");
    })
  }  
}


