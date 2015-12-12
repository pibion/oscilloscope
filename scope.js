// http://stackoverflow.com/questions/23305785/draw-line-with-d3-js-using-separate-fixed-x-y-input-arrays
// http://bost.ocks.org/mike/nest/
// http://bost.ocks.org/mike/join/
// http://bost.ocks.org/mike/selection/


(function() {
  // make yourself an SVG container
  // in the DOM
  var svg = d3.select("#plot").append("svg:svg")
  .attr("width", 300)
  .attr("height", 200)
  
  // and now let's plot some lines
  // in that SVG container
  // using this here data
  var volt_data = [[2,2.3,2.6,2,1.9],
                   [2.4,4,2,4.5,3],
                   [1.3,2.1,2.6,1.2,0.8]]
  var time_data = [0.1,0.2,0.3,0.4,0.5]
  //var trace_data = d3.zip(volt_data, time_data)
  //console.log(trace_data)
  
  // not currently using these functions
  // keeping them around 'cause they might be useful
  var voltFn = function(d) {return d}
  var timeFn = function(i) {return time_data[i]}
  
  // define "scale" objects that 
  // scale our data into a reasonable number of pixels
  // these scales are used in the definition 
  // of the d3.svg.line()
  var x_scale = d3.scale.linear()
    .domain(d3.extent(time_data))
    .range([0, 300])

  var y_scale = d3.scale.linear()
    .domain([5, 0])
    .range([200, 2])
  
  var trace = d3.svg.line()
      .x(function(d,i) { return x_scale(time_data[i]); })
      .y(function(d,i) { return y_scale(d); })
  
var refreshGraph = function() {
    var traces = svg.selectAll("path")
      .data(volt_data)
      
    //console.log(traces)
    
    traces.enter()
     .append("svg:path")
     .attr("class","line")
     .attr("d",function(d,i) {return trace(d,i)})
     
     traces.exit()
     .remove() 
}

  d3.selectAll(".add-data")
   .on("click", function() {
     var start = d3.min(data, dateFn)
     var end = d3.max(data, dateFn)
     var time = start.getTime() + Math.random() * (end.getTime() - start.getTime())
     var date = new Date(time)

     obj = {
       'id': Math.floor(Math.random() * 70),
       'amount': Math.floor(1000 + Math.random() * 20001),
       'created_at': date.toDateString()
     }
     data.push(obj)
     console.log(data)
     refreshGraph()
  })

  refreshGraph()

})();
