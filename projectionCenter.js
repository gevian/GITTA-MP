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
function ProjectionCenter(scene) {
	this.scene = scene;
	this.sphere = new THREE.Mesh(new THREE.SphereGeometry(0.1, 32, 32),
								 new THREE.MeshBasicMaterial({color: 0xffff00}));
	
	this.earthCenter = new THREE.Object3D();
	this.lightCenter = new THREE.Object3D();
	
	this.earthCenter.add(this.lightCenter);
	//this.lightCenter.add(this.sphere);
	
	this.reconstructTorus(1);
	this.scene.add(this.earthCenter);
}

ProjectionCenter.prototype.reconstructTorus = function(scale)
{
	this.scale = parseFloat(scale);
	var lcc = this.lightCenter.children;
	
	for (var i = 0; i < lcc.length; i++)
	{
		this.lightCenter.remove(lcc[i]);	
	}
	
	this.torus = new THREE.Mesh(new THREE.TorusGeometry( this.scale, 0.1, 16, 32 ),
								new THREE.MeshBasicMaterial({color: 0xffff00, transparent: false, opacity: 1.0}));
								
	this.torus.rotation.x = Math.PI / 2.0;
	this.lightCenter.add(this.torus);
	
}

ProjectionCenter.prototype.setScale = function(scale)
{
	this.reconstructTorus(scale);
}

ProjectionCenter.prototype.setOrientation = function(lat, lon, rot)
{
	this.earthCenter.rotation.z = lat;
	this.earthCenter.rotation.y = lon;
    this.lightCenter.rotation.y = rot;
}

ProjectionCenter.prototype.setOffset = function(offset)
{
	this.lightCenter.position.y = offset;
}

ProjectionCenter.prototype.setLatitude = function(rotation)
{
	this.lightCenter.rotation.z = rotation;
}

ProjectionCenter.prototype.setLongitude = function(rotation)
{
	this.lightCenter.rotation.y = rotation;
}


