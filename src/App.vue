<template>
  <div id="app">
    <div class="app-container">
        <template v-if="mode == 'index'">
            <Index @setMode="setMode" />
        </template>
        <template v-else-if="mode == 'basic'">
            <Basic />
        </template>
        <template v-else-if="mode == 'advanced'">
            <Advanced />
        </template>
    </div>

    <footer>
      <p>GITTA Map Projector has been developed for the <a href="http://www.gitta.info/website/en/html/index.html">GITTA learning platform</a> <br>
      © Magnus Heitzler, Institute of Cartography and Geoinformation, ETH Zurich (2019)<br>
      license: <a href="https://www.gnu.org/licenses/gpl-3.0.en.html">GPL v3</a></p>
    </footer>
  </div>
</template>

<script>
import Index from './components/Index.vue'
import Basic from './components/Basic.vue'
import Advanced from './components/Advanced.vue'

export default {
  name: 'app',
  data: () => {
      return {
          mode: 'index'
      }
  },
  components: {
    Index,
    Basic,
    Advanced
  },
  methods: {
    setMode(mode) {
        this.mode = mode;
    }
  }
}
</script>

<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  background-size: 500px;
  background-repeat: no-repeat;
  background-attachment: fixed;
  position: relative;
  width: 100vw;
  height: 100vh;
}

.app-container {
    height: 100%;
    padding-top: 60px;
    padding-bottom: 20px;
}

footer {
    position: absolute;
    right: 0;
    bottom: 0;
    left: 0;
    padding-left: 10px;
    text-align: left;
    
    font-family: Helvetica;
}

#version-container
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

#info {
    font-size: 30px;
    font-family: Helvetica;
    position: absolute;
    top: 20%;
    right: 80px;
}

footer {
    display: block;
    padding-left: 10px;
    text-align: left;
    font-family: Helvetica;
}

</style>
