function StretchWidget(graphContainer, controlsContainer, maxSource, minTarget, maxTarget)
{
    if (maxSource == undefined) maxSource =  2.0;
    if (minTarget == undefined) minTarget = -4.0;
    if (maxTarget == undefined) maxTarget =  4.0;
    
    // https://github.com/wbkd/d3-extended
    // http://bl.ocks.org/eesur/4e0a69d57d3bfc8a82c2
    d3.selection.prototype.moveToBack = function() {  
      return this.each(function() { 
          var firstChild = this.parentNode.firstChild; 
          if (firstChild) { 
              this.parentNode.insertBefore(this, firstChild); 
          } 
      });
    };
    
    d3.selection.prototype.moveToFront = function() {  
      return this.each(function(){
        this.parentNode.appendChild(this);
      });
    };
    
    
    this.widgetWidth = 400;
    this.widgetHeight = 400;
    this.widgetMargin = 50;
    
    this.margin = 35;
    
    this.stretchPointSize = 3;
    this.stretchPoints = [];
    
    this.e = 0.00000000001;
    
    this.numStretchPoints = 100;
    
    // set up SVG
    this.svg = d3.select('#' + graphContainer)
                .append('svg')
                .attr('id', 'sw')
                .attr("viewBox", -this.widgetMargin + " " + -this.widgetMargin + " " + (this.widgetWidth + 2*this.widgetMargin) + " " + (this.widgetHeight + 2*this.widgetMargin))
                .attr('width', this.widgetWidth + 2 * this.widgetMargin)
                .attr('height', this.widgetHeight + 2 * this.widgetMargin)
    
    
    // set up controls
    this.controlsContainer = document.getElementById(controlsContainer);
    
    this.rbtn = document.createElement("button");
    this.rbtn.setAttribute("class", "stretch-button");
    var rt = document.createTextNode("reset");
    this.rbtn.appendChild(rt);
    this.rbtn.setAttribute("id", "sw-reset-button");
    this.controlsContainer.appendChild(this.rbtn);

    this.rbtn.onclick = this.resetButtonClicked.bind(this);
    this.ebtn = document.createElement("button");
    this.ebtn.setAttribute("class", "stretch-button");
    this.et = document.createTextNode("start editing");
    this.ebtn.appendChild(this.et);
    this.ebtn.setAttribute("id", "sw-edit-button");
    this.controlsContainer.appendChild(this.ebtn);

    this.ebtn.onclick = this.editButtonClicked.bind(this);
    

    
    document.getElementById('sw').oncontextmenu = function() {return false;};
    
    this.callbacks = [];
    
    this.state = null;
    this.editControls = null;
    
    this.defaultDuration = 3;
    
    this.setRange(maxSource, minTarget, maxTarget);
    this.enable();
}

StretchWidget.prototype.setState = function(state)
{
    console.log(state);
    if (this.state == state)
        return

    this.state = state;
    this.sendSignal("state changed", state);
}


StretchWidget.prototype.setRange = function(maxSource, minTarget, maxTarget)
{
    this.maxSource = maxSource;
    this.maxTarget = maxTarget;
    this.minTarget = minTarget;
}

StretchWidget.prototype.editButtonClicked = function()
{
    if (this.state == "enabled")
    {
        this.enableEditing();
        this.et.nodeValue = "stop editing";
        this.rbtn.disabled = true;
        this.setState("editing");
    }
    else if (this.state == "editing")
    {
        this.disableEditing();
        this.et.nodeValue = "start editing";
        this.rbtn.disabled = false;
        this.ebtn.disabled = true;
        this.setState("stretched");
    }
}

StretchWidget.prototype.resetButtonClicked = function()
{
    if (this.state == "stretched" || this.state == "enabled")
        this.resetStretch(this.defaultDuration);
}

StretchWidget.prototype.addCallback = function(callback)
{
    this.callbacks.push(callback);
}

StretchWidget.prototype.sendSignal = function(name, data)
{
    for (var i = 0; i < this.callbacks.length; i++)
    {
        this.callbacks[i](name, data);
    }
}

StretchWidget.prototype.enable = function()
{
    this.svg.selectAll("*").remove();

    this.svg.classed('sw-enabled', true);    
    this.svg.classed('sw-disabled', false);
    
    this.drawGrid(this.maxSource, this.minTarget, this.maxTarget);
    var pts = this.getPresetStretchPoints("identity");
    this.setStretchPoints(pts);
    
    
    this.ebtn.disabled = false;
    this.rbtn.disabled = false;
    this.setState("enabled");
}

StretchWidget.prototype.disable = function()
{
    console.log("disabled clicked");
    this.svg.selectAll("*").remove();
    
    this.svg.classed('sw-enabled', false);    
    this.svg.classed('sw-disabled', true);
    
    this.drawGrid(this.maxSource, this.minTarget, this.maxTarget);
    
    this.ebtn.disabled = true;
    this.rbtn.disabled = true;    
   // this.setState("disabled");
}

StretchWidget.prototype.drawGrid = function(maxSource, minTarget, maxTarget)
{
    var x = d3.scaleLinear().range([0, this.widgetWidth]);
    var y = d3.scaleLinear().range([this.widgetHeight, 0]);
    var xAxis = d3.axisBottom().scale(x);
    var yAxis = d3.axisLeft().scale(y);
    var xLine = d3.axisTop().scale(x).tickFormat("").tickSize(-this.widgetHeight);
	var yLine = d3.axisRight().scale(y).tickFormat("").tickSize(-this.widgetWidth);
    
    x.domain([0, maxSource]);
    y.domain([minTarget, maxTarget]);

    var minX = 0;
    var maxX = this.widgetWidth;
    var minY = 0;
    var maxY = this.widgetHeight;
    
    this.svg.append("text")
        .attr("x", (this.widgetWidth/ 2))             
        .attr("y", this.widgetHeight + this.margin)
        .attr("text-anchor", "middle")  
        .style("font-size", "16px") 
        .text("source");
	
	this.svg.append("g")
		.attr("transform", "translate(" + -this.margin + "," + this.widgetHeight / 2 + ")")
		.append("text")
        .attr("text-anchor", "middle")  
		.attr("transform", "rotate(-90)")
        .style("font-size", "16px") 
        .text("target")
        
	this.svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + 0 + ", " + this.widgetHeight + ")")
	  .call(xAxis)

	this.svg.append("g")
	  .attr("class", "axis")
	  .call(yAxis);
	  
	this.svg.append("g")
	  .attr("class", "axis")
	  .attr("transform", "translate(" + this.widgetWidth + ", " + 0 + ")")
	  .call(yLine)

	this.svg.append("g")
	  .attr("class", "axis")
	  .call(xLine);
}


StretchWidget.prototype.setStretchPoints = function(stretchPoints)
{
    this.stretchPoints = stretchPoints;
    
    this.svg
      .selectAll('.stretch-point')
      .remove();
      
    this.svg
      .selectAll('.stretch-point')
      .data(this.stretchPoints)
      .enter()
      .append('circle')
      .classed('stretch-point', true)
      .attr('cx', function(d) {
        return d.source;
      })
      .attr('cy', function(d) {
        d3.select(this).moveToBack();
        return d.target;
      })
      .attr('r', this.stretchPointSize);

  
    var stretchInstructions = [];
    for (var i = 0; i < this.numStretchPoints+1; i++)
    {
        stretchInstructions.push(this.diagram2stretched(this.stretchPoints[i]).target);
    }
    
    this.sendSignal("stretch changed", stretchInstructions);
}



StretchWidget.prototype.stretched2normalized = function(p)
{
    return {source: p.source / this.maxSource, target: (p.target - this.minTarget) / (this.maxTarget - this.minTarget)};
}

StretchWidget.prototype.normalized2stretched = function(p)
{
    return {source: p.source * this.maxSource, target: p.target * (this.maxTarget - this.minTarget) + this.minTarget};
}

StretchWidget.prototype.normalized2diagram = function(p)
{
    return {source: p.source * this.widgetWidth, target: (1 - p.target) * this.widgetHeight}
}

StretchWidget.prototype.diagram2normalized = function(p)
{
    return {source: p.source / this.widgetWidth, target: (p.target - this.widgetHeight) / (-this.widgetHeight)}
}

StretchWidget.prototype.stretched2diagram = function(p)
{
    return this.normalized2diagram(this.stretched2normalized(p));
}

StretchWidget.prototype.diagram2stretched = function(p)
{
    return this.normalized2stretched(this.diagram2normalized(p));
}


StretchWidget.prototype.enableEditing = function()
{
    this.editControls = new StretchEditControls(this);
}


StretchWidget.prototype.disableEditing = function()
{
    this.editControls.destroy();
    this.editControls = null;
}

StretchWidget.prototype.resetStretch = function(duration)
{
    this.startStretchAnimations("identity", duration);
}

StretchWidget.prototype.getPresetStretchPoints = function(name)
{
    if (name == "identity")
    {
        var stretchPoints = [];
        for (var i = 0; i < this.numStretchPoints + 1; i++)
        {
            var f = i / this.numStretchPoints;
            var p = { source : f * this.maxSource, target : f * this.maxSource};
            var p_diagram = this.stretched2diagram(p);
            stretchPoints.push(p_diagram);
        }
        return stretchPoints;
    }
    else if (name == "halfed")
    {
        var stretchPoints = [];
        for (var i = 0; i < this.numStretchPoints + 1; i++)
        {
            var f = i / this.numStretchPoints;
            var p = { source : f * this.maxSource, target : 0.5 * f * this.maxSource};
            var p_diagram = this.stretched2diagram(p);
            stretchPoints.push(p_diagram);
        }
        return stretchPoints;
    }
    else if (name == "central cylindrical to mercator")
    {
        var center_bias = this.maxTarget / 4;
        
        var stretchPoints = [];
        for (var i = 0; i < this.numStretchPoints + 1; i++)
        {
            var f = i / this.numStretchPoints;
            var x = f * this.maxSource
            var y = x;
            var latitude = Math.atan(y - center_bias);
            var y_Mercator = Math.log(Math.tan((Math.PI/4) + (latitude/2)));
            var p = { source : x, target : y_Mercator+center_bias};
            var p_diagram = this.stretched2diagram(p);
            stretchPoints.push(p_diagram);
        }
        return stretchPoints;
    }

}

StretchWidget.prototype.startStretchAnimations = function(name, duration)
{
    this.duration = duration;
    var pts = this.getPresetStretchPoints(name);
    
    for (var i = 0; i < this.numStretchPoints + 1; i++)
    {
        pts[i].changePerSecond = (pts[i].target - this.stretchPoints[i].target) / duration;

        if (Math.abs(pts[i].changePerSecond) < this.e)
            pts[i].finished = true;    
        else
            pts[i].finished = false;

        pts[i].currentTarget = this.stretchPoints[i].target;
    }
    
    this.instructions = pts;
    
    if (name == "identity")
        this.setState("unstretching");
    else
        this.setState("stretching");
    
    this.rbtn.disabled = true;
    this.ebtn.disabled = true;
}

StretchWidget.prototype.update = function(delta)
{	
    if (!(this.state == "stretching" || this.state == "unstretching"))
        return
        
    var allFinished = true;
    
    var newPoints = [];
    for (var i = 0; i < this.numStretchPoints + 1; i++)
    {
        var instruction = this.instructions[i];
        if (instruction.finished)
        {
            newPoints.push({source: instruction.source, target: instruction.currentTarget})
        }
        else
        {
            var allFinished = false;
            
            var increment = delta * instruction.changePerSecond;
            var newPosition = instruction.currentTarget + increment;
            
            if ((instruction.changePerSecond >= 0) && (instruction.currentTarget >= instruction.target))
            {
                newPosition = instruction.target;
                instruction.finished = true;        
            }
            else if ((instruction.changePerSecond <= 0) && (instruction.currentTarget <= instruction.target))
            {
                newPosition = instruction.target;
                instruction.finished = true;
            }
            
            
            instruction.currentTarget = newPosition;
            newPoints.push({source: instruction.source, target: instruction.currentTarget});
        }
    }

    this.setStretchPoints(newPoints);
    
    if (allFinished)
    {
        if (this.state == "stretching")
        {
            this.ebtn.disabled = true;
            this.rbtn.disabled = false;   
            this.setState("stretched");
        }
        else if (this.state == "unstretching")
        {
            this.ebtn.disabled = false;
            this.rbtn.disabled = false;
            this.setState("enabled");
        }
    }
}




