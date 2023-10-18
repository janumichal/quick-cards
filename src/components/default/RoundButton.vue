<template>
    <div class="button-inner">
        <slot>
            <img src="../../assets/icons/close.svg"/>
        </slot>
    </div>
</template>

<script setup lang="ts">
</script>

<style lang="scss" scoped>
    @use "../../scss/Colors" as *;
    @use "../../scss/Styles/Opacities" as *;
    .button-inner{
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        border-radius: 100px;
        padding: 4px;
        margin: 0px;
        cursor: pointer;
        background-color: rgba($default-btn, $static);
        transition: background-color ease-in-out 0.2s;

        &:hover{
            background-color: rgba($default-btn, $hover);
        }
    }
</style>