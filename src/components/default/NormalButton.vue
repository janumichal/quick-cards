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
    @use "../../scss" as *;
    
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

    .button-normal{
        background-color: rgba($default-btn, $alpha: $static);

        &:hover{
            background-color: rgba($default-btn, $alpha: $hover);
        }
    }
    .button-warning{
        background-color: rgba($warning-btn, $alpha: $static);
        color: #000000;
        
        &:hover{
            background-color: rgba($warning-btn, $alpha: $hover);
        }
    }

    .button-submit{
        background-color: rgba($submit-btn, $alpha: $static);
        color: #000000;

        &:hover{
            background-color: rgba($submit-btn, $alpha: $hover);
        }
    }
</style>