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

function Controls(
  canvas,
  earth,
  surface,
  stretchWidget,
  projectionCenter,
  cutIndicator,
  LineProjector
) {
  var _this = this;
  this.earth = earth;
  this.surface = surface;
  this.stretchWidget = stretchWidget;
  this.projectionCenter = projectionCenter;
  this.cutIndicator = cutIndicator;
  this.LineProjector = LineProjector;
  this.canvas = canvas;

  this.surface.setFormsCallbacks(
    this.rolledToFlattened.bind(this),
    this.flattenedToRolled.bind(this),
    this.flattenedToStretched.bind(this),
    this.stretchedToFlattened.bind(this)
  );

  this.latSlider = document.getElementById("lat_slider");
  this.lonSlider = document.getElementById("lon_slider");
  this.rotSlider = document.getElementById("rot_slider");

  this.latBox = document.getElementById("lat_box");
  this.lonBox = document.getElementById("lon_box");
  this.rotBox = document.getElementById("rot_box");

  this.axisSlider = document.getElementById("axis_slider");
  this.upperRadiusSlider = document.getElementById("upper_radius_slider");
  this.lowerRadiusSlider = document.getElementById("lower_radius_slider");
  this.geometryOffsetSlider = document.getElementById("geometry_offset_slider");

  this.axisBox = document.getElementById("axis_box");
  this.upperRadiusBox = document.getElementById("upper_radius_box");
  this.lowerRadiusBox = document.getElementById("lower_radius_box");
  this.geometryOffsetBox = document.getElementById("geometry_offset_box");

  this.lightSourceLatitudeSlider = document.getElementById(
    "lightsource_latitude_slider"
  );
  this.lightSourceLatitudeBox = document.getElementById(
    "lightsource_latitude_box"
  );
  this.lightSourceLongitudeSlider = document.getElementById(
    "lightsource_longitude_slider"
  );
  this.lightSourceLongitudeBox = document.getElementById(
    "lightsource_longitude_box"
  );
  this.lightSourceOffsetSlider = document.getElementById(
    "lightsource_offset_slider"
  );
  this.lightSourceOffsetBox = document.getElementById("lightsource_offset_box");
  this.lightSourceScaleSlider = document.getElementById(
    "lightsource_scale_slider"
  );
  this.lightSourceScaleBox = document.getElementById("lightsource_scale_box");

  this.bordersCheckbox = document.getElementById("borders-checkbox");
  this.graticuleCheckbox = document.getElementById("graticule-checkbox");
  this.tissotCheckbox = document.getElementById("tissot-checkbox");

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
  this.lightSourceLatitudeBox.oninput = lightSourceLatitudeBoxChanged;

  this.lightSourceLongitudeSlider.oninput = lightSourceLongitudeSliderChanged;
  this.lightSourceLongitudeBox.oninput = lightSourceLongitudeBoxChanged;

  this.lightSourceOffsetSlider.oninput = lightSourceOffsetSliderChanged;
  this.lightSourceOffsetBox.oninput = lightSourceOffsetBoxChanged;

  this.lightSourceScaleSlider.oninput = lightSourceScaleSliderChanged;
  this.lightSourceScaleBox.oninput = lightSourceScaleBoxChanged;

  this.bordersCheckbox.onclick = bordersChanged;
  this.graticuleCheckbox.onclick = graticuleChanged;
  this.tissotCheckbox.onclick = tissotChanged;

  this.rollButton = document.getElementById("roll-button");
  this.rollButton.onclick = rollClicked;

  function rollClicked() {
    _this.surface.toggleRoll();

    _this.LineProjector.disableLines();
  }

  function orientationSliderChanged() {
    _this.latBox.oninput = null;
    _this.lonBox.oninput = null;
    _this.rotBox.oninput = null;

    _this.latBox.value = _this.latSlider.value;
    _this.lonBox.value = _this.lonSlider.value;
    _this.rotBox.value = _this.rotSlider.value;

    _this.latBox.oninput = orientationBoxChanged;
    _this.lonBox.oninput = orientationBoxChanged;
    _this.rotBox.oninput = orientationBoxChanged;

    var lat = ((_this.latSlider.value - 90) / 360) * 2 * Math.PI;
    var lon = (_this.lonSlider.value / 360) * 2 * Math.PI;
    var rot = (_this.rotSlider.value / 360) * 2 * Math.PI;

    _this.surface.setOrientation(lat, lon, rot);
    _this.projectionCenter.setOrientation(lat, lon, rot);

    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function orientationBoxChanged() {
    _this.latSlider.oninput = null;
    _this.lonSlider.oninput = null;
    _this.rotSlider.oninput = null;

    _this.latSlider.value = _this.latBox.value;
    _this.lonSlider.value = _this.lonBox.value;
    _this.rotSlider.value = _this.rotBox.value;

    _this.latSlider.oninput = orientationSliderChanged;
    _this.lonSlider.oninput = orientationSliderChanged;
    _this.rotSlider.oninput = orientationSliderChanged;

    var lat = ((_this.latSlider.value - 90) / 360) * 2 * Math.PI;
    var lon = (_this.lonSlider.value / 360) * 2 * Math.PI;
    var rot = (_this.rotSlider.value / 360) * 2 * Math.PI;

    _this.surface.setOrientation(lat, lon, rot);
    _this.projectionCenter.setOrientation(lat, lon, rot);

    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function axisSliderChanged() {
    _this.axisBox.oninput = null;
    _this.axisBox.value = _this.axisSlider.value;
    _this.axisBox.oninput = axisBoxChanged;

    _this.surface.setAxisLength(_this.axisBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function axisBoxChanged() {
    _this.axisSlider.oninput = null;
    _this.axisSlider.value = _this.axisBox.value;
    _this.axisSlider.oninput = axisSliderChanged;

    _this.surface.setAxisLength(_this.axisBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function upperRadiusSliderChanged() {
    _this.upperRadiusBox.oninput = null;
    _this.upperRadiusBox.value = _this.upperRadiusSlider.value;
    _this.upperRadiusBox.oninput = upperRadiusBoxChanged;

    _this.surface.setTopRadius(_this.upperRadiusBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function upperRadiusBoxChanged() {
    _this.upperRadiusSlider.oninput = null;
    _this.upperRadiusSlider.value = _this.upperRadiusBox.value;
    _this.upperRadiusSlider.oninput = upperRadiusSliderChanged;

    _this.surface.setTopRadius(_this.upperRadiusBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function lowerRadiusSliderChanged() {
    _this.lowerRadiusBox.oninput = null;
    _this.lowerRadiusBox.value = _this.lowerRadiusSlider.value;
    _this.lowerRadiusBox.oninput = lowerRadiusBoxChanged;

    _this.surface.setBottomRadius(_this.lowerRadiusBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function lowerRadiusBoxChanged() {
    _this.lowerRadiusSlider.oninput = null;
    _this.lowerRadiusSlider.value = _this.lowerRadiusBox.value;
    _this.lowerRadiusSlider.oninput = lowerRadiusSliderChanged;

    _this.surface.setBottomRadius(_this.lowerRadiusBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function geometryOffsetSliderChanged() {
    _this.geometryOffsetBox.oninput = null;
    _this.geometryOffsetBox.value = _this.geometryOffsetSlider.value;
    _this.geometryOffsetBox.oninput = geometryOffsetBoxChanged;

    _this.surface.setGeometryOffset(_this.geometryOffsetBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function geometryOffsetBoxChanged() {
    _this.geometryOffsetSlider.oninput = null;
    _this.geometryOffsetSlider.value = _this.geometryOffsetBox.value;
    _this.geometryOffsetSlider.oninput = geometryOffsetSliderChanged;

    _this.surface.setGeometryOffset(_this.geometryOffsetBox.value);
    _this.cutIndicator.updateGeometry();
    _this.LineProjector.updateLines();
  }

  function lightSourceOffsetSliderChanged() {
    _this.lightSourceOffsetBox.oninput = null;
    _this.lightSourceOffsetBox.value = _this.lightSourceOffsetSlider.value;
    _this.lightSourceOffsetBox.oninput = lightSourceOffsetBoxChanged;

    _this.projectionCenter.setOffset(_this.lightSourceOffsetBox.value);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function lightSourceOffsetBoxChanged() {
    _this.lightSourceOffsetSlider.oninput = null;
    _this.lightSourceOffsetSlider.value = _this.lightSourceOffsetBox.value;
    _this.lightSourceOffsetSlider.oninput = lightSourceOffsetSliderChanged;

    _this.projectionCenter.setOffset(_this.lightSourceOffsetBox.value);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function lightSourceScaleSliderChanged() {
    _this.lightSourceScaleBox.oninput = null;
    _this.lightSourceScaleBox.value = _this.lightSourceScaleSlider.value;
    _this.lightSourceScaleBox.oninput = lightSourceScaleBoxChanged;

    _this.projectionCenter.setScale(_this.lightSourceScaleBox.value);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function lightSourceScaleBoxChanged() {
    _this.lightSourceScaleSlider.oninput = null;
    _this.lightSourceScaleSlider.value = _this.lightSourceScaleBox.value;
    _this.lightSourceScaleSlider.oninput = lightSourceScaleSliderChanged;

    _this.projectionCenter.setScale(_this.lightSourceScaleBox.value);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function lightSourceLatitudeSliderChanged() {
    _this.lightSourceLatitudeBox.oninput = null;
    _this.lightSourceLatitudeBox.value = _this.lightSourceLatitudeSlider.value;
    _this.lightSourceLatitudeBox.oninput = lightSourceLatitudeBoxChanged;

    var rot = (_this.lightSourceLatitudeBox.value / 360) * 2 * Math.PI;

    _this.projectionCenter.setLatitude(rot);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function lightSourceLatitudeBoxChanged() {
    _this.lightSourceLatitudeSlider.oninput = null;
    _this.lightSourceLatitudeSlider.value = _this.lightSourceLatitudeBox.value;
    _this.lightSourceLatitudeSlider.oninput = lightSourceLatitudeSliderChanged;

    var rot = (_this.lightSourceLatitudeBox.value / 360) * 2 * Math.PI;

    _this.projectionCenter.setLatitude(rot);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function lightSourceLongitudeSliderChanged() {
    _this.lightSourceLongitudeBox.oninput = null;
    _this.lightSourceLongitudeBox.value =
      _this.lightSourceLongitudeSlider.value;
    _this.lightSourceLongitudeBox.oninput = lightSourceLongitudeBoxChanged;

    var rot = (_this.lightSourceLongitudeBox.value / 360) * 2 * Math.PI;

    _this.projectionCenter.setLongitude(rot);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function lightSourceLongitudeBoxChanged() {
    _this.lightSourceLongitudeSlider.oninput = null;
    _this.lightSourceLongitudeSlider.value =
      _this.lightSourceLongitudeBox.value;
    _this.lightSourceLongitudeSlider.oninput = lightSourceLongitudeSliderChanged;

    var rot = (_this.lightSourceLongitudeBox.value / 360) * 2 * Math.PI;

    _this.projectionCenter.setLongitude(rot);
    _this.surface.setProjectionTorusParams(
      _this.projectionCenter.scale,
      _this.projectionCenter.lightCenter.matrixWorld
    );
    _this.LineProjector.updateLines();
  }

  function bordersChanged() {
    if (_this.bordersCheckbox.checked) {
      _this.earth.enableBordersTexture();
      _this.surface.enableBordersTexture();
    } else {
      _this.earth.disableBordersTexture();
      _this.surface.disableBordersTexture();
    }
  }

  function graticuleChanged() {
    if (_this.graticuleCheckbox.checked) {
      _this.earth.enableGraticuleTexture();
      _this.surface.enableGraticuleTexture();
    } else {
      _this.earth.disableGraticuleTexture();
      _this.surface.disableGraticuleTexture();
    }
  }

  function tissotChanged() {
    if (_this.tissotCheckbox.checked) {
      _this.earth.enableTissotTexture();
      _this.surface.enableTissotTexture();
    } else {
      _this.earth.disableTissotTexture();
      _this.surface.disableTissotTexture();
    }
  }
}

Controls.prototype.disableForms = function() {
  var fieldsets = [];
  fieldsets.push(document.getElementById("geometry-fieldset"));
  fieldsets.push(document.getElementById("orientation-fieldset"));

  for (let i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = true;
  }
};

Controls.prototype.enableForms = function() {
  var fieldsets = [];
  fieldsets.push(document.getElementById("geometry-fieldset"));
  fieldsets.push(document.getElementById("orientation-fieldset"));

  for (let i = 0; i < fieldsets.length; i++) {
    fieldsets[i].disabled = false;
  }
};

Controls.prototype.flattenedToRolled = function(roll) {
  this.enableForms();

  var tutButtons = document.querySelectorAll(".tut-button button");

  for (let i = 0; i < tutButtons.length; i++) {
    tutButtons[i].removeAttribute("disabled");
  }

  var tutButtonsScaling = document.querySelectorAll(
    ".tut-button-scaling button"
  );

  for (let i = 0; i < tutButtonsScaling.length; i++) {
    tutButtonsScaling[i].setAttribute("disabled", "disabled");
  }

  document.getElementById("reset-button").removeAttribute("disabled");
  document.getElementById("remove-line-button").removeAttribute("disabled");
  var rollButton = document.getElementById("roll-button");
  if (roll) {
    rollButton.innerHTML = "flatten";
  } else {
    rollButton.removeAttribute("disabled");
  }
};

Controls.prototype.rolledToFlattened = function(roll) {
  this.disableForms();

  var tutButtons = document.querySelectorAll(".tut-button button");

  for (let i = 0; i < tutButtons.length; i++) {
    tutButtons[i].setAttribute("disabled", "disabled");
  }

  var tutButtonsScaling = document.querySelectorAll(
    ".tut-button-scaling button"
  );

  for (let i = 0; i < tutButtonsScaling.length; i++) {
    tutButtonsScaling[i].removeAttribute("disabled");
  }

  document.getElementById("reset-button").setAttribute("disabled", "disabled");
  document
    .getElementById("remove-line-button")
    .setAttribute("disabled", "disabled");
  var rollButton = document.getElementById("roll-button");
  if (roll) {
    rollButton.innerHTML = "roll";
  } else {
    rollButton.setAttribute("disabled", "disabled");
  }
};

Controls.prototype.flattenedToStretched = function() {
  var rollButton = document.getElementById("roll-button");
  rollButton.setAttribute("disabled", "disabled");
};

Controls.prototype.stretchedToFlattened = function() {
  var rollButton = document.getElementById("roll-button");
  rollButton.removeAttribute("disabled");
};

Controls.prototype.reset = function() {
  document.getElementById("surface_orientation").reset();
  document.getElementById("surface_geometry").reset();
  document.getElementById("lightsource").reset();
  document.getElementById("textures").reset();
};

export default Controls;
