function StretchWidget(svgName, surface)
{
    this.svg = d3.select(svgName);
    this.width = 200;
    this.height = 200;
	this.margin = 30;
    this.radius = 3;
    this.numCircles = 51;
	this.surface = surface;
    this.surface.setStretchWidget(this);

    this.x = d3.scaleLinear().range([0, this.width]);
    this.y = d3.scaleLinear().range([this.height, 0]);
    this.xAxis = d3.axisBottom().scale(this.x);
    this.yAxis = d3.axisLeft().scale(this.y);
    this.xLine = d3.axisTop().scale(this.x).tickFormat("").tickSize(-this.height);
	this.yLine = d3.axisRight().scale(this.y).tickFormat("").tickSize(-this.width);
	
    this.step = 0.01;
}



StretchWidget.prototype.setSliderAnimator = function(sliderAnimator)
{
    this.sliderAnimator = sliderAnimator;
}


StretchWidget.prototype.setAxisLength = function(maxSource, maxTarget)
{
    this.svg.selectAll("*").remove();
	var _this = this;
    this.maxSource = maxSource;
    this.maxTarget = maxTarget;

    this.x.domain([0, maxSource]);
    this.y.domain([0, maxTarget]);

    this.minX = 0;
    this.maxX = _this.width
    this.minY = 0;
    this.maxY = _this.height;

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
	  
	
	
    this.circles = d3.range(this.numCircles).map(function(i) {
      return {
        x: (i / (_this.numCircles-1)) * (_this.width),
        y: _this.height - (i / (_this.numCircles-1)) * ((_this.maxSource / _this.maxTarget) * _this.height),
        i: i
      };
    });

    this.selection = this.svg.selectAll("circle")
      .data(_this.circles)
      .enter().append("circle")
        .attr("cx", function(d) { return d.x; })
        .attr("cy", function(d) { return d.y; })
        .attr("r", _this.radius)
        .style("fill", function(d, i) { return "lightblue"; })
        .call(d3.drag()
            .on("start", dragstarted)
            .on("drag", dragged)
            .on("end", dragended));

    function dragstarted(d, i) {
      d3.select(this).raise().classed("active", true);
      if (i > 0)
      {
        _this.maxPos = _this.circles[i-1].y;
      }
      else
      {
        _this.maxPos = _this.maxY;          
      }  
      
      if (i < _this.numCircles-1)
      {
        _this.minPos = _this.circles[i+1].y;
      }
      else
      {
        _this.minPos = _this.minY;
      }
    }

    function dragged(d, i) {
      //console.log(d3.event.y, _this.minPos, _this.maxPos);
      if (d3.event.y <= _this.minPos)
      {
          d3.select(this).attr("cy", d.y = _this.minPos);
      }
      else if (d3.event.y >= _this.maxPos)
      {
          d3.select(this).attr("cy", d.y = _this.maxPos);
      }
      else
      {
          d3.select(this).attr("cy", d.y = d3.event.y);
      }
      _this.scaleSurface();
      _this.surface.setStretched(true);
    }

    function dragended(d) {
      d3.select(this).classed("active", false);
    }
}

StretchWidget.prototype.scaleSurface = function()
{
      var targets = [];
      for (var i = 0; i < this.numCircles; i++)
      {
          targets.push(this.maxTarget - (this.maxTarget * (this.circles[i].y / this.height)));
      }
      this.surface.scale(targets);
}

StretchWidget.prototype.stretch = function(func, duration)
{
      var instructions = [];
      for (var i = 0; i < this.numCircles; i++)
      {            
          var y_in = this.maxTarget - (this.maxTarget * (this.circles[i].y / this.height));
          var target = func(y_in);
          var target_scaled = this.height - (target / this.maxTarget) * this.height;
          instructions.push({circle: this.selection._groups[0][i],
                             target: target_scaled,
                             step: this.step});
      }
    
      this.sliderAnimator.startStretchAnimations(instructions, duration, false);
}

StretchWidget.prototype.resetStretch = function(duration)
{
      var instructions = [];
      for (var i = 0; i < this.numCircles; i++)
      {            
          instructions.push({circle: this.selection._groups[0][i],
                             target: this.height - (i / (this.numCircles-1)) * ((this.maxSource / this.maxTarget) * this.height),
                             step: this.step});
      }
      
      this.sliderAnimator.startStretchAnimations(instructions, duration, true);
}



