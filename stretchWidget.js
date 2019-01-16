function StretchWidget(svgName, surface)
{
    this.svg = d3.select(svgName);
    this.width = 200;
    this.height = 200;
	this.margin = 30;
    this.radius = 7.5;
    this.numCircles = 11;
	this.surface = surface;

    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.xAxis = d3.axisBottom().scale(this.x);
    this.yAxis = d3.axisLeft().scale(this.y);
    this.xLine = d3.axisTop().scale(this.x).tickFormat("").tickSize(-this.height);
	this.yLine = d3.axisRight().scale(this.y).tickFormat("").tickSize(-this.width);
	
	this.svg.append("text")
        .attr("x", (this.width / 2))             
        .attr("y", this.height + this.margin)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Source");
	
	this.svg.append("g")
		.attr("transform", "translate(" + -this.margin + "," + this.height / 2 + ")")
		.append("text")
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("Target")
		.attr("transform", "rotate(-90)");
	
	
	this.setAxisLength(4);
}

StretchWidget.prototype.setAxisLength = function(length)
{
	var _this = this;
    this.x.domain([0, length]);
    this.y.domain([0, length]);

	
	this.svg.append("g")
	  .attr("class", "x axis")
	  .attr("transform", "translate(" + 0 + ", " + _this.height + ")")
	  .call(this.xAxis)

	this.svg.append("g")
	  .attr("class", "y axis")
	  .call(this.yAxis);
	  
	this.svg.append("g")
	  .attr("class", "y axis")
	  .attr("transform", "translate(" + _this.width + ", " + 0 + ")")
	  .call(this.yLine)

	this.svg.append("g")
	  .attr("class", "x axis")
	  .call(this.xLine);
	  
	
	
    var circles = d3.range(this.numCircles).map(function(i) {
		console.log((i / (_this.numCircles-1)))
      return {
        x: (i / (_this.numCircles-1)) * (_this.width),
        y: _this.height - (i / (_this.numCircles-1)) * (_this.height),
		
      };
    });
	console.log(circles)
    this.svg.selectAll("circle")
      .data(circles)
      .enter().append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", _this.radius)
        .style("fill", function(d, i) { return "lightblue"; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    function dragstarted(d) {
      d3.select(this).raise().classed("active", true);
    }

    function dragged(d) {
      d3.select(this).attr("cy", d.y = d3.event.y);

	  var targets = [];
	  for (var i = 0; i < _this.numCircles; i++)
	  {
		  targets.push(length - (length * (circles[i].y / _this.height)));
	  }
	  
	  _this.surface.scale(targets);
    }

    function dragended(d) {
      d3.select(this).classed("active", false);
    }
        

}


