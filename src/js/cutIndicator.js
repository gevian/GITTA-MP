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

function CutIndicator(surface, scene) {
	this.surface = surface;
	this.scene = scene;

    // sprite texture taken from https://en.wikipedia.org/wiki/File:Scissors_icon_black.svg
    this.spriteMap = new THREE.TextureLoader().load("images/scissors.png");
    this.spriteMaterial = new THREE.SpriteMaterial( { map: this.spriteMap, color: 0xffffff } );
    this.sprite = new THREE.Sprite( this.spriteMaterial );
    this.sprite.scale.set(0.2, 0.2, 1)
    scene.add( this.sprite );                                         
	
	this.mesh = this.surface.mesh;
	
	this.updateGeometry();
}


CutIndicator.prototype.updateGeometry = function()
{   
    var ll = new THREE.Vector3();
    ll.fromBufferAttribute(this.surface.stripes[0].bufferGeometry.attributes.position, this.surface.stripes[0].idxLeft[0]);
    
	//console.log(this.surface.mesh.matrixWorld);
	var midPos = ll.applyMatrix4( this.mesh.matrixWorld );

	this.sprite.position.set(midPos.x, midPos.y, midPos.z);
}

export default CutIndicator;