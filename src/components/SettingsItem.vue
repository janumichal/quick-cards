<template>
  <div class="option" :class='props.sub ? "sub" : ""'>
    <div class="sub-devider" v-if="props.sub"></div>
    <div class="item-content">
      <slot name="label">
        Label
      </slot>
      <slot name="input">
        Placeholder
      </slot>
    </div>
  </div>
</template>


<script setup lang="ts">
const props = defineProps({
  sub: {
    type: Boolean,
    default: false
  }
})

</script>


<style lang="scss">
.option {
  display: flex;
  flex-flow: row;

  .item-content{
    display: flex;
    flex-flow: row;
    align-items: center;
    justify-content: space-between;
    width: 100%;
  }
}
.sub {
  gap: 10px;
  .sub-devider {
    width: 4px;
    height: 100%;
    border-radius: 5px;
    background-color: #00000052;
  }
}

</style>