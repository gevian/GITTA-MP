<template>
  <div>
    <div id="intro">
        GITTA Map Projector
        <p style="margin-top: 0px; font-size: 24px;">(under construction)</p>
    </div>

    <div id="selector">
        Please choose a version ...
        <div id="version-container">
            <div class="version" id="basic" onmouseover="basicMouseOver()" @click="setMode('basic')">
                <div ><p style="margin-bottom: 0px">Basic</p>
                <!--<p style="margin-top: 0px; font-size: 14px;">(under construction)</p>--></div>
            </div>
            <div class="version" id="advanced"  onmouseover="advancedMouseOver()" @click="setMode('advanced')">
                <p>Advanced</p>
            </div>
        </div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'Index',
  methods: {
    setMode(mode) {
        this.$emit('setMode', mode)
    }
  }
}
</script>

<style scoped>
</style>
