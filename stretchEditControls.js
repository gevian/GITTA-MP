/*
Copyright (C) 2019 Magnus Heitzler

This program is free software: you can redistribute it and/or modify
it under the terms of the GNU General Public License as published by
the Free Software Foundation, either version 3 of the License, or
(at your option) any later version.

This program is distributed in the hope that it will be useful,
but WITHOUT ANY WARRANTY; without even the implied warranty of
MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
GNU General Public License for more details.

You should have received a copy of the GNU General Public License
along with this program.  If not, see <https://www.gnu.org/licenses/>.
*/  

/*
Parts of this code are based on the Transfer Function Widget 1.0 by © 2015 Qingya Shu (GPL v2).
http://vis.pku.edu.cn/people/qingyashu/tools/tfwidget/ (05.02.2019)
*/

function StretchEditControls(stretchWidget)
{    
    this.stretchWidget = stretchWidget;
    this.g = this.stretchWidget.svg.append("g").attr("id", "stretch-controls");
    
    this.controlPoints = [];
    this.handles = [];
    this.intersections = [];
    
    this.circleRadius = 8;
    
    this.deltaSource = null;
    this.deltaTarget = null;
    this.deltaSourceHandle = null;
    this.deltaTargetHandle = null;
    
    this.tmpSource = null;
    this.tmpTarget = null;
    this.tmpSourceHandle = null;
    this.tmpTargetHandle = null;
    this.tmpHandle1Source = null;
    this.tmpHandle1Target = null;
    this.tmpHandle2Source = null;
    this.tmpHandle2Target = null;
    
    var creatingNewPointPos = {};
    
    this.initializeControls();
    this.refresh();
    
    var _this = this;
    this.stretchWidget.svg
        .on('mousedown', function(e) {
        var mousePos = d3.mouse(this);
        switch (d3.event.which) {
          case 1:
            _this.addControlPoint( mousePos[0], mousePos[1]);
        }
      })
}

StretchEditControls.prototype.destroy = function()
{
    this.g.remove();
}


StretchEditControls.prototype.handleIdx2circleIdx = function(i)
{
    return Math.ceil(i / 2.0);
}

StretchEditControls.prototype.circleIdx2handleIdx = function(i)
{
    return [i * 2 - 1, i * 2];
}

StretchEditControls.prototype.clamp = function(num)
{
    return Math.min(Math.max(num, 0.0), this.stretchWidget.widgetHeight);
}


StretchEditControls.prototype.initializeControls = function() {
    
    this.controlPoints = [];
    this.handles = [];
    
    var p0 = {source: 0.0, target: 0.0};
    var p1 = {source: 1.0 * this.stretchWidget.maxSource, target: 1.0 * this.stretchWidget.maxSource};

    this.controlPoints.push(this.stretchWidget.stretched2diagram(p0));
    this.controlPoints.push(this.stretchWidget.stretched2diagram(p1));

    var h0 = {source: 0.25 * this.stretchWidget.maxSource, target: 0.25 * this.stretchWidget.maxSource};
    var h1 = {source: 0.75 * this.stretchWidget.maxSource, target: 0.75 * this.stretchWidget.maxSource};
    
    this.handles.push(this.stretchWidget.stretched2diagram(h0));
    this.handles.push(this.stretchWidget.stretched2diagram(h1));
}

StretchEditControls.prototype.refresh = function() {
    this.drawPath();
    this.drawControlPoints();
    this.drawHandles();
    this.drawHandleLines();
    this.computeStretchPoints();
}


StretchEditControls.prototype.drawPath = function() {
    this.g
      .select('#target-curve')
      .remove();

      
    this.g
      .append("path")
      .attr('d', (function() {
       var str = 'M0,' + this.controlPoints[0].target;;
       for (var i = 0; i < this.controlPoints.length-1; i++) {
         
         var nextPoint = this.controlPoints[i+1];
         var nextX = nextPoint.source;
         var nextY = nextPoint.target;
         
         var handle1Idx = this.circleIdx2handleIdx(i)[1];
         var handle2Idx = this.circleIdx2handleIdx(i+1)[0];
         
         var handle1 = this.handles[handle1Idx];
         var handle2 = this.handles[handle2Idx];
         
         str += 'C' + handle1.source + ',' + handle1.target + ' '
                    + handle2.source + ',' + handle2.target + ' '
                    + nextX + ',' + nextY;
       }
       return str;
      }).bind(this))
      .attr('id', 'target-curve');
}

StretchEditControls.prototype.drawControlPoints = function() {
	  
    var _this = this;      
      
    function dragstart(d, i) {
        _this.deltaX = 0;
        _this.deltaY = 0;
        _this.tmpSource = _this.controlPoints[i].source;
        _this.tmpTarget = _this.controlPoints[i].target;

        [_this.handle1Idx, _this.handle2Idx] = _this.circleIdx2handleIdx(i);


        if (_this.handle1Idx >= 0)
        {
            var tmpHandle1 = _this.handles[_this.handle1Idx];   
            _this.tmpHandle1Source = tmpHandle1.source;
            _this.tmpHandle1Target = tmpHandle1.target;        
        }
        else
        {
            _this.tmpHandle1Source = null;
            _this.tmpHandle1Target = null;
        }

        if (_this.handle2Idx < _this.handles.length)
        {
            var tmpHandle2 = _this.handles[_this.handle2Idx];
            _this.tmpHandle2Source = tmpHandle2.source;
            _this.tmpHandle2Target = tmpHandle2.target;        
        }
        else
        {
            _this.tmpHandle2Source = null;
            _this.tmpHandle2Target = null;
        }        

        _this.computeStretchPoints();
    }
      
    function dragmove(d, i) {
    d3.select(this)
      .attr('cx', function() {
        if (i != 0 && i != _this.controlPoints.length-1) {
          _this.deltaX += d3.event.dx;
          var previousX = _this.controlPoints[i-1].source;
          var nextX = _this.controlPoints[i+1].source;
          _this.controlPoints[i].source = _this.tmpSource + _this.deltaX;
          
          if (_this.controlPoints[i].source < previousX) {
            _this.controlPoints[i].source = previousX;
          }
          if (_this.controlPoints[i].source > nextX) {
            _this.controlPoints[i].source = nextX;
          }
		  _this.controlPoints[i].source = _this.clamp(_this.controlPoints[i].source);

          var deltaXActual = _this.controlPoints[i].source - _this.tmpSource;
          
          if (_this.handle1Idx > 0)
          {
              _this.handles[_this.handle1Idx].source = _this.clamp(_this.tmpHandle1Source + deltaXActual)
          }
          
          if (_this.handle2Idx < _this.handles.length)
          {
              _this.handles[_this.handle2Idx].source = _this.clamp(_this.tmpHandle2Source + deltaXActual)
          }
          
          return _this.controlPoints[i].source;
        }
        else {
		  _this.controlPoints[i].source = _this.clamp(_this.controlPoints[i].source);
          return _this.controlPoints[i].source;
        }
      })
      .attr('cy', function(){
        if (i != 0 && i != _this.controlPoints.length-1) {
            _this.deltaY += d3.event.dy;
            var previousY = _this.controlPoints[i-1].target;
            var nextY = _this.controlPoints[i+1].target;
            _this.controlPoints[i].target = _this.tmpTarget + _this.deltaY;
            if (_this.controlPoints[i].target > previousY) {
                _this.controlPoints[i].target = previousY;
            }
            if (_this.controlPoints[i].target < nextY) {
                _this.controlPoints[i].target = nextY;
            }
			_this.controlPoints[i].target = _this.clamp(_this.controlPoints[i].target);
            
            var deltaYActual = _this.controlPoints[i].target - _this.tmpTarget;

            if (_this.handle1Idx > 0)
            {
              _this.handles[_this.handle1Idx].target = _this.clamp(_this.tmpHandle1Target + deltaYActual)
            }

            if (_this.handle2Idx < _this.handles.length)
            {
              _this.handles[_this.handle2Idx].target = _this.clamp(_this.tmpHandle2Target + deltaYActual)
            }
                        
            return _this.controlPoints[i].target;
        }
        else
        {
            _this.deltaY += d3.event.dy;
            _this.controlPoints[i].target = _this.tmpTarget + _this.deltaY;
			_this.controlPoints[i].target = _this.clamp(_this.controlPoints[i].target);
            return _this.controlPoints[i].target;
        }
      });
    _this.drawPath();
    _this.drawHandles();
    _this.drawHandleLines();
    _this.computeStretchPoints();
  }
      
      
    function dragend(d, i) {
        _this.computeStretchPoints();
    }
      
    var drag = d3.drag()
      .subject(function(d) {return d;})
      .on('start', dragstart)
      .on('drag', dragmove)
      .on('end', dragend);
      
    this.g
      .selectAll('.control-point')
      .remove();
      
    this.g
      .selectAll('.control-point')
      .data(this.controlPoints)
      .enter()
      .append('circle')
      .classed('control-point', true)
      .attr('cx', function(d) {
        return d.source;
      })
      .attr('cy', function(d) {
        return d.target;
      })
      .attr('r', this.circleRadius)
      .call(drag)
      .on('mousedown', function(d, i) {
        if (d3.event.which == 3) {
          _this.removeControlPoint(i);
          _this.computeStretchPoints();
        }
      })
}

StretchEditControls.prototype.drawHandles = function() {
    
    var _this = this;
    
    function dragstartHandle(d, i) {
        _this.deltaXHandle = 0;
        _this.deltaYHandle = 0;
        _this.tmpSourceHandle = _this.handles[i].source;
        _this.tmpTargetHandle = _this.handles[i].target;
    }

     function dragmoveHandle(d, i) {
        d3.select(this)
          .attr('cx', function() {
            _this.deltaXHandle += d3.event.dx;
            if (i == 0)
                var previousX = 0;
            else
                var previousX = _this.handles[i-1].source;
            
            if (i == _this.handles.length-1)
                var nextX = 1;
            else
                var nextX = _this.handles[i+1].source;
            
            _this.handles[i].source = _this.tmpSourceHandle + _this.deltaXHandle;
            
            _this.handles[i].source = _this.clamp(_this.handles[i].source);
            return _this.handles[i].source;
          })
          .attr('cy', function(){
            _this.deltaYHandle += d3.event.dy;
            if (i == 0)
                var previousY = 0;
            else
                var previousY = _this.handles[i-1].target;
            
            if (i == _this.handles.length-1)
                var nextY = 1;
            else
                var nextY = _this.handles[i+1].target;
            
            _this.handles[i].target = _this.tmpTargetHandle + _this.deltaYHandle;

            _this.handles[i].target = _this.clamp(_this.handles[i].target);
            return _this.handles[i].target;
          });
        _this.drawPath();
        _this.drawHandleLines();
        _this.computeStretchPoints();
      }
    
    
    function dragendHandle(d, i) {
        _this.computeStretchPoints();
    }  
    
    var dragHandle = d3.drag()
         .subject(function(d) {return d;})
         .on('start', dragstartHandle)
         .on('drag', dragmoveHandle)
         .on('end', dragendHandle);		 
    
    
    this.g
        .selectAll('.handle-point')
        .remove();

    this.g
        .selectAll('.handle-point')
        .data(this.handles)
        .enter()
        .append('circle')
        .classed('handle-point', true)
        .attr('cx', function(d) {
        return d.source;
        })
        .attr('cy', function(d) {
        return d.target;
        })
        .attr('r', this.circleRadius)
        .call(dragHandle)
    }

StretchEditControls.prototype.drawHandleLines = function() {
    
    var _this = this;
    this.g
      .selectAll('.handle-line')
      .remove();
      
    this.g
      .selectAll('.handle-line')
      .data(this.handles)
      .enter()
      .append('line')
      .classed('handle-line', true)
      .attr('x1', function(d, i) {
        return d.source;
      })
      .attr('x2', function(d, i) {
        return _this.controlPoints[_this.handleIdx2circleIdx(i)].source;
      })
      .attr('y1', function(d, i) {
        return d.target;
      })
      .attr('y2', function(d, i) {
        d3.select(this).moveToBack();
		return _this.controlPoints[_this.handleIdx2circleIdx(i)].target;
      })
}


StretchEditControls.prototype.addControlPoint = function(source, target) {
    var p = this.stretchWidget.diagram2normalized({source: source, target: target});
    
    // invalid point location
    if (p.source < 0.0 || p.source > 1.0 || p.target < 0.0 || p.target > 1.0)
        return;
    
    var insertSource = 0;
    while (this.controlPoints[insertSource].source < source) {
      insertSource++;
    }
    
    var newp = {source: source, target: target};
    this.controlPoints.splice(insertSource, 0, newp);
    
    var [leftHandleX1Idx, leftHandleX2Idx]   = this.circleIdx2handleIdx(insertSource-1);
    var [rightHandleX1Idx, rightHandleX2Idx] = this.circleIdx2handleIdx(insertSource);

    var leftSource = this.handles[leftHandleX2Idx].source;
    var rightSource = this.handles[rightHandleX1Idx].source;

    var leftSourceAvg  = (source +  leftSource) / 2;
    var rightSourceAvg = (source + rightSource) / 2;

    var leftHandle = {source: leftSourceAvg,   target: target};
    var rightHandle = {source: rightSourceAvg, target: target};
    
    
    this.handles.splice(rightHandleX1Idx, 0, leftHandle, rightHandle);

    var leftIdx  = leftHandleX2Idx;
    var rightIdx = rightHandleX1Idx + 2;

    this.refresh();
}


StretchEditControls.prototype.removeControlPoint = function(i) {
    if (i == 0 || i == this.controlPoints.length-1) return;
    this.controlPoints.splice(i, 1);
	var [handleIdx1, handleIdx2] = this.circleIdx2handleIdx(i);
	this.handles.splice(handleIdx1, 2);
    
    this.refresh();
  }



StretchEditControls.prototype.computeStretchPoints = function() {
    var pathEl = this.g.select("#target-curve").node();
    var pathLength = pathEl.getTotalLength();

    var n_segments = 100;
    var segments = [];
    for (var i=0; i<n_segments; i++)
    {
        var pos1 = pathEl.getPointAtLength(pathLength * i / n_segments);
        var pos2 = pathEl.getPointAtLength(pathLength * (i+1) / n_segments);
        
        if (i == n_segments-1)
        {
            var coords = pathEl.attributes["d"].value.split(" ");
            var lastCoord = coords[coords.length - 1].split(",");

            pos2.x = lastCoord[0];
            pos2.y = lastCoord[1];
        }
        
        var line = {x1: pos1.x, x2: pos2.x, y1: pos1.y, y2: pos2.y};
        segments.push(line);
    };
    
    intersections = [];
    var n_samples = this.stretchWidget.numStretchPoints;
    for (var i = 0; i < n_samples+1; i++)
    {
        var x = (i / n_samples);
        var y = 0.0;
        
        var p = this.stretchWidget.normalized2diagram({source: x, target: y});
        
        var line = {x1: Math.round(p.source), x2: Math.round(p.source), y1: 0, y2: p.target};
        var pts = [];
        for (var a = 0; a < segments.length; a++)
        {
            var pt = this.line_line_intersect(line, segments[a]);
            if (typeof(pt) != "string")
            {
                pts.push(pt);
            }
        }
        pts.sort(function(a, b) {a.y - b.y});
        
        var closestPoint = pts[0];
        intersections.push(pts[0]);
    }
    
    this.stretchWidget.setStretchPoints(intersections);
}




// source: GPL3 (https://bl.ocks.org/bricof/f1f5b4d4bc02cad4dea454a3c5ff8ad7)  
StretchEditControls.prototype.line_line_intersect = function(line1, line2) {
  var x1 = line1.x1, x2 = line1.x2, x3 = line2.x1, x4 = line2.x2;
  var y1 = line1.y1, y2 = line1.y2, y3 = line2.y1, y4 = line2.y2;
  var pt_denom = (x1 - x2) * (y3 - y4) - (y1 - y2) * (x3 - x4);
  var pt_x_num = (x1*y2 - y1*x2) * (x3 - x4) - (x1 - x2) * (x3*y4 - y3*x4);
  var pt_y_num = (x1*y2 - y1*x2) * (y3 - y4) - (y1 - y2) * (x3*y4 - y3*x4);
  if (pt_denom == 0) { return "parallel"; }
  else { 
    var pt = {source: pt_x_num / pt_denom, target: pt_y_num / pt_denom}; 
    if (this.btwn(pt.source, x1, x2) && this.btwn(pt.target, y1, y2) && this.btwn(pt.source, x3, x4) && this.btwn(pt.target, y3, y4)) { return pt; }
    else { return "not in range"; }
  }
}  

StretchEditControls.prototype.btwn = function(a, b1, b2) {
  if ((a >= b1) && (a <= b2)) { return true; }
  if ((a >= b2) && (a <= b1)) { return true; }
  return false;
}




