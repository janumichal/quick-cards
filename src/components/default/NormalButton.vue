<template>
    <div class="button" :class="getColor()">
        <slot>
            <img src="../../assets/icons/close.svg"/>
        </slot>
    </div>
</template>

<script setup lang="ts">
    import { ButtonTypes } from "../../enums"
    const props = defineProps({
        btnType:{
            type: String,
            default: ButtonTypes.Normal
        }
    })

    /**
     * Get class of the button depanding on the type
     * @returns string class of the button type
     */
    function getColor(){
        return "button-"+ props.btnType
    }   
</script>

<style lang="scss" scoped>
    @use "../../scss/Colors" as *;
    
    .button{
        display: flex;
        align-items: center;
        justify-content: center;
        width: fit-content;
        height: fit-content;
        border-radius: 6px;
        padding: 5px 10px 5px 10px;
        margin: 0px;
        cursor: pointer;
        color: #FFFFFF;
        transition: background-color ease-in-out 0.2s;
    }
    $opacity-static:.4;
    $opacity-hover:.8;
    .button-normal{
        background-color: rgba($default-btn-clr, $alpha: $opacity-static);

        &:hover{
            background-color: rgba($default-btn-clr, $alpha: $opacity-hover);
        }
    }
    .button-warning{
        background-color: rgba($warning-btn-clr, $alpha: $opacity-static);

        &:hover{
            background-color: rgba($warning-btn-clr, $alpha: $opacity-hover);
        }
    }
    .button-normal-no-opacity{
        background-color: $default-btn-nop-clr;

        &:hover{
            background-color: $default-btn-nop-clr-hover;
        }
    }
    .button-submit{
        background-color: $submit-btn;

        &:hover{
            background-color: $submit-btn-hover;
        }
        &:active{
            background-color: $submit-btn-active;
        }
    }
</style>