function StretchWidget(svgName)
{
    this.svg = d3.select(svgName);
    this.width = +this.svg.attr("width");
    this.height = +this.svg.attr("height");
    this.radius = 7.5;
    this.numCircles = 11;
    
    this.x = d3.scaleLinear().range([0,this.width]);
    this.y = d3.scaleLinear().range([this.height,0]);
    this.xAxis = d3.axisBottom().scale(this.x);
    this.yAxis = d3.axisLeft().scale(this.y);
}

StretchWidget.prototype.setAxisLength = function(length)
{


    this.x.domain(d3.extent(data, function(d){ return d.x; }));
    this.y.domain(d3.extent(data, function(d){ return d.y; }));

    var circles = d3.range(this.numCircles).map(function(i) {
      return {
        x: Math.round(i * 0.1 * (this.width - this.radius * 2) + this.radius),
        y: Math.round(this.height - (i * 0.1 * (this.height - this.radius * 2) + this.radius))
      };
    });

    this.svg.selectAll("circle")
      .data(circles)
      .enter().append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", radius)
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
    }

    function dragended(d) {
      d3.select(this).classed("active", false);
    }
        
  this.svg.append("g")
      .attr("class", "x axis")
      .call(this.xAxis)

  this.svg.append("g")
      .attr("class", "y axis")
      .call(this.yAxis);
}


