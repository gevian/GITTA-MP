<template>
  <div>
    <div class="intro">
      GITTA Map Projector
      <p class="description">(under construction)</p>
    </div>

    <div class="selector">
      Please choose a version ...
      <div id="version-container">
        <IndexButton mode="basic" @action="setMode">Basic</IndexButton>
        <IndexButton mode="advanced" @action="setMode">Advanced</IndexButton>
      </div>
    </div>
  </div>
</template>


<script>
import IndexButton from "./IndexButton.vue";

export default {
  name: "Index",
  components: { IndexButton },
  methods: {
    setMode(mode) {
      this.$emit("setMode", mode);
    }
  }
};
</script>

<style scoped>
.intro {
  position: absolute;
  top: 80px;
  left: 80px;
  font-size: 80px;
  font-family: Helvetica;
}

.intro .description {
  margin-top: 0px;
  font-size: 24px;
}

.selector {
  font-size: 30px;
  font-family: Helvetica;

  width: 500px;
  height: 400px;

  position: absolute;
  top: 0;
  bottom: 0;
  left: 0;
  right: 0;

  margin: auto;
  text-align: center;
}
</style>
