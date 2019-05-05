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

var vertexShaderSource = `
    varying vec4 localPosition;
    varying vec4 globalPosition;
    varying vec4 globalPositionRolled;
   varying vec4 globalPositionTorus;
   
   uniform int keepVertices;
   
   uniform float projTorusScale;
   uniform mat4 projTorusMatrix;
   
   attribute vec3 positionRolled;
   attribute vec3 positionProjectionCenter;
   
    void main() {
        gl_Position =   projectionMatrix * 
                        modelViewMatrix * 
                        vec4(position,1.0);
                  
      globalPosition = modelMatrix * vec4(position, 1.0);
      
      if (keepVertices == 1)
      {
         globalPositionRolled = modelMatrix * vec4(positionRolled, 1.0);
      }
      else
      {
         globalPositionRolled = globalPosition;
      }
      
        localPosition = vec4(positionRolled, 1.0);
      globalPositionTorus = projTorusMatrix * vec4(positionProjectionCenter * projTorusScale, 1.0);
    }
`;

var fragmentShaderSource = `
    uniform sampler2D tCountries;
    uniform sampler2D tGraticule;
    uniform sampler2D tTissot;
   
    uniform float projTorusScale;
   uniform mat4 projTorusMatrix;
    
   uniform float opacity;
   
    varying vec4 localPosition;
    varying vec4 globalPosition;
    varying vec4 globalPositionRolled;
   varying vec4 globalPositionTorus;
      
   #define M_PI 3.1415926535897932384626433832795
   float radius = 1.0;
   
   
   vec2 xyz2latlon(vec3 xyz)
   {
      float r = sqrt(xyz.x * xyz.x + xyz.y * xyz.y + xyz.z * xyz.z);
      float azimuthal = atan(-xyz.z, xyz.x);
      float polar = acos(-xyz.y / r); 
      
      return vec2(azimuthal, polar);
   }
   
   
   vec3 point_on_sphere(vec3 projection_center, vec3 fragment_location)
   {
      vec3 origin = projection_center;
      vec3 dir_vector = normalize(fragment_location - projection_center);
      
      float a = -dot(dir_vector, origin);
      
      float b = (dot(dir_vector, origin) * dot(dir_vector, origin)) - (length(origin) * length(origin)) + (radius * radius);
      
      
      // no intersection
      if (b < 0.0)
      {
         return vec3(-1000.0, -1000.0, -1000.0);
      }
      else if (b == 0.0) // one intersection
      {
         return origin + a * dir_vector;   
      }
      

      // two intersections
      float c = sqrt(b);
      float d1 = a + c;
      float d2 = a - c;
      
        
        vec3 p1 = origin + d1 * dir_vector;
        vec3 p2 = origin + d2 * dir_vector;        
        
        if (distance(p1, fragment_location) < distance(p2, fragment_location))
        {
            return p1;
        }
        
        return p2;
   }
   
   
    void main() {
      //vec3 p = point_on_sphere(projOrigin, globalPositionRolled.xyz);
        
        //vec3 globalPositionTorus = normalize(vec3(-globalPositionRolled.x, 0.0, -globalPositionRolled.z)) * projTorusScale;
        vec3 globalPositionTorus = (projTorusMatrix * vec4(normalize(vec3(-localPosition.x, 0.0, -localPosition.z)) * projTorusScale, 1.0)).xyz;
        
      vec3 p = point_on_sphere(globalPositionTorus.xyz, globalPositionRolled.xyz);
      
      if (p.x < -999.0)
      {
         gl_FragColor = vec4(0.5, 0.5, 0.5, opacity);
      }
      else
      {
         vec2 latlon = xyz2latlon(p);

         float azimuthalNorm = (latlon[0]) / (2.0 * M_PI) + 0.5; 
         float polarNorm = (latlon[1] / M_PI);
         
         vec2 uv_comp = vec2(azimuthalNorm, polarNorm);
               
         vec4 color;
         vec4 CCountries = texture2D(tCountries, uv_comp);
         vec4 CGraticule = texture2D(tGraticule, uv_comp);
         vec4 CTissot = texture2D(tTissot, uv_comp);
         
         color = CCountries;
         color = vec4(color.rgb * color.a * (1.0 - CGraticule.a) + CGraticule.a * CGraticule.rgb, 1.0);
         color = vec4(color.rgb * color.a * (1.0 - CTissot.a) + CTissot.a * CTissot.rgb, 1.0);
         
            gl_FragColor = vec4(color.rgb, opacity);
            
            // very simple intersection indicator
            /*float l = length(globalPositionRolled.xyz);
            if (l > 0.99 && l < 1.01)
                gl_FragColor = vec4(1.0, 0.0, 0.0, 1.0);
            */
            
            
            //gl_FragColor = vec4(l, 0.0, 0.0, 1.0);
            
         //gl_FragColor = vec4(projTorusScale, 0.0, 0.0, 1.0);
         //gl_FragColor = vec4(azimuthalNorm, azimuthalNorm, azimuthalNorm, 1.0);
         //gl_FragColor = vec4(globalPositionTorus.y, 0.0, 0.0, 1.0);
      }
   }
`;



function Stripe(bufferGeometry, idxLeft, idxRight) {
    this.bufferGeometry = bufferGeometry;
    this.idxLeft = idxLeft;
    this.idxRight = idxRight;
}


Stripe.prototype.getNormal = function () {
    var vA = new THREE.Vector3(), vB = new THREE.Vector3(), vC = new THREE.Vector3();
    var cb = new THREE.Vector3(), ab = new THREE.Vector3();

    vA.fromBufferAttribute(this.bufferGeometry.attributes.position, this.idxLeft[0]);
    vB.fromBufferAttribute(this.bufferGeometry.attributes.position, this.idxLeft[1]);
    vC.fromBufferAttribute(this.bufferGeometry.attributes.position, this.idxRight[0]);
    cb.subVectors(vC, vB);
    ab.subVectors(vA, vB);
    cb.cross(ab);

    cb.normalize();

    return cb;
}



function Surface(scene, renderer, earth, stretchWidget) {
    this.renderer = renderer;
    this.scene = scene;
    this.earth = earth;

    this.stretchWidget = stretchWidget;
    this.stretchWidget.addCallback(this.receiveSignal.bind(this));

    this.state = "Initializing";
    this.showWireframe = false;

    // simplified cylinder geometry adapted from https://github.com/mrdoob/three.js/blob/master/src/geometries/CylinderGeometry.js
    this.bufferGeometry = new THREE.BufferGeometry();

    this.stretchTime = 3;

    this.topRadius = 1.0;
    this.bottomRadius = 1.0;

    //var segmentsRadial = 30;
    //var segmentsHeight = 10;

    var segmentsRadial = 100;
    var segmentsHeight = 50;

    //var segmentsRadial = 4;
    //var segmentsHeight = 1;


    var indices = [];
    var position = [];

    var px, py, pz; // vertex position

    var indexArray = [];
    var index = 0;
    var x, y;
    for (y = 0; y <= segmentsHeight; y++) {
        var indexRow = [];

        var v = y / segmentsHeight;
        for (x = 0; x <= segmentsRadial; x++) {
            var u = x / segmentsRadial;
            var theta = u * 2 * Math.PI - Math.PI / 2;

            px = Math.sin(theta);
            py = v - 0.5; // centers the cylinder to zero along the y axis (vertices get built up from bottom to top)
            pz = Math.cos(theta);
            position.push(px, py, pz);

            indexRow.push(index++);
        }

        indexArray.push(indexRow);
    }

    this.stripes = [];
    for (x = 0; x < segmentsRadial; x++) {
        var idxLeft = [];
        var idxRight = [];
        for (y = 0; y < segmentsHeight; y++) {

            // face indices
            var a = indexArray[y][x];
            var b = indexArray[y + 1][x];
            var c = indexArray[y + 1][x + 1];
            var d = indexArray[y][x + 1];

            // faces
            indices.push(a, b, d);
            indices.push(b, c, d);

            if (y == 0) {
                idxLeft.push(a);
                idxRight.push(d);
            }

            idxLeft.push(b);
            idxRight.push(c);
        }

        this.stripes.push(new Stripe(this.bufferGeometry, idxLeft, idxRight));
    }

    this.bufferGeometry.setIndex(indices);
    this.bufferGeometry.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(position), 3))
    this.bufferGeometry.addAttribute('positionRolled', new THREE.Float32BufferAttribute(new Float32Array(position), 3))
    this.bufferGeometry.computeVertexNormals();

    this.savedRolledPositions = new Float32Array(position);

    this.startTime = new Date();
    this.maxTime = 2;

    this.fractionPerSecond = 1 / this.maxTime;
    this.quadsPerSecond = this.fractionPerSecond * this.stripes.length;

    this.secondsPerQuad = this.stripes.length / this.maxTime;

    this.lastQuadInverse = this.stripes.length - 1;
    this.overallTInverse = 0;
    this.remainingQuadsFloatInverse = 0;


    this.lastQuad = 0;
    this.overallT = 0;
    this.remainingQuadsFloat = 0;

    var uniforms = {
        tCountries: { type: "t", value: this.earth.countriesTexture },
        tGraticule: { type: "t", value: this.earth.graticuleTexture },
        tTissot: { type: "t", value: this.earth.tissotTexture },
        projTorusScale: { type: "f", value: 1.0 },
        projTorusMatrix: { type: 'm4', value: new THREE.Matrix4() },
        opacity: { type: "f", value: 1.0 }, // Note: if not 1.0, set transparent of material to true
        keepVertices: { type: "i", value: 0 }
    };

    this.scene = scene;

    this.material = new THREE.ShaderMaterial({
        uniforms: uniforms,
        vertexShader: vertexShaderSource,
        fragmentShader: fragmentShaderSource,
        side: THREE.DoubleSide,
        transparent: false,
        polygonOffset: true,
        depthTest: true,
        polygonOffsetFactor: 2,
        polygonOffsetUnits: -1
    });

    this.mesh = new THREE.Mesh(this.bufferGeometry, this.material);

    if (this.showWireframe) {
        this.bufferGeometryWireframe = new THREE.BufferGeometry();
        this.bufferGeometryWireframe.setIndex(indices);
        this.bufferGeometryWireframe.addAttribute('position', new THREE.Float32BufferAttribute(new Float32Array(this.bufferGeometry.attributes.position.array), 3))
        this.bufferGeometryWireframe.computeVertexNormals();

        this.geo = new THREE.WireframeGeometry(this.bufferGeometryWireframe); // or WireframeGeometry( geometry )
        this.mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4 });
        this.wireframe = new THREE.LineSegments(this.geo, this.mat);
    }

    this.earthCenter = new THREE.Object3D();

    this.earthCenter.add(this.mesh);
    if (this.showWireframe) {
        this.mesh.add(this.wireframe);
    }
    this.scene.add(this.earthCenter);

    this.updateGeometry();

    this.flattenedToRolled = function () { };
    this.rolledToFlattened = function () { };
    this.flattenedToStretched = function () { };
    this.stretchedToFlattened = function () { };

    this.state = "Rolled";
}

Surface.prototype.setStretchWidget = function (widget) {
    this.stretchWidget = widget;
}


Surface.prototype.updateGeometry = function () {
    var n1 = this.stripes[0].getNormal();
    var n2 = this.stripes[1].getNormal();

    this.angle = -n2.angleTo(n1);

    this.updateWireframe();
}

Surface.prototype.updateWireframe = function () {
    if (this.showWireframe) {
        this.mesh.remove(this.wireframe);
        this.bufferGeometryWireframe.attributes.position.array.set(this.bufferGeometry.attributes.position.array);
        this.bufferGeometryWireframe.attributes.position.needsUpdate = true;
        this.geo = new THREE.WireframeGeometry(this.bufferGeometryWireframe); // or WireframeGeometry( geometry )
        this.mat = new THREE.LineBasicMaterial({ color: 0xff0000, linewidth: 4, depthWrite: true });
        this.wireframe = new THREE.LineSegments(this.geo, this.mat);
        this.mesh.add(this.wireframe);
    }
}

Surface.prototype.setOrientation = function (lat, lon, rot) {
    this.earthCenter.rotation.z = lat;
    this.earthCenter.rotation.y = lon;
    this.mesh.rotation.y = rot;

}


Surface.prototype.setGeometryOffset = function (offset) {
    this.mesh.position.y = offset;
}


Surface.prototype.setAxisLength = function (length) {

    //this.mesh.scale.y = length;

    var diff = this.topRadius - this.bottomRadius;
    for (var i = 0; i < this.stripes.length; i++) {
        var stripe = this.stripes[i];
        var idxLeft = stripe.idxLeft;

        for (var a = 0; a < idxLeft.length; a++) {
            var newY = length * ((a / (idxLeft.length - 1)) - 0.5);
            stripe.bufferGeometry.attributes.position.setY(idxLeft[a], newY);
        }

        if (i == this.stripes.length - 1) {
            var idxRight = stripe.idxRight;
            for (var a = 0; a < idxRight.length; a++) {
                var newY = length * ((a / (idxRight.length - 1)) - 0.5);
                stripe.bufferGeometry.attributes.position.setY(idxRight[a], newY);
            }
        }
    }

    this.bufferGeometry.attributes.position.needsUpdate = true;

    this.updateGeometry();

}

Surface.prototype.computeRadii = function () {
    var diff = this.topRadius - this.bottomRadius;
    for (var i = 0; i < this.stripes.length; i++) {
        var stripe = this.stripes[i];
        var idxLeft = stripe.idxLeft;

        for (var a = 0; a < idxLeft.length; a++) {
            var multiplier = a / (idxLeft.length - 1);
            var radius = this.bottomRadius + diff * multiplier;
            var leftVec = new THREE.Vector3();
            leftVec.fromBufferAttribute(stripe.bufferGeometry.attributes.position, idxLeft[a]);
            leftVec.y = 0;
            leftVec.normalize().multiplyScalar(radius);

            stripe.bufferGeometry.attributes.position.setX(idxLeft[a], leftVec.x);
            stripe.bufferGeometry.attributes.position.setZ(idxLeft[a], leftVec.z);
        }

        if (i == this.stripes.length - 1) {
            var idxRight = stripe.idxRight;
            for (var a = 0; a < idxRight.length; a++) {
                var multiplier = a / (idxRight.length - 1);
                var radius = this.bottomRadius + diff * multiplier;
                var rightVec = new THREE.Vector3();
                rightVec.fromBufferAttribute(stripe.bufferGeometry.attributes.position, idxRight[a]);
                rightVec.y = 0;
                rightVec.normalize().multiplyScalar(radius);

                stripe.bufferGeometry.attributes.position.setX(idxRight[a], rightVec.x);
                stripe.bufferGeometry.attributes.position.setZ(idxRight[a], rightVec.z);
            }
        }
    }

    this.bufferGeometry.attributes.position.needsUpdate = true;

    this.updateGeometry();
}

Surface.prototype.setTopRadius = function (radius) {
    this.topRadius = parseFloat(radius);
    this.computeRadii();
}

Surface.prototype.setBottomRadius = function (radius) {
    this.bottomRadius = parseFloat(radius);
    this.computeRadii();
}

Surface.prototype.flattenAnimated = function (t) {
    this.overallT += t;

    var quadsToRotateFloat = this.overallT * this.quadsPerSecond;
    var quadsToRotateInt = Math.floor(quadsToRotateFloat);

    if (quadsToRotateInt < 1.0) {
        return;
    }

    var excessTime = quadsToRotateInt / this.quadsPerSecond;
    this.overallT -= excessTime;


    var start = this.lastQuad;
    var end = Math.min(start + quadsToRotateInt, this.stripes.length);

    if (end > this.stripes.length) {
        return false;
    }

    this.lastQuad = end;


    for (var a = start; a < end; a++) {
        var referenceStripe = this.stripes[a];
        var idxLeft = referenceStripe.idxLeft;

        var ll = new THREE.Vector3();
        var ul = new THREE.Vector3();

        ll.fromBufferAttribute(referenceStripe.bufferGeometry.attributes.position, idxLeft[0]);
        ul.fromBufferAttribute(referenceStripe.bufferGeometry.attributes.position, idxLeft[idxLeft.length - 1]);
        var scale = ul.clone().sub(ll);
        var axis = scale.clone().normalize();
        var loc = ll.clone().addScaledVector(scale, 0.5);
        for (var i = a; i < this.stripes.length; i++) {
            var rotationStripe = this.stripes[i];
            var idxRight = rotationStripe.idxRight;
            for (var o = 0; o < idxRight.length; o++) {
                var r = new THREE.Vector3();
                r.fromBufferAttribute(rotationStripe.bufferGeometry.attributes.position, idxRight[o]);
                r.sub(loc).applyAxisAngle(axis, this.angle).add(loc);
                rotationStripe.bufferGeometry.attributes.position.setXYZ(idxRight[o], r.x, r.y, r.z);
            }
        }
    }


    this.bufferGeometry.attributes.position.needsUpdate = true;
    this.updateWireframe();

    if (end == this.stripes.length) {
        return true;
    }
    else {
        return false;
    }
}

Surface.prototype.rollAnimated = function (t) {
    this.overallTInverse += t;

    var quadsToRollFloat = this.overallTInverse * this.quadsPerSecond;
    var quadsToRotateInt = Math.floor(quadsToRollFloat);

    if (quadsToRotateInt < 1.0) {
        return false;
    }

    var excessTime = quadsToRotateInt / this.quadsPerSecond;
    this.overallTInverse -= excessTime;

    var numQuads = quadsToRotateInt;


    var start = this.lastQuadInverse;
    var end = Math.max(start - numQuads, 0);

    if (end < 0) {
        return false;
    }

    this.lastQuadInverse = end;

    for (var a = start; a > end; a--) {
        var referenceStripe = this.stripes[a];
        var idxLeft = referenceStripe.idxLeft;

        var ll = new THREE.Vector3();
        var ul = new THREE.Vector3();

        ll.fromBufferAttribute(referenceStripe.bufferGeometry.attributes.position, idxLeft[0]);
        ul.fromBufferAttribute(referenceStripe.bufferGeometry.attributes.position, idxLeft[idxLeft.length - 1]);
        var scale = ul.clone().sub(ll);
        var axis = scale.clone().normalize();
        var loc = ll.clone().addScaledVector(scale, 0.5);
        for (var i = a; i < this.stripes.length; i++) {
            var rotationStripe = this.stripes[i];
            var idxRight = rotationStripe.idxRight;
            for (var o = 0; o < idxRight.length; o++) {
                var r = new THREE.Vector3();
                r.fromBufferAttribute(rotationStripe.bufferGeometry.attributes.position, idxRight[o]);
                r.sub(loc).applyAxisAngle(axis, -this.angle).add(loc);
                rotationStripe.bufferGeometry.attributes.position.setXYZ(idxRight[o], r.x, r.y, r.z);
            }
        }
    }

    this.bufferGeometry.attributes.position.needsUpdate = true;
    this.updateWireframe();

    if (end == 0) {
        return true;
    }
    else {
        return false;
    }
}



Surface.prototype.receiveSignal = function (name, data) {
    if (name == "stretch changed") {
        this.scale(data);
    }
    else if (name == "state changed") {
        if (data == "enabled") {
            this.setStretched(false);
        }
        else {
            this.setStretched(true);
        }
    }
}


Surface.prototype.scale = function (targets) {
    for (var i = 0; i < this.stripes.length; i++) {
        var stripe = this.stripes[i];
        var idxLeft = stripe.idxLeft;

        var p1 = new THREE.Vector3(this.savedRolledPositions[idxLeft[0] * 3],
            this.savedRolledPositions[(idxLeft[0] * 3) + 1],
            this.savedRolledPositions[(idxLeft[0] * 3) + 2]);

        var p2 = new THREE.Vector3(this.savedRolledPositions[idxLeft[idxLeft.length - 1] * 3],
            this.savedRolledPositions[(idxLeft[idxLeft.length - 1] * 3) + 1],
            this.savedRolledPositions[(idxLeft[idxLeft.length - 1] * 3) + 2]);

        var vec1 = p2.clone().sub(p1.clone()).normalize();
        for (var a = 0; a < idxLeft.length; a++) {
            var f = a / (idxLeft.length - 1);
            var s = f * (targets.length - 1);

            var s1 = Math.floor(s);
            var s2 = s1 + 1;

            if (s2 == targets.length)
                s2 = s1;

            var w1 = 1 - (s - s1);
            var w2 = 1 - w1;

            var offset = w1 * targets[s1] + w2 * targets[s2];

            var targetVec = new THREE.Vector3(this.savedRolledPositions[idxLeft[a] * 3],
                this.savedRolledPositions[(idxLeft[a] * 3) + 1],
                this.savedRolledPositions[(idxLeft[a] * 3) + 2]);

            var offsetVec = vec1.clone().multiplyScalar(offset);
            var pa = p1.clone().add(offsetVec);
            stripe.bufferGeometry.attributes.position.setXYZ(idxLeft[a], pa.x, pa.y, pa.z);
        }

        if (i == this.stripes.length - 1) {
            var idxRight = stripe.idxRight;
            var p3 = new THREE.Vector3(this.savedRolledPositions[idxRight[0] * 3],
                this.savedRolledPositions[(idxRight[0] * 3) + 1],
                this.savedRolledPositions[(idxRight[0] * 3) + 2]);

            var p4 = new THREE.Vector3(this.savedRolledPositions[idxRight[idxRight.length - 1] * 3],
                this.savedRolledPositions[(idxRight[idxRight.length - 1] * 3) + 1],
                this.savedRolledPositions[(idxRight[idxRight.length - 1] * 3) + 2]);

            var vec2 = p4.clone().sub(p3.clone()).normalize();
            for (var a = 0; a < idxRight.length; a++) {
                var f = a / (idxLeft.length - 1);
                var s = f * (targets.length - 1);

                var s1 = Math.floor(s);
                var s2 = s1 + 1;

                if (s2 == targets.length)
                    s2 = s1;

                var w1 = 1 - (s - s1);
                var w2 = 1 - w1;

                var offset = w1 * targets[s1] + w2 * targets[s2];

                var targetVec = new THREE.Vector3(this.savedRolledPositions[idxRight[a] * 3],
                    this.savedRolledPositions[(idxRight[a] * 3) + 1],
                    this.savedRolledPositions[(idxRight[a] * 3) + 2]);

                var offsetVec = vec2.clone().multiplyScalar(offset);
                var pa = p3.clone().add(offsetVec);
                stripe.bufferGeometry.attributes.position.setXYZ(idxRight[a], pa.x, pa.y, pa.z);
            }
        }
    }

    this.bufferGeometry.attributes.position.needsUpdate = true;
    this.updateWireframe();
}

Surface.prototype.prepareStretching = function () {
    this.savedRolledPositions.set(this.bufferGeometry.attributes.position.array);

    var firstStripe = this.stripes[0];
    var vecBottomFirst = new THREE.Vector3();
    vecBottomFirst.fromBufferAttribute(firstStripe.bufferGeometry.attributes.position, firstStripe.idxLeft[0]);
    var vecTopFirst = new THREE.Vector3();
    vecTopFirst.fromBufferAttribute(firstStripe.bufferGeometry.attributes.position, firstStripe.idxLeft[firstStripe.idxLeft.length - 1]);

    this.distance = vecBottomFirst.distanceTo(vecTopFirst);

    //this.stretchWidget.setAxisLength(this.distance, this.distance * 2);
    this.stretchWidget.setRange(this.distance, -2 * this.distance, 2 * this.distance);
    this.stretchWidget.enable();
}

Surface.prototype.update = function (delta) {
    if (this.state == "Flattening") {
        var result = this.flattenAnimated(delta);

        if (result) {
            this.state = "Flattened";
            this.prepareStretching();
        }
    }
    else if (this.state == "Rolling") {
        var result = this.rollAnimated(delta);

        if (result) {
            this.mesh.material.uniforms.keepVertices.value = 0;
            this.state = "Rolled";
            this.flattenedToRolled(true);
        }
    }
}

Surface.prototype.flatten = function () {
    this.lastQuad = 1;
    this.overallT = 0;
    this.remainingQuadsFloat = 0;

    // freeze vertex positions
    this.bufferGeometry.attributes.positionRolled.array.set(this.bufferGeometry.attributes.position.array);
    //console.log(this.bufferGeometry.attributes.positionRolled.array);
    this.bufferGeometry.attributes.positionRolled.needsUpdate = true;

    this.mesh.material.uniforms.keepVertices.value = 1;

    this.state = "Flattening";
}

Surface.prototype.roll = function () {
    this.state = "Rolling";
    this.lastQuadInverse = this.stripes.length - 1;
    this.overallTInverse = 0;
    this.remainingQuadsFloatInverse = 0;
}

Surface.prototype.toggleRoll = function () {
    if (this.state == "Rolled") {
        this.rolledToFlattened(true);
        this.flatten();
    }
    else if (this.state == "Flattened") {
        this.stretchWidget.disable();
        this.roll();
    }
}

Surface.prototype.setStretched = function (isStretched) {
    if (isStretched) {
        this.state = "Stretched";
        this.flattenedToStretched();
    }
    else {
        this.state = "Flattened";
        this.stretchedToFlattened();
    }
}

Surface.prototype.setProjectionTorusParams = function (scale, transformMatrix) {
    this.mesh.material.uniforms.projTorusScale.value = scale;
    this.mesh.material.uniforms.projTorusMatrix.value = transformMatrix;
}

Surface.prototype.setFormsCallbacks = function (rolledToFlattened, flattenedToRolled, flattenedToStretched, stretchedToFlattened) {
    this.flattenedToRolled = flattenedToRolled;
    this.rolledToFlattened = rolledToFlattened;
    this.flattenedToStretched = flattenedToStretched;
    this.stretchedToFlattened = stretchedToFlattened;
}

Surface.prototype.enableBordersTexture = function () {
    this.mesh.material.uniforms.tCountries.value = this.earth.countriesTexture;
}

Surface.prototype.disableBordersTexture = function () {
    this.mesh.material.uniforms.tCountries.value = this.earth.emptyTexture;
}

Surface.prototype.enableGraticuleTexture = function () {
    this.mesh.material.uniforms.tGraticule.value = this.earth.graticuleTexture;
}

Surface.prototype.disableGraticuleTexture = function () {
    this.mesh.material.uniforms.tGraticule.value = this.earth.emptyTexture;
}

Surface.prototype.enableTissotTexture = function () {
    this.mesh.material.uniforms.tTissot.value = this.earth.tissotTexture;
}

Surface.prototype.disableTissotTexture = function () {
    this.mesh.material.uniforms.tTissot.value = this.earth.emptyTexture;
}

export default Surface;
