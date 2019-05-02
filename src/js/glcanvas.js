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

import * as THREE from "three";

function GLCanvas(canvas_id) {
  var _this = this;

  this.glContainer = document.getElementById(canvas_id);
  this.width = this.glContainer.offsetWidth;
  this.height = this.glContainer.offsetHeight;

  this.scene = new THREE.Scene();
  this.scene.background = new THREE.Color("#e8f0ff");
  this.camera = new THREE.PerspectiveCamera(
    75,
    this.width / this.height,
    0.1,
    1000
  );

  this.camera.position.y = 5;
  this.camera.position.z = 5;

  this.renderer = new THREE.WebGLRenderer();
  this.renderer.setSize(this.width, this.height);

  this.glContainer.append(this.renderer.domElement);
  this.gl = this.renderer.getContext();

  this.orbitControls = new THREE.OrbitControls(
    this.camera,
    this.renderer.domElement
  );

  this.light = new THREE.DirectionalLight(0xeeeeee);
  this.light.position.set(1, 1, 1).normalize();
  this.scene.add(this.light);

  this.scene.add(new THREE.AmbientLight(0x111111));

  this.orbitControls.addEventListener("change", function() {
    var p = _this.camera.position;
    _this.light.position.set(p.x, p.y + 1, p.z);
  });

  /*
	this.earthMesh =  new THREE.Mesh(
						new THREE.SphereGeometry(1.0, 128, 128),
						new THREE.MeshPhongMaterial({
							map: new THREE.TextureLoader().load('images/boundaries.png'),
							transparent: true,
							opacity: 0.5,
							side: THREE.DoubleSide,
					   })
				  );

	this.scene.add(this.earthMesh);
    */

  //var axisHelper = new THREE.AxisHelper( 2 );
  //this.scene.add( axisHelper );
}

GLCanvas.prototype.update = function(delta) {
  this.renderer.render(this.scene, this.camera);
  this.orbitControls.update(delta);
};

export default GLCanvas;
