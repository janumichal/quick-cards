<template>
  <div class="default" :class="props.buttonClass">
    <slot>
      <img src="../../assets/icons/close.svg" />
    </slot>
  </div>
</template>

<script setup lang="ts">
const props = defineProps({
  buttonClass: String
})
</script>

<style lang="scss" scoped>
@use "../../scss" as *;

.default {
  display: flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  height: fit-content;
  border-radius: 6px;
  padding: 5px 10px 5px 10px;
  margin: 0px;
  cursor: pointer;
  color: #f7f6fa;
  transition: background-color ease-in-out 0.2s;
  @extend .normal
}

.round {
  border-radius: 100px;
  padding: 4px;
}

.width-expand {
  width: 100%;
}

.height-expand {
  height: 100%;
}

.normal {
  background-color: rgba($default-btn, $alpha: $static);

  &:hover {
    background-color: rgba($default-btn, $alpha: $hover);
  }
}

.warning {
  background-color: rgba($warning-btn, $alpha: $static);
  color: #0f0f0f;

  &:hover {
    background-color: rgba($warning-btn, $alpha: $hover);
  }
}

.submit {
  background-color: rgba($submit-btn, $alpha: $static);
  color: #0f0f0f;

  &:hover {
    background-color: rgba($submit-btn, $alpha: $hover);
  }
}
</style>