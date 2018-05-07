var vertexShaderEarth = `
    varying vec2 vUv;
	
    void main() {
        vUv = uv;
        vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
        gl_Position = projectionMatrix * mvPosition;
    }
`;

var fragmentShaderEarth = `
    uniform sampler2D tCountries;
    uniform sampler2D tGraticule;
    uniform sampler2D tTissot;

    varying vec2 vUv;
	
    void main() {
        vec4 color;
        vec4 CCountries = texture2D(tCountries, vUv);
        vec4 CGraticule = texture2D(tGraticule, vUv);
        vec4 CTissot = texture2D(tTissot, vUv);
        
        color = CCountries;
        color = vec4(color.rgb * color.a * (1.0 - CGraticule.a) + CGraticule.a * CGraticule.rgb, 1.0);
        color = vec4(color.rgb * color.a * (1.0 - CTissot.a) + CTissot.a * CTissot.rgb, 1.0);
        
        gl_FragColor = vec4(color.rgb, 0.75);
	}
`;

function Earth(scene) {
    
    this.countriesTexture = new THREE.TextureLoader().load('images/Countries.png');
    this.tissotTexture    = new THREE.TextureLoader().load('images/Tissot.png');
    this.graticuleTexture = new THREE.TextureLoader().load('images/Graticule.png');
    this.emptyTexture     = new THREE.TextureLoader().load('images/Empty.png');
    
	this.scene = scene;
    
    var uniforms = {

      tCountries: { type: "t", value: this.countriesTexture },
      tGraticule: { type: "t", value: this.graticuleTexture },
      tTissot:    { type: "t", value: this.tissotTexture }

    };

    var blendMaterial = new THREE.ShaderMaterial({

      uniforms: uniforms,
      vertexShader: vertexShaderEarth,
      fragmentShader: fragmentShaderEarth,
      side: THREE.DoubleSide,
      transparent: true
      
    });

	this.earthMesh =  new THREE.Mesh(
                        new THREE.SphereGeometry(1.0, 128, 128),
                        blendMaterial
				  );

	this.scene.add(this.earthMesh);
}

Earth.prototype.enableBordersTexture = function()
{
    this.earthMesh.material.uniforms.tCountries.value = this.countriesTexture;
}

Earth.prototype.disableBordersTexture = function()
{
    this.earthMesh.material.uniforms.tCountries.value = this.emptyTexture;    
}

Earth.prototype.enableGraticuleTexture = function()
{
    this.earthMesh.material.uniforms.tGraticule.value = this.graticuleTexture;
}

Earth.prototype.disableGraticuleTexture = function()
{
    this.earthMesh.material.uniforms.tGraticule.value = this.emptyTexture;    
}

Earth.prototype.enableTissotTexture = function()
{
    this.earthMesh.material.uniforms.tTissot.value = this.tissotTexture;
}

Earth.prototype.disableTissotTexture = function()
{
    this.earthMesh.material.uniforms.tTissot.value = this.emptyTexture;    
}

