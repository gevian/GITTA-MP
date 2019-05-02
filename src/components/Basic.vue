<template>
  <div>
    <h1>Basic</h1>

		<div id ="controls">
        <header>
        GITTA Map Projector
        </header>
          <form style="font-weight: normal" id="simple_geometry">
            <fieldset id="simple-geometry-fieldset" class="centered">
            <b>geometry</b>
            <br>
            <table>
             <tr>
              <td class="controls-label">position</td>
              <td><input id="position_slider" class="slider" type="range"  min="0" max="1" step="0.01" value="1"/></td>
              <td><input id="position_box"    class="box"    type="number" min="0" max="1" step="0.01" value="1"/><br></td>
             </tr>
             <tr>
              <td class="controls-label">radius</td>
              <td><input id="radius_slider" class="slider" type="range"  min="0.01" max="1" step="0.01" value="1"/></td>
              <td><input id="radius_box"    class="box"    type="number" min="0.01" max="1" step="0.01" value="1"/></td>
             </tr>
            </table>
             </fieldset>
          </form>
          
          <form style="font-weight: normal; display: none;" id="surface_geometry">
            <fieldset id="geometry-fieldset" class="centered">
            <b>geometry</b>
            <br>
            <table>
             <tr>
              <td class="controls-label">axis length</td>
              <td><input id="axis_slider" class="slider" type="range"  min="0" max="8" step="0.01" value="1"/></td>
              <td><input id="axis_box"    class="box"    type="number" min="0" max="8" step="0.01" value="1"/><br></td>
             </tr>
             <tr>
              <td class="controls-label">upper radius</td>
              <td><input id="upper_radius_slider" class="slider" type="range"  min="0.01" max="4" step="0.01" value="1"/></td>
              <td><input id="upper_radius_box"    class="box"    type="number" min="0.01" max="4" step="0.01" value="1"/></td>
             </tr>
             <tr>
              <td class="controls-label">lower radius</td>
              <td><input id="lower_radius_slider" class="slider" type="range"  min="0.01" max="4" step="0.01" value="1"/></td>
              <td><input id="lower_radius_box"    class="box"    type="number" min="0.01" max="4" step="0.01" value="1"/></td>
             </tr>
             <tr>
              <td class="controls-label">offset</td>
              <td><input id="geometry_offset_slider" class="slider" type="range"  min="-2" max="2" step="0.01" value="0"/></td>
              <td><input id="geometry_offset_box"    class="box"    type="number" min="-2" max="2" step="0.01" value="0"/></td>
             </tr>
            </table>
             </fieldset>
             
          </form>
          <form style="font-weight: normal" id="lightsource">
            <fieldset class="centered">
              <b>light source</b>
              <br>
              <table>
             <tr>
              <td class="controls-label">offset</td>
              <td><input id="lightsource_offset_slider" class="slider" type="range"  min="-2"   max="2"   step="0.01" value="0"/></td>
              <td><input id="lightsource_offset_box"    class="box"    type="number" min="-100" max="100" step="0.01" value="0"/></td>
             </tr>
              </table>
            </fieldset>
          </form>
          <form style="font-weight: normal" id="textures">
            <fieldset class="centered">
              <b>layers</b>
              <br>
              <table class="center-table">
                 <tr>
                  <td>borders</td>
                  <td><input type="checkbox" id="borders-checkbox" checked=""><br></td>
                 </tr>
                 <tr>
                  <td>graticule</td>
                  <td><input type="checkbox" id="graticule-checkbox" checked=""><br></td>
                 </tr>
                 <tr style="display:none">
                  <td>Tissots indicatrices</td>
                  <td><input type="checkbox" id="tissot-checkbox" checked=""><br></td>
                 </tr>
                 
              </table>
            </fieldset>
          </form>
          <form style="font-weight: normal; display:none" id="lightsource">
            <fieldset class="centered">
              <b>light source</b>
              <br>
              <table>
             <tr>
              <td class="controls-label">relative latitude</td>
              <td><input id="lightsource_latitude_slider" class="slider" type="range"  min="-180" max="180"  step="1" value="0"/></td>
              <td><input id="lightsource_latitude_box"    class="box"    type="number"  min="-180" max="180" step="1" value="0"/></td>
             </tr>
             <tr>
              <td class="controls-label">relative longitude</td>
              <td><input id="lightsource_longitude_slider" class="slider" type="range"  min="-180" max="180"  step="1" value="0"/></td>
              <td><input id="lightsource_longitude_box"    class="box"    type="number"  min="-180" max="180" step="1" value="0"/></td>
             </tr>
             <tr>
              <td class="controls-label">offset</td>
              <td><input id="lightsource_offset_slider" class="slider" type="range"  min="-2"   max="2"   step="0.01" value="0"/></td>
              <td><input id="lightsource_offset_box"    class="box"    type="number" min="-100" max="100" step="0.01" value="0"/></td>
             </tr>
             <tr>
              <td class="controls-label">scale</td>
              <td><input id="lightsource_scale_slider" class="slider" type="range"  min="0.01"   max="2"   step="0.01" value="0"/></td>
              <td><input id="lightsource_scale_box"    class="box"    type="number" min="0.01"   max="100" step="0.01" value="0"/></td>
             </tr>
              </table>
            </fieldset>
          </form>
          </form>
              <button type="button" id="reset-button" onclick="tutorialControls.resetControls()">reset</button>
              <button type="button" id="remove-line-button" onclick="lineProjector.disableLines()">remove line</button>
              <button type="button" id="roll-button" onclick="rollPressed()">flatten</button>
            </div>
            <div style="display: none;" id="sw-container">
                <br>
                <div class="centered"><b>scaling</b></div>
                <div id="sw-graph"></div>
                <div id="sw-controls"></div>
            </div>
		</div>
		<div id="webgl_canvas"></div>
		
		<script src="libs/three.js"></script>
		<script src="libs/OrbitControls.js"></script>
		<script src="libs/d3.v4.min.js"></script>
		
		<script src="glcanvas.js"></script>
		<script src="earth.js"></script>
		<script src="surface.js"></script>
		<script src="projectionCenter.js"></script>
		<script src="lineProjector.js"></script>
		<script src="cutIndicator.js"></script>
		
		<script src="sliderAnimator.js"></script>
		<script src="tutorialControls.js"></script>
		<script src="basicControls.js"></script>
        
        <script src="stretchWidget.js"></script>
        <script src="stretchEditControls.js"></script>

		<script>

		var glcanvas = new GLCanvas("webgl_canvas");
        
        var earth = new Earth(glcanvas.scene, glcanvas.renderer);
		var stretchWidget = new StretchWidget("sw-graph", "sw-controls");
        stretchWidget.disable();
		var surface = new Surface(glcanvas.scene, glcanvas.renderer, earth, stretchWidget);
		var projectionCenter = new ProjectionCenter(glcanvas.scene);
		var cutIndicator = new CutIndicator(surface, glcanvas.scene);
		var lineProjector = new LineProjector(glcanvas, surface, earth, projectionCenter);
		
		var controls = new Controls(glcanvas, earth, surface, stretchWidget, projectionCenter, cutIndicator, lineProjector);
        var sliderAnimator = new SliderAnimator(controls, surface);
        
		var tutorialControls = new TutorialControls(controls, sliderAnimator, stretchWidget, projectionCenter, glcanvas);
		controls.reset();
		controls.lightSourceScaleBox.value = 0.01;
        controls.lightSourceScaleBox.oninput();
        controls.tissotCheckbox.checked = false;
        controls.tissotCheckbox.onclick();
        controls.radiusSlider.oninput();
        
		var clock  = new THREE.Clock();
		
		var animate = function () {
			var delta = clock.getDelta();
			requestAnimationFrame(animate);

			glcanvas.update(delta);
			surface.update(delta);
			sliderAnimator.update(delta);
            stretchWidget.update(delta);
			cutIndicator.updateGeometry();
		};

		animate();
		


		// tabs
		function openTab(buttonName, tabName) {
			// Declare all variables
			var i, tabcontent, tablinks;

			// Get all elements with class="tabcontent" and hide them
			tabcontent = document.getElementsByClassName("tabcontent");
			for (i = 0; i < tabcontent.length; i++) {
				tabcontent[i].style.display = "none";
			}

			// Get all elements with class="tablinks" and remove the class "active"
			tablinks = document.getElementsByClassName("tablinks");
			for (i = 0; i < tablinks.length; i++) {
				tablinks[i].className = tablinks[i].className.replace(" active", "");
			}

			// Show the current tab, and add an "active" class to the button that opened the tab
			document.getElementById(tabName).style.display = "block";
			document.getElementById(buttonName).className += " active";
		}


		</script>

  </div>
</template>

<script>
export default {
  name: 'Basic'
}
</script>

<style scoped>
</style>
