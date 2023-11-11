<template>
    <input type="color" v-model="inputColor"> 
</template>




<script setup lang="ts">
import { computed } from 'vue';

const emit = defineEmits(['update:inputColor'])
const props = defineProps({
    inputColor: String
})

const inputColor = computed({
    get(){
        return props.inputColor
    },
    set(value){
        emit("update:inputColor", value)
    }
})
</script>




<style lang="scss" scoped>
@use "../../scss/Colors/Colors" as *;

input[type="color"]{
    appearance: none;
    -moz-appearance: none;
    -webkit-appearance: none;
    background: none;
    border: 0;
    outline: 2px $default-btn solid;
    cursor: pointer;
    padding: 0;
    border-radius: 5px;
    transition: all ease-in-out 0.2s;

    &:hover{
        outline: 2px #222027 solid;
    }
}
::-webkit-color-swatch-wrapper {
    padding: 0;    
}

::-webkit-color-swatch{
    border: 0;
    border-radius: 0;
}

::-moz-color-swatch,
::-moz-focus-inner{
    border: 0;
}

::-moz-focus-inner{
    padding: 0;
}
</style>