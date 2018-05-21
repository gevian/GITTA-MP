function Controls(earth, surface, projectionCenter, cutIndicator, LineProjector)
{
	var _this = this;
    this.earth = earth;	
	this.surface = surface;
	this.projectionCenter = projectionCenter;
	this.cutIndicator = cutIndicator;
	this.LineProjector = LineProjector;
	
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
	
	this.lightSourceLatitudeSlider  = document.getElementById("lightsource_latitude_slider");
	this.lightSourceLatitudeBox     = document.getElementById("lightsource_latitude_box");
	this.lightSourceLongitudeSlider = document.getElementById("lightsource_longitude_slider");
	this.lightSourceLongitudeBox    = document.getElementById("lightsource_longitude_box");
	this.lightSourceOffsetSlider    = document.getElementById("lightsource_offset_slider");
	this.lightSourceOffsetBox       = document.getElementById("lightsource_offset_box");
	
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
	
	this.lightSourceLatitudeSlider.oninput = lightSourceLatitudeSliderChanged;
	this.lightSourceLatitudeBox.oninput    = lightSourceLatitudeBoxChanged;

	this.lightSourceLongitudeSlider.oninput = lightSourceLongitudeSliderChanged;
	this.lightSourceLongitudeBox.oninput    = lightSourceLongitudeBoxChanged;
	
	this.lightSourceOffsetSlider.oninput = lightSourceOffsetSliderChanged;
	this.lightSourceOffsetBox.oninput    = lightSourceOffsetBoxChanged;
	
	
	this.bordersCheckbox.onclick   = bordersChanged;
	this.graticuleCheckbox.onclick = graticuleChanged;
	this.tissotCheckbox.onclick    = tissotChanged;
    
    
	this.rollButton = document.getElementById("roll-button");
	this.rollButton.onclick = rollClicked;
	
	function rollClicked() {
		_this.surface.toggleRoll();

		_this.LineProjector.disableLines();
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
	   _this.projectionCenter.setOrientation(lat, lon);
	   
	   _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
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
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
		_this.LineProjector.updateLines();
	}
	
	function lightSourceOffsetBoxChanged(event) {
		_this.lightSourceOffsetSlider.oninput = null;
		_this.lightSourceOffsetSlider.value   = _this.lightSourceOffsetBox.value;
		_this.lightSourceOffsetSlider.oninput = lightSourceOffsetSliderChanged; 
		
		_this.projectionCenter.setOffset(_this.lightSourceOffsetBox.value);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
		_this.LineProjector.updateLines();
	}
    
	
	function lightSourceLatitudeSliderChanged(event) {
		_this.lightSourceLatitudeBox.oninput = null;
		_this.lightSourceLatitudeBox.value   = _this.lightSourceLatitudeSlider.value;
		_this.lightSourceLatitudeBox.oninput = lightSourceLatitudeBoxChanged;
		
		var rot = ((_this.lightSourceLatitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLatitude(rot);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
		_this.LineProjector.updateLines();
	}
	
	function lightSourceLatitudeBoxChanged(event) {
		_this.lightSourceLatitudeSlider.oninput = null;
		_this.lightSourceLatitudeSlider.value   = _this.lightSourceLatitudeBox.value;
		_this.lightSourceLatitudeSlider.oninput = lightSourceLatitudeSliderChanged; 
		
		var rot = ((_this.lightSourceLatitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLatitude(rot);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
		_this.LineProjector.updateLines();
	}
	
	function lightSourceLongitudeSliderChanged(event) {
		_this.lightSourceLongitudeBox.oninput = null;
		_this.lightSourceLongitudeBox.value   = _this.lightSourceLongitudeSlider.value;
		_this.lightSourceLongitudeBox.oninput = lightSourceLongitudeBoxChanged;
		
		var rot = ((_this.lightSourceLongitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLongitude(rot);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
		_this.LineProjector.updateLines();
	}
	
	function lightSourceLongitudeBoxChanged(event) {
		_this.lightSourceLongitudeSlider.oninput = null;
		_this.lightSourceLongitudeSlider.value   = _this.lightSourceLongitudeBox.value;
		_this.lightSourceLongitudeSlider.oninput = lightSourceLongitudeSliderChanged; 
		
		var rot = ((_this.lightSourceLongitudeBox.value / 360) * 2 * Math.PI);
		
		_this.projectionCenter.setLongitude(rot);
	    _this.surface.setProjectionCenter(_this.projectionCenter.sphere.getWorldPosition());
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
	if (name == "gnomonic azimuthal")
	{
		this.axisBox.value = 0;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 4;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 1;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = 0;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
		
	}
	else if (name == "orthographic azimuthal")
	{
		this.axisBox.value = 0;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 4;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 1;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = -100;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
	else if (name == "stereographic azimuthal")
	{
		this.axisBox.value = 0;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 4;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 1;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = -1;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
	else if (name == "vertical perspective azimuthal near side")
	{
		this.axisBox.value = 0;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 4;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 1;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = 2;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
	else if (name == "vertical perspective azimuthal far side")
	{
		this.axisBox.value = 0;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 4;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 1;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = -2;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
	else if (name == "oblique perspective non-azimuthal")
	{
		this.axisBox.value = 0;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 4;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 1;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 66;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = 2;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 24;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
	else if (name == "central cylindrical")
	{
		this.axisBox.value = 4;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 1;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 1;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 0;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = 0;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
	else if (name == "centrographic conic")
	{
		this.axisBox.value = 4;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 2.4;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 0;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = 0;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
	else if (name == "brauns stereographic conic")
	{
		this.axisBox.value = 4;
		this.axisBox.oninput();
		this.upperRadiusBox.value = 0.01;
		this.upperRadiusBox.oninput();
		this.lowerRadiusBox.value = 1.46;
		this.lowerRadiusBox.oninput();
		this.geometryOffsetBox.value = 1.04;
		this.geometryOffsetBox.oninput();
		this.latBox.value = 90;
		this.latBox.oninput();
		this.lonBox.value = 0;
		this.lonBox.oninput();
		this.lightSourceOffsetBox.value = -1;
		this.lightSourceOffsetBox.oninput();
		this.lightSourceLatitudeBox.value = 0;
		this.lightSourceLatitudeBox.oninput();
		this.lightSourceLongitudeBox.value = 0;
		this.lightSourceLongitudeBox.oninput();
	}
}

Controls.prototype.resetControls = function()
{
	this.setProjection("azimuthal gnomonic");
	
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


























