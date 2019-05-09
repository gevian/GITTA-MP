<template>
    <div
      :id="mode"
      :class="['index-button', mode]"
      @click="clickAction"
    >
      <p>
        <slot/>
      </p>
    </div>
</template>

<script>
export default {
  props: {
    mode: {
      type: String,
      default: null
    }
  },
  methods: {
    clickAction() {
      this.$emit("action", this.mode);
    }
  }
};
</script>

<style scoped>

.index-button {
  width: 200px;
  height: 100px;
  justify-content: center;
  align-items: center;
  border-radius: 25px;
  cursor: pointer;
}

.index-button.basic {
    background-color: #9bef8f;
}

.index-button.advanced {
    background-color: #81bff9;
}

.index-button p {
  margin-bottom: 0px;
}

</style>
