// http://stackoverflow.com/questions/23305785/draw-line-with-d3-js-using-separate-fixed-x-y-input-arrays
// http://bost.ocks.org/mike/nest/
// http://bost.ocks.org/mike/join/
// http://bost.ocks.org/mike/selection/


(function() {
  // websocket connection
  var connection = new WebSocket('ws://localhost:8000')
  
  // When the connection is open, send some data to the server
  connection.onopen = function () {
    //connection.send('Ping'); // Send the message 'Ping' to the server
  };
  
  // Log errors
  connection.onerror = function (error) {
    console.log('WebSocket Error ' + error);
  };
  
  // Log messages from the server
  connection.onmessage = function (e) {
    console.log(e);
    try {
      //var data = e.data.replace(/(\r\n|\n|\r)/gm, "")
      var data = e.data
      if (/pulse_data/.test(data)) {
      data = JSON.parse(e.data)
      data = data['DCRC1']['PA']
      console.log(Math.max.apply(Math,data.pulse_data))
      refreshGraph([data.pulse_data])
      }
    } catch (err) {
      console.log(err)
    }
  };

  // make yourself an SVG container
  // in the DOM
  var svgWidth = 1200
  var svgHeight = 300
  var plotWidth = 1000
  var plotHeight = 200
  var svg = d3.select("#plot").append("svg:svg")
  .attr("width", svgWidth)
  .attr("height", svgHeight)
  
  // and now let's plot some lines
  // in that SVG container
  // using this here data
  var num_samples = 4096
  var adc_max = 10000
  
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
    .range([0, plotWidth])

  var y_scale = d3.scale.linear()
    .domain([4800,4500])
    .range([0, plotHeight])
    //.domain([adc_max, 0])
    
 var y_axis = d3.svg.axis()
  .scale(y_scale)
  .orient("left")
  .ticks(10)
  
  svg.append("g")
    .attr("class", "y axis")
    .attr("transform","translate(100,0)")
    .call(y_axis)
  
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

d3.selectAll(".ping")
 .on("click",function(){
   connection.send('Ping');
 })
 
  //refreshGraph(volt_data)

})();
