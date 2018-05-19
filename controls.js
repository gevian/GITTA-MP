function Controls(earth, surface, projectionCenter, cutIndicator)
{
	var _this = this;
    this.earth = earth;	
	this.surface = surface;
	this.projectionCenter = projectionCenter;
	this.cutIndicator = cutIndicator;
	
	this.surface.setFormsCallbacks(this.enableForms, this.disableForms);
	
	this.latSlider = document.getElementById("lat_slider");
	this.lonSlider = document.getElementById("lon_slider");
	this.rotSlider = document.getElementById("rot_slider");

	this.latBox = document.getElementById("lat_box");
	this.lonBox = document.getElementById("lon_box");
	this.rotBox = document.getElementById("rot_box");
	
	this.axisSlider           = document.getElementById("axis_slider");
	this.upperRadiusSlider    = document.getElementById("upper_radius_slider");
	this.lowerRadiusSlider    = document.getElementById("lower_radius_slider");
	this.geometryOffsetSlider = document.getElementById("geometry_offset_slider");
	
	this.axisBox              = document.getElementById("axis_box");
	this.upperRadiusBox       = document.getElementById("upper_radius_box");
	this.lowerRadiusBox       = document.getElementById("lower_radius_box");
	this.geometryOffsetBox    = document.getElementById("geometry_offset_box");
	
	this.lightSourceVerticalOffsetSlider = document.getElementById("lightsource_vertical_offset_slider");
	this.lightSourceVerticalOffsetBox    = document.getElementById("lightsource_vertical_offset_box");
	this.lightSourceHorizontalOffsetSlider = document.getElementById("lightsource_horizontal_offset_slider");
	this.lightSourceHorizontalOffsetBox    = document.getElementById("lightsource_horizontal_offset_box");
	this.lightSourceRotationSlider = document.getElementById("lightsource_rotation_slider");
	this.lightSourceRotationBox    = document.getElementById("lightsource_rotation_box");
	
	this.bordersCheckbox   = document.getElementById("borders-checkbox");
	this.graticuleCheckbox = document.getElementById("graticule-checkbox");
	this.tissotCheckbox    = document.getElementById("tissot-checkbox");
    
    
	this.latSlider.oninput = orientationSliderChanged;
	this.lonSlider.oninput = orientationSliderChanged;
	this.rotSlider.oninput = orientationSliderChanged;

	this.latBox.oninput = orientationBoxChanged;
	this.lonBox.oninput = orientationBoxChanged;
	this.rotBox.oninput = orientationBoxChanged;
	
	this.axisSlider.oninput = axisSliderChanged;
	this.upperRadiusSlider.oninput = upperRadiusSliderChanged;
	this.lowerRadiusSlider.oninput = lowerRadiusSliderChanged;
	this.geometryOffsetSlider.oninput = geometryOffsetSliderChanged;
	
	this.axisBox.oninput = axisBoxChanged;
	this.upperRadiusBox.oninput = upperRadiusBoxChanged;
	this.lowerRadiusBox.oninput = lowerRadiusBoxChanged;
	this.geometryOffsetBox.oninput = geometryOffsetBoxChanged;
	
	this.lightSourceVerticalOffsetSlider.oninput = lightSourceVerticalOffsetSliderChanged;
	this.lightSourceVerticalOffsetBox.oninput    = lightSourceVerticalOffsetBoxChanged;

	this.lightSourceHorizontalOffsetSlider.oninput = lightSourceHorizontalOffsetSliderChanged;
	this.lightSourceHorizontalOffsetBox.oninput    = lightSourceHorizontalOffsetBoxChanged;
	
	this.lightSourceRotationSlider.oninput = lightSourceRotationSliderChanged;
	this.lightSourceRotationBox.oninput    = lightSourceRotationBoxChanged;
	
	
	this.bordersCheckbox.onclick   = bordersChanged;
	this.graticuleCheckbox.onclick = graticuleChanged;
	this.tissotCheckbox.onclick    = tissotChanged;
    
    
	this.rollButton = document.getElementById("roll-button");
	this.rollButton.onclick = rollClicked;
	
	function rollClicked() {
		_this.surface.toggleRoll();
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
	   _this.projectionCenter.setOrientation(lat, lon);
	   
	   _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
	   _this.cutIndicator.updateGeometry();
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
	   _this.projectionCenter.setOrientation(lat, lon);
	   
	   _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
	   _this.cutIndicator.updateGeometry();
	}
			

	function axisSliderChanged(event) {
		_this.axisBox.oninput = null;
		_this.axisBox.value   = _this.axisSlider.value;
		_this.axisBox.oninput = axisBoxChanged;
		
		_this.surface.setAxisLength(_this.axisBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	
	function axisBoxChanged(event) {
		_this.axisSlider.oninput = null;
		_this.axisSlider.value   = _this.axisBox.value;
		_this.axisSlider.oninput = axisSliderChanged; 
		
		_this.surface.setAxisLength(_this.axisBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	
	function upperRadiusSliderChanged(event) {
		_this.upperRadiusBox.oninput = null;
		_this.upperRadiusBox.value   = _this.upperRadiusSlider.value;
		_this.upperRadiusBox.oninput = upperRadiusBoxChanged;
		
		_this.surface.setTopRadius(_this.upperRadiusBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	
	function upperRadiusBoxChanged(event) {
		_this.upperRadiusSlider.oninput = null;
		_this.upperRadiusSlider.value   = _this.upperRadiusBox.value;
		_this.upperRadiusSlider.oninput = upperRadiusSliderChanged; 
		
		_this.surface.setTopRadius(_this.upperRadiusBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	function lowerRadiusSliderChanged(event) {
		_this.lowerRadiusBox.oninput = null;
		_this.lowerRadiusBox.value   = _this.lowerRadiusSlider.value;
		_this.lowerRadiusBox.oninput = lowerRadiusBoxChanged;
		
		_this.surface.setBottomRadius(_this.lowerRadiusBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	
	function lowerRadiusBoxChanged(event) {
		_this.lowerRadiusSlider.oninput = null;
		_this.lowerRadiusSlider.value   = _this.lowerRadiusBox.value;
		_this.lowerRadiusSlider.oninput = lowerRadiusSliderChanged; 
		
		_this.surface.setBottomRadius(_this.lowerRadiusBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	
	function geometryOffsetSliderChanged(event) {
		_this.geometryOffsetBox.oninput = null;
		_this.geometryOffsetBox.value   = _this.geometryOffsetSlider.value;
		_this.geometryOffsetBox.oninput = geometryOffsetBoxChanged;
		
		_this.surface.setGeometryOffset(_this.geometryOffsetBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	function geometryOffsetBoxChanged(event) {
		_this.geometryOffsetSlider.oninput = null;
		_this.geometryOffsetSlider.value   = _this.geometryOffsetBox.value;
		_this.geometryOffsetSlider.oninput = geometryOffsetSliderChanged; 
		
		_this.surface.setGeometryOffset(_this.geometryOffsetBox.value);
		_this.cutIndicator.updateGeometry();
	}
	
	function lightSourceVerticalOffsetSliderChanged(event) {
		_this.lightSourceVerticalOffsetBox.oninput = null;
		_this.lightSourceVerticalOffsetBox.value   = _this.lightSourceVerticalOffsetSlider.value;
		_this.lightSourceVerticalOffsetBox.oninput = lightSourceVerticalOffsetBoxChanged;
		
		_this.projectionCenter.setVerticalOffset(_this.lightSourceVerticalOffsetBox.value);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
	}
	
	function lightSourceVerticalOffsetBoxChanged(event) {
		_this.lightSourceVerticalOffsetSlider.oninput = null;
		_this.lightSourceVerticalOffsetSlider.value   = _this.lightSourceVerticalOffsetBox.value;
		_this.lightSourceVerticalOffsetSlider.oninput = lightSourceVerticalOffsetSliderChanged; 
		
		_this.projectionCenter.setVerticalOffset(_this.lightSourceVerticalOffsetBox.value);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
	}
    
	function lightSourceHorizontalOffsetSliderChanged(event) {
		_this.lightSourceHorizontalOffsetBox.oninput = null;
		_this.lightSourceHorizontalOffsetBox.value   = _this.lightSourceHorizontalOffsetSlider.value;
		_this.lightSourceHorizontalOffsetBox.oninput = lightSourceHorizontalOffsetBoxChanged;
		
		_this.projectionCenter.setHorizontalOffset(_this.lightSourceHorizontalOffsetBox.value);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
	}
	
	function lightSourceHorizontalOffsetBoxChanged(event) {
		_this.lightSourceHorizontalOffsetSlider.oninput = null;
		_this.lightSourceHorizontalOffsetSlider.value   = _this.lightSourceHorizontalOffsetBox.value;
		_this.lightSourceHorizontalOffsetSlider.oninput = lightSourceHorizontalOffsetSliderChanged; 
		
		_this.projectionCenter.setHorizontalOffset(_this.lightSourceHorizontalOffsetBox.value);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
	}
	
	function lightSourceRotationSliderChanged(event) {
		_this.lightSourceRotationBox.oninput = null;
		_this.lightSourceRotationBox.value   = _this.lightSourceRotationSlider.value;
		_this.lightSourceRotationBox.oninput = lightSourceRotationBoxChanged;
		
		var rot = ((_this.lightSourceRotationBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setRotation(rot);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
	}
	
	function lightSourceRotationBoxChanged(event) {
		_this.lightSourceRotationSlider.oninput = null;
		_this.lightSourceRotationSlider.value   = _this.lightSourceRotationBox.value;
		_this.lightSourceRotationSlider.oninput = lightSourceRotationSliderChanged; 
		
		var rot = ((_this.lightSourceRotationBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setRotation(rot);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
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

Controls.prototype.reset = function()
{
	document.getElementById("surface_orientation").reset();
	document.getElementById("surface_geometry").reset();
	document.getElementById("lightsource").reset();
	document.getElementById("textures").reset();
}

Controls.prototype.enableForms = function()
{
	var fieldsets = document.getElementsByTagName('fieldset');

	for(var i = 0; i < fieldsets.length; i++) {
		fieldsets[i].disabled = false;
	}
	
	var rollButton = document.getElementById("roll-button");
	
	rollButton.innerHTML = "unroll";
	
}

Controls.prototype.disableForms = function()
{
	var fieldsets = document.getElementsByTagName('fieldset');

	for(var i = 0; i < fieldsets.length; i++) {
		fieldsets[i].disabled = true;
	}
	
	var rollButton = document.getElementById("roll-button");
	
	rollButton.innerHTML = "roll";
	
}


Controls.prototype.setProjection = function(name)
{
	if (name == "gnomonic")
	{
		this.axisSlider.value = 0;
		this.axisSlider.oninput();
		this.upperRadiusSlider.value = 0.01;
		this.upperRadiusSlider.oninput();
		this.lowerRadiusSlider.value = 4;
		this.lowerRadiusSlider.oninput();
		this.geometryOffsetSlider.value = 1;
		this.geometryOffsetSlider.oninput();
		this.lightSourceOffsetSlider.value = 0;
		this.lightSourceOffsetSlider.oninput();
	}
	
}

Controls.prototype.resetControls = function()
{
	this.setProjection("gnomonic");
	
	this.latSlider.value = 90;
	this.latSlider.oninput();
	this.lonSlider.value = 0;
	this.lonSlider.oninput();
	this.rotSlider.value = 0;
	this.rotSlider.oninput();
	
	this.bordersCheckbox.checked = true;
	this.bordersCheckbox.onclick();
	this.graticuleCheckbox.checked = true;
	this.graticuleCheckbox.onclick();
	this.tissotCheckbox.checked = false;
	this.tissotCheckbox.onclick();
	
}


























