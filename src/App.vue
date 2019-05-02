<template>
  <div id="app">
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
  margin-top: 60px;
}

#main {
    /*background-image: url(images/background.png);   
    background-color: #fffae2;*/
    background-size: 500px;
    background-repeat: no-repeat;
    

    background-attachment: fixed;
}

#intro {
    position: absolute;
    top: 80px;
    left: 80px;
    font-size: 80px;
    font-family: Helvetica;
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


#selector {
    font-size: 30px;
    font-family: Helvetica;
    
    width: 500px;
    height: 400px;

    position: absolute;
    top:0;
    bottom: 0;
    left: 0;
    right: 0;

    margin: auto;
    text-align: center;
}

#version-container
{
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 20px;
}

.version {
    width: 200px;
    height: 100px;

    justify-content: center;
    align-items: center;
    
    border-radius: 25px;
    cursor: pointer;
}

#basic {
    background-color: #9bef8f;
}

#advanced {
    background-color: #81bff9;
}

#info {
    font-size: 30px;
    font-family: Helvetica;
    
    position: absolute;
    top: 20%;
    right: 80px;
}

</style>
