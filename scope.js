// http://stackoverflow.com/questions/23305785/draw-line-with-d3-js-using-separate-fixed-x-y-input-arrays
// http://bost.ocks.org/mike/nest/
// http://bost.ocks.org/mike/join/
// http://bost.ocks.org/mike/selection/


(function() {
  // websocket connection
  var connection = new WebSocket('ws://localhost:8000')
  
  // When the connection is open, send some data to the server
  connection.onopen = function () {
    connection.send('Ping'); // Send the message 'Ping' to the server
  };
  
  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };
  
  // Log messages from the server
  connection.onmessage = function (e) {
    console.log('Server: ' + e.data);
    try {
      var data = JSON.parse(e.data)
      data = data['DCRC1']['PA']
      refreshGraph[data.pulse_data]
    } catch (err) {
      console.log(err)
    }
  };

  // make yourself an SVG container
  // in the DOM
  var width = 1000
  var height = 200
  var svg = d3.select("#plot").append("svg:svg")
  .attr("width", width)
  .attr("height", height)
  
  // and now let's plot some lines
  // in that SVG container
  // using this here data
  var num_samples = 1024
  var volt_data = [[2,2.3,2.6,2,1.9],
                   [2.4,4,2,4.5,3],
                   [1.3,2.1,2.6,1.2,0.8]]
  //var trace_data = d3.zip(volt_data, time_data)
  //console.log(trace_data)
  
  // not currently using these functions
  // keeping them around 'cause they might be useful
  var voltFn = function(d) {return d}
  var timeFn = function(i) {return i}
  
  // define "scale" objects that 
  // scale our data into a reasonable number of pixels
  // these scales are used in the definition 
  // of the d3.svg.line()
  var x_scale = d3.scale.linear()
    .domain([0, num_samples])
    .range([0, width])

  var y_scale = d3.scale.linear()
    .domain([5, 0])
    .range([height, 0])
  
  var trace = d3.svg.line()
      .x(function(d,i) { return x_scale(i); })
      .y(function(d,i) { return y_scale(d); })
  
var refreshGraph = function(new_data) {
    var traces = svg.selectAll("path.new")
      .data(new_data)
      
    //console.log(traces)
    
    traces.enter()
     .append("svg:path")
     .attr("class","line")
     .style("stroke-linejoin","round")
     .style("opacity",0.4)
     .attr("d",function(d,i) {return trace(d,i)})
     .transition()
     .delay(10)
     .duration(300)
     .ease("exp-in-out")
     .style("opacity",0.1)
     .transition()
     .duration(2000)
     .ease("sin-in-out")
     .style("opacity",1e-6)
     .remove()
     
     traces.exit()
     .remove() 
}

  d3.selectAll(".add-data")
   .on("click", function() {
     var volt_min = 0
     var volt_max = 4
     var volts = []
     var new_data = []
     var num_traces = Math.floor(1 + 10*Math.random())
     
     
     for (var j = 0; j < num_traces; j++) {
       new_data[j] = new Array(num_samples)
     for (var i = 0; i < num_samples; i++) {
       new_data[j][i] = volt_min + Math.random() * (volt_max - volt_min)
       //console.log(volts[i])
     }
     }
     console.log(new_data)
     refreshGraph(new_data)
  })

  refreshGraph(volt_data)

})();
