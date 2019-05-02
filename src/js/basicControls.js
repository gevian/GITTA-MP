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
    
function Controls(canvas, earth, surface, stretchWidget, projectionCenter, cutIndicator, LineProjector)
{
	var _this = this;
    this.earth = earth;	
	this.surface = surface;
    this.stretchWidget = stretchWidget;
	this.projectionCenter = projectionCenter;
	this.cutIndicator = cutIndicator;
	this.LineProjector = LineProjector;
	this.canvas = canvas;
	
	this.surface.setFormsCallbacks(this.rolledToFlattened.bind(this), this.flattenedToRolled.bind(this), this.flattenedToStretched.bind(this), this.stretchedToFlattened.bind(this));

	this.positionSlider       = document.getElementById("position_slider");
	this.positionBox          = document.getElementById("position_box");
 
	this.radiusSlider         = document.getElementById("radius_slider");
	this.radiusBox            = document.getElementById("radius_box");

	this.lightSourceOffsetSlider    = document.getElementById("lightsource_offset_slider");
	this.lightSourceOffsetBox       = document.getElementById("lightsource_offset_box");

	this.axisSlider           = document.getElementById("axis_slider");
	this.upperRadiusSlider    = document.getElementById("upper_radius_slider");
	this.lowerRadiusSlider    = document.getElementById("lower_radius_slider");
	this.geometryOffsetSlider = document.getElementById("geometry_offset_slider");
	
	this.axisBox              = document.getElementById("axis_box");
	this.upperRadiusBox       = document.getElementById("upper_radius_box");
	this.lowerRadiusBox       = document.getElementById("lower_radius_box");
	this.geometryOffsetBox    = document.getElementById("geometry_offset_box");

	this.lightSourceScaleSlider     = document.getElementById("lightsource_scale_slider");
	this.lightSourceScaleBox        = document.getElementById("lightsource_scale_box");
    
    this.bordersCheckbox   = document.getElementById("borders-checkbox");
	this.graticuleCheckbox = document.getElementById("graticule-checkbox");
	this.tissotCheckbox    = document.getElementById("tissot-checkbox");
    
	this.bordersCheckbox.onclick   = bordersChanged;
	this.graticuleCheckbox.onclick = graticuleChanged;
	this.tissotCheckbox.onclick    = tissotChanged;
    
    this.radiusSlider.oninput = radiusSliderChanged;
	this.positionSlider.oninput = positionSliderChanged;
	this.axisSlider.oninput = axisSliderChanged;
	this.upperRadiusSlider.oninput = upperRadiusSliderChanged;
	this.lowerRadiusSlider.oninput = lowerRadiusSliderChanged;
	this.geometryOffsetSlider.oninput = geometryOffsetSliderChanged;

    this.radiusBox.oninput = radiusBoxChanged;
	this.positionBox.oninput = positionBoxChanged;	
	this.axisBox.oninput = axisBoxChanged;
	this.upperRadiusBox.oninput = upperRadiusBoxChanged;
	this.lowerRadiusBox.oninput = lowerRadiusBoxChanged;
	this.geometryOffsetBox.oninput = geometryOffsetBoxChanged;
	
	this.lightSourceScaleSlider.oninput = lightSourceScaleSliderChanged;
	this.lightSourceScaleBox.oninput    = lightSourceScaleBoxChanged;
	
    this.lightSourceOffsetSlider.oninput = lightSourceOffsetSliderChanged;
	this.lightSourceOffsetBox.oninput    = lightSourceOffsetBoxChanged;
    
	this.rollButton = document.getElementById("roll-button");
	this.rollButton.onclick = rollClicked;
	
	function rollClicked() {
		_this.surface.toggleRoll();

		_this.LineProjector.disableLines();
	}
        

        
    function computeGeometryValues()
    {
       var v = 1 - _this.positionSlider.value;
       var r = _this.radiusSlider.value;
       
       var v_radius = ((1-v) * Math.PI);
       var x = Math.sin(v_radius) * r;
       var y = Math.cos(v_radius) * r;       

       var x_ortho =  y / r;
       var y_ortho = -x / r;
       
       var x_vec1 = x + x_ortho;
       var y_vec1 = y + y_ortho;

       var x_vec2 = x - x_ortho;
       var y_vec2 = y - y_ortho;

       if (x_vec1 < 0)
       {
           var alpha = Math.atan2(x, y);
           var intersection_y = r / Math.cos(alpha);
           
           var y_vec1_red = y_vec1 - intersection_y;
           
           x_vec2 -= x_vec1;
           y_vec2 -= y_vec1_red;
           
           x_vec1 = 0;
           y_vec1 = intersection_y;
       }
       
       if (x_vec2 < 0)
       {
           var alpha = Math.atan2(x, y);
           var intersection_y = r / Math.cos(alpha);
           
           var y_vec2_red = y_vec2 - intersection_y;
           
           x_vec1 -= x_vec2;
           y_vec1 -= y_vec2_red;
           
           x_vec2 = 0;
           y_vec2 = intersection_y;
       }
       
       var a = Math.abs(y_vec1 - y_vec2);
       var ur = x_vec1;
       var lr = x_vec2;
       var o = -(y_vec1 + y_vec2)/2;
       
       _this.axisSlider.value = a;
       _this.upperRadiusSlider.value = ur;
       _this.lowerRadiusSlider.value = lr;
       _this.geometryOffsetSlider.value = o;
       
       _this.axisSlider.oninput();
       _this.lowerRadiusSlider.oninput();
       _this.upperRadiusSlider.oninput();
       _this.geometryOffsetSlider.oninput();
    }    
        
    
	function positionSliderChanged(event) {
	   _this.positionBox.oninput = null;
	   _this.positionBox.value = _this.positionSlider.value;
	   _this.positionBox.oninput = positionBoxChanged;
       
       computeGeometryValues();
	}
	
	function positionBoxChanged(event) {
	   _this.positionSlider.oninput = null;
	   _this.positionSlider.value = _this.positionBox.value;
	   _this.positionSlider.oninput = positionSliderChanged;
       
       computeGeometryValues();
	}
        
	function radiusSliderChanged(event) {
	   _this.radiusBox.oninput = null;
	   _this.radiusBox.value = _this.radiusSlider.value;
	   _this.radiusBox.oninput = radiusBoxChanged;
       
       computeGeometryValues();
	}
	
	function radiusBoxChanged(event) {
	   _this.radiusSlider.oninput = null;
	   _this.radiusSlider.value = _this.radiusBox.value;
	   _this.radiusSlider.oninput = radiusSliderChanged;
       
       computeGeometryValues();
	}
    
	function orientationSliderChanged(event) {
	   _this.latBox.oninput = null;
	   _this.lonBox.oninput = null;
	   _this.rotBox.oninput = null;
	   
	   _this.latBox.value = _this.latSlider.value;
	   _this.lonBox.value = _this.lonSlider.value;
	   _this.rotBox.value = _this.rotSlider.value;
	   
	   _this.latBox.oninput = orientationBoxChanged;
	   _this.lonBox.oninput = orientationBoxChanged;
	   _this.rotBox.oninput = orientationBoxChanged;
	   
	   var lat = (((_this.latSlider.value - 90) / 360) * 2 * Math.PI);
	   var lon = ((_this.lonSlider.value / 360) * 2 * Math.PI);
	   var rot = ((_this.rotSlider.value / 360) * 2 * Math.PI);
	   
	   _this.surface.setOrientation(lat, lon, rot);
	   _this.projectionCenter.setOrientation(lat, lon, rot);
	   
	   _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
	   _this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	function orientationBoxChanged(event) {
	   _this.latSlider.oninput = null;
	   _this.lonSlider.oninput = null;
	   _this.rotSlider.oninput = null;
	   
	   _this.latSlider.value = _this.latBox.value;
	   _this.lonSlider.value = _this.lonBox.value;
	   _this.rotSlider.value = _this.rotBox.value;
	   
	   _this.latSlider.oninput = orientationSliderChanged;
	   _this.lonSlider.oninput = orientationSliderChanged;
	   _this.rotSlider.oninput = orientationSliderChanged;
	   
	   var lat = (((_this.latSlider.value - 90) / 360) * 2 * Math.PI);
	   var lon = ((_this.lonSlider.value / 360) * 2 * Math.PI);
	   var rot = ((_this.rotSlider.value / 360) * 2 * Math.PI);
	   
	   _this.surface.setOrientation(lat, lon, rot);
	   _this.projectionCenter.setOrientation(lat, lon, rot);
	   
	   _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
	   _this.cutIndicator.updateGeometry();
	   _this.LineProjector.updateLines();
	}
			

	function axisSliderChanged(event) {
		_this.axisBox.oninput = null;
		_this.axisBox.value   = _this.axisSlider.value;
		_this.axisBox.oninput = axisBoxChanged;
		
		_this.surface.setAxisLength(_this.axisBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	
	function axisBoxChanged(event) {
		_this.axisSlider.oninput = null;
		_this.axisSlider.value   = _this.axisBox.value;
		_this.axisSlider.oninput = axisSliderChanged; 
		
		_this.surface.setAxisLength(_this.axisBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	
	function upperRadiusSliderChanged(event) {
		_this.upperRadiusBox.oninput = null;
		_this.upperRadiusBox.value   = _this.upperRadiusSlider.value;
		_this.upperRadiusBox.oninput = upperRadiusBoxChanged;
		
		_this.surface.setTopRadius(_this.upperRadiusBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	
	function upperRadiusBoxChanged(event) {
		_this.upperRadiusSlider.oninput = null;
		_this.upperRadiusSlider.value   = _this.upperRadiusBox.value;
		_this.upperRadiusSlider.oninput = upperRadiusSliderChanged; 
		
		_this.surface.setTopRadius(_this.upperRadiusBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	function lowerRadiusSliderChanged(event) {
		_this.lowerRadiusBox.oninput = null;
		_this.lowerRadiusBox.value   = _this.lowerRadiusSlider.value;
		_this.lowerRadiusBox.oninput = lowerRadiusBoxChanged;
		
		_this.surface.setBottomRadius(_this.lowerRadiusBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	
	function lowerRadiusBoxChanged(event) {
		_this.lowerRadiusSlider.oninput = null;
		_this.lowerRadiusSlider.value   = _this.lowerRadiusBox.value;
		_this.lowerRadiusSlider.oninput = lowerRadiusSliderChanged; 
		
		_this.surface.setBottomRadius(_this.lowerRadiusBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	
	function geometryOffsetSliderChanged(event) {
		_this.geometryOffsetBox.oninput = null;
		_this.geometryOffsetBox.value   = _this.geometryOffsetSlider.value;
		_this.geometryOffsetBox.oninput = geometryOffsetBoxChanged;
		
		_this.surface.setGeometryOffset(_this.geometryOffsetBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	function geometryOffsetBoxChanged(event) {
		_this.geometryOffsetSlider.oninput = null;
		_this.geometryOffsetSlider.value   = _this.geometryOffsetBox.value;
		_this.geometryOffsetSlider.oninput = geometryOffsetSliderChanged; 
		
		_this.surface.setGeometryOffset(_this.geometryOffsetBox.value);
		_this.cutIndicator.updateGeometry();
		_this.LineProjector.updateLines();
	}
	
	function lightSourceOffsetSliderChanged(event) {
		_this.lightSourceOffsetBox.oninput = null;
		_this.lightSourceOffsetBox.value   = _this.lightSourceOffsetSlider.value;
		_this.lightSourceOffsetBox.oninput = lightSourceOffsetBoxChanged;
		
		_this.projectionCenter.setOffset(_this.lightSourceOffsetBox.value);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}
	
	function lightSourceOffsetBoxChanged(event) {
		_this.lightSourceOffsetSlider.oninput = null;
		_this.lightSourceOffsetSlider.value   = _this.lightSourceOffsetBox.value;
		_this.lightSourceOffsetSlider.oninput = lightSourceOffsetSliderChanged; 
		
		_this.projectionCenter.setOffset(_this.lightSourceOffsetBox.value);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}

	function lightSourceScaleSliderChanged(event) {
		_this.lightSourceScaleBox.oninput = null;
		_this.lightSourceScaleBox.value   = _this.lightSourceScaleSlider.value;
		_this.lightSourceScaleBox.oninput = lightSourceScaleBoxChanged;
		
		_this.projectionCenter.setScale(_this.lightSourceScaleBox.value);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}
	
	function lightSourceScaleBoxChanged(event) {
		_this.lightSourceScaleSlider.oninput = null;
		_this.lightSourceScaleSlider.value   = _this.lightSourceScaleBox.value;
		_this.lightSourceScaleSlider.oninput = lightSourceScaleSliderChanged; 
		
		_this.projectionCenter.setScale(_this.lightSourceScaleBox.value);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}
	
	function lightSourceLatitudeSliderChanged(event) {
		_this.lightSourceLatitudeBox.oninput = null;
		_this.lightSourceLatitudeBox.value   = _this.lightSourceLatitudeSlider.value;
		_this.lightSourceLatitudeBox.oninput = lightSourceLatitudeBoxChanged;
		
		var rot = ((_this.lightSourceLatitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLatitude(rot);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}
	
	function lightSourceLatitudeBoxChanged(event) {
		_this.lightSourceLatitudeSlider.oninput = null;
		_this.lightSourceLatitudeSlider.value   = _this.lightSourceLatitudeBox.value;
		_this.lightSourceLatitudeSlider.oninput = lightSourceLatitudeSliderChanged; 
		
		var rot = ((_this.lightSourceLatitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLatitude(rot);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}
	
	function lightSourceLongitudeSliderChanged(event) {
		_this.lightSourceLongitudeBox.oninput = null;
		_this.lightSourceLongitudeBox.value   = _this.lightSourceLongitudeSlider.value;
		_this.lightSourceLongitudeBox.oninput = lightSourceLongitudeBoxChanged;
		
		var rot = ((_this.lightSourceLongitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLongitude(rot);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}
	
	function lightSourceLongitudeBoxChanged(event) {
		_this.lightSourceLongitudeSlider.oninput = null;
		_this.lightSourceLongitudeSlider.value   = _this.lightSourceLongitudeBox.value;
		_this.lightSourceLongitudeSlider.oninput = lightSourceLongitudeSliderChanged; 
		
		var rot = ((_this.lightSourceLongitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLongitude(rot);
	    _this.surface.setProjectionTorusParams(_this.projectionCenter.scale, _this.projectionCenter.lightCenter.matrixWorld);
		_this.LineProjector.updateLines();
	}
	
	
    function bordersChanged(event) {        
        if (_this.bordersCheckbox.checked)
        {
            _this.earth.enableBordersTexture();
            _this.surface.enableBordersTexture();
        }
        else
        {
            _this.earth.disableBordersTexture();
            _this.surface.disableBordersTexture();
        }
        
    }
    
    function graticuleChanged(event) {
        if (_this.graticuleCheckbox.checked)
        {
            _this.earth.enableGraticuleTexture();
            _this.surface.enableGraticuleTexture();
        }
        else
        {
            _this.earth.disableGraticuleTexture();
            _this.surface.disableGraticuleTexture();
        }
    }
    
    function tissotChanged(event) {
        if (_this.tissotCheckbox.checked)
        {
            _this.earth.enableTissotTexture();
            _this.surface.enableTissotTexture();
        }
        else
        {
            _this.earth.disableTissotTexture();
            _this.surface.disableTissotTexture();
        }
    }

}

Controls.prototype.disableForms = function()
{
    var fieldsets = [];
    fieldsets.push(document.getElementById("geometry-fieldset"));
    fieldsets.push(document.getElementById("simple-geometry-fieldset"));
    
	for(var i = 0; i < fieldsets.length; i++) {
		fieldsets[i].disabled = true;
	}
}

Controls.prototype.enableForms = function()
{
    var fieldsets = [];
    fieldsets.push(document.getElementById("geometry-fieldset"));
    fieldsets.push(document.getElementById("simple-geometry-fieldset"));

	for(var i = 0; i < fieldsets.length; i++) {
		fieldsets[i].disabled = false;
	}
}


Controls.prototype.flattenedToRolled = function(roll)
{
    this.enableForms();
	
	var tutButtons = document.querySelectorAll(".tut-button button");
	
	for(var i = 0; i < tutButtons.length; i++) {
		tutButtons[i].removeAttribute("disabled");
	}
	
	var tutButtonsScaling = document.querySelectorAll(".tut-button-scaling button");
	
	for(var i = 0; i < tutButtonsScaling.length; i++) {
		tutButtonsScaling[i].setAttribute("disabled", "disabled");
	}
    
    
	document.getElementById("reset-button").removeAttribute("disabled");
	document.getElementById("remove-line-button").removeAttribute("disabled");
	var rollButton = document.getElementById("roll-button");
	if (roll)
	{
		rollButton.innerHTML = "flatten";
	}
	else
	{
		rollButton.removeAttribute("disabled");
	}
}


Controls.prototype.rolledToFlattened = function(roll)
{
    this.disableForms();
	
	var tutButtons = document.querySelectorAll(".tut-button button");
	
	for(var i = 0; i < tutButtons.length; i++) {
		tutButtons[i].setAttribute("disabled", "disabled");
	}

	var tutButtonsScaling = document.querySelectorAll(".tut-button-scaling button");
	
	for(var i = 0; i < tutButtonsScaling.length; i++) {
		tutButtonsScaling[i].removeAttribute("disabled");
	}
    
    
	document.getElementById("reset-button").setAttribute("disabled", "disabled");
	document.getElementById("remove-line-button").setAttribute("disabled", "disabled");
	var rollButton = document.getElementById("roll-button");
	if (roll)
	{
		rollButton.innerHTML = "roll";
	}
	else
	{
		rollButton.setAttribute("disabled", "disabled");
	}
    
    
}


Controls.prototype.flattenedToStretched = function()
{
	var rollButton = document.getElementById("roll-button");
    rollButton.setAttribute("disabled", "disabled");
}


Controls.prototype.stretchedToFlattened = function()
{
	var rollButton = document.getElementById("roll-button");
    rollButton.removeAttribute("disabled");
}


Controls.prototype.reset = function()
{
	document.getElementById("simple_geometry").reset();    
	document.getElementById("surface_geometry").reset();
	document.getElementById("lightsource").reset();
	document.getElementById("textures").reset();
}




































