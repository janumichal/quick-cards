<template>
    <div class="ni-wrapper">
        <div class="ni-button" @click="decrease()">
            <img src="../../assets/icons/dec.svg">
        </div>
        <div class="ni-input">
            <input type="number" v-model="inputNumber" :min="props.min" :max="props.max" :step="props.step">
        </div>
        <div class="ni-button" @click="increase()">
            <img src="../../assets/icons/inc.svg">
        </div>
    </div>
</template>


<script setup lang="ts">
import { computed } from 'vue';


const emit = defineEmits(['update:inputNumber'])
const props = defineProps({
    min: {
        type: Number,
        required: true
    },
    max: {
        type: Number,
        required: true
    },
    step: {
        type: Number,
        default: 1
    },
    inputNumber: {
        type: Number,
        default: 6
    }
})

const inputNumber = computed({
    get(){
        return props.inputNumber
    },
    set(value){
        emit("update:inputNumber", value)
    }
})

function increase():void{
    inputNumber.value++
}

function decrease():void{
    inputNumber.value--
}
</script>


<style lang="scss" scoped>
    @use "../../scss/Colors/Colors" as *;
    @use "../../scss/Styles/Opacities" as *;

    .ni-wrapper{
        display: flex;
        flex-flow: row;
        width: fit-content;
        height: fit-content;
        max-height: 26px;
        border-radius: 5px;

        $border: 6px;

        :nth-child( 1 of .ni-button ){
            border-bottom-left-radius: $border;
            border-top-left-radius: $border;

        }

        :nth-child( 2 of .ni-button ){
            border-top-right-radius: $border;
            border-bottom-right-radius: $border;
        }

        .ni-button{
            display: flex;
            justify-content: center;
            align-items: center;
            aspect-ratio: 1/1;
            box-sizing: border-box;
            padding: 5px;
            cursor: pointer;

            background-color: rgba($default-btn, $alpha: $static);
            transition: background-color ease-in-out 0.2s;
            
            &:hover{
                background-color: rgba($default-btn, $alpha: $hover);
            }
            
            img{
                height: 16px;
            }
        }
        .ni-input{
            width: 30px;
            width: fit-content;
            background-color: #81818146;
            display: flex;
            justify-content: center;
            align-items: center;
            input{
                width: 30px;
                height: 100%;
                background-color: transparent;
                padding: 0px;
                border: none;
                text-align: center;
                
                color: #FFFFFF;
                &:focus{
                    outline: none;
                }

                &[type=number] {
                    -moz-appearance: textfield;
                }   
                &::-webkit-outer-spin-button,
                &::-webkit-inner-spin-button {
                    -webkit-appearance: none;
                    margin: 0;
                }
            }


            
        }
    }
</style>