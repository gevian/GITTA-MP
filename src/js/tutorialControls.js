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

import * as THREE from 'three';

function TutorialControls(controls, animator, stretchWidget, projectionCenter, canvas) {
	this.controls = controls;
	this.animator = animator;
	this.canvas = canvas;
	this.stretchWidget = stretchWidget;
	this.projectionCenter = projectionCenter;

	this.animationTime = 3;
}

TutorialControls.prototype.moveCameraToProjectionCenter = function () {
	var projectionCenterWorld = this.projectionCenter.sphere.getWorldPosition();
	if (projectionCenterWorld.equals(new THREE.Vector3(0, 0, 0))) {
		// We need to make sure that the camera is never set to 0,0,0 or track balls will freeze.
		this.canvas.camera.position.copy(new THREE.Vector3(0.01, 0, 0));
		this.canvas.trackballControls.target = new THREE.Vector3(0, 0.1, 0);
	}
	else {
		this.canvas.camera.position.copy(this.projectionCenter.sphere.getWorldPosition());
		this.canvas.trackballControls.target = new THREE.Vector3(0, 0.1, 0);
	}
}

TutorialControls.prototype.constructCylinder = function () {
	var upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 1 };
	var lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 1 };
	var axisBoxInstruction = { slider: this.controls.axisBox, target: 2 };
	var geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };

	this.animator.startSliderAnimations([upperRadiusBoxInstruction, axisBoxInstruction, geometryOffsetBoxInstruction, lowerRadiusBoxInstruction], this.animationTime);
}

TutorialControls.prototype.constructCone = function () {
	var upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
	var lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 2 };
	var axisBoxInstruction = { slider: this.controls.axisBox, target: 4 };
	var geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };

	this.animator.startSliderAnimations([upperRadiusBoxInstruction, lowerRadiusBoxInstruction, axisBoxInstruction, geometryOffsetBoxInstruction], this.animationTime);
}

TutorialControls.prototype.constructFrustum = function () {
	var upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.5 };
	var lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 2 };
	var axisBoxInstruction = { slider: this.controls.axisBox, target: 4 };
	var geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };

	this.animator.startSliderAnimations([upperRadiusBoxInstruction, lowerRadiusBoxInstruction, axisBoxInstruction, geometryOffsetBoxInstruction], this.animationTime);
}


TutorialControls.prototype.setProjection = function (name) {
    var latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction;
    
	if (name == "gnomonic azimuthal") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 0 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 4 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);

	}
	else if (name == "orthographic azimuthal") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 0 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 4 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: -100 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
	else if (name == "stereographic azimuthal") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 0 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 4 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: -1 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };


		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
	else if (name == "vertical perspective azimuthal near side") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 0 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 4 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 2 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
	else if (name == "vertical perspective azimuthal far side") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 0 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 4 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: -2 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
	else if (name == "oblique perspective non-azimuthal") {
		latBoxInstruction = { slider: this.controls.latBox, target: 66 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 0 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 4 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 2 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 24 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
	else if (name == "central cylindrical") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 8 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 1 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 1 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);

	}
	else if (name == "centrographic conic") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 4 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 2.4 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);

	}
	else if (name == "brauns stereographic conic") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 4 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 1.46 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1.04 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: -1 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}

	else if (name == "lamberts equal area cylindrical") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 4 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 1 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 1 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 100 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
	else if (name == "brauns stereographic cylindrical") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 4 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 1 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 1 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 1 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
	else if (name == "brauns pseudomercator") {
		latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		axisBoxInstruction = { slider: this.controls.axisBox, target: 4 };
		upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 1 };
		lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 1 };

		geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 0 };
		lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };
		lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.33 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], this.animationTime);
	}
}



TutorialControls.prototype.resetControls = function (duration, type) {
	if (duration == undefined)
		duration = 1

	if (type == undefined)
		type = "basic"

	if (type == "advanced") {
		this.controls.bordersCheckbox.checked = true;
		this.controls.bordersCheckbox.onclick();

		this.controls.graticuleCheckbox.checked = true;
		this.controls.graticuleCheckbox.onclick();

		this.controls.tissotCheckbox.checked = false;
		this.controls.tissotCheckbox.onclick();


		var latBoxInstruction = { slider: this.controls.latBox, target: 90 };
		var lonBoxInstruction = { slider: this.controls.lonBox, target: 0 };
		var rotBoxInstruction = { slider: this.controls.rotBox, target: 0 };

		var axisBoxInstruction = { slider: this.controls.axisBox, target: 0 };
		var upperRadiusBoxInstruction = { slider: this.controls.upperRadiusBox, target: 0.01 };
		var lowerRadiusBoxInstruction = { slider: this.controls.lowerRadiusBox, target: 4 };

		var geometryOffsetBoxInstruction = { slider: this.controls.geometryOffsetBox, target: 1 };
		var lightSourceOffsetBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };
		var lightSourceLatitudeBoxInstruction = { slider: this.controls.lightSourceLatitudeBox, target: 0 };
		var lightSourceLongitudeBoxInstruction = { slider: this.controls.lightSourceLongitudeBox, target: 0 };
		var lightSourceScaleBoxInstruction = { slider: this.controls.lightSourceScaleBox, target: 0.01 };

		this.animator.startSliderAnimations([latBoxInstruction, lonBoxInstruction, rotBoxInstruction, axisBoxInstruction, upperRadiusBoxInstruction, lowerRadiusBoxInstruction, geometryOffsetBoxInstruction, lightSourceOffsetBoxInstruction, lightSourceLatitudeBoxInstruction, lightSourceLongitudeBoxInstruction, lightSourceScaleBoxInstruction], duration);
	}
	else {
		this.controls.bordersCheckbox.checked = true;
		this.controls.bordersCheckbox.onclick();

		this.controls.graticuleCheckbox.checked = true;
		this.controls.graticuleCheckbox.onclick();

		var positionBoxInstruction = { slider: this.controls.positionBox, target: 1 };
		var radiusBoxInstruction = { slider: this.controls.radiusBox, target: 1 };
		var lightSourceBoxInstruction = { slider: this.controls.lightSourceOffsetBox, target: 0 };

		this.animator.startSliderAnimations([positionBoxInstruction, radiusBoxInstruction, lightSourceBoxInstruction], duration);
	}
}


TutorialControls.prototype.setScale = function (name) {
	this.stretchWidget.startStretchAnimations(name, this.animationTime);
}




export default TutorialControls;