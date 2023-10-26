<template>
    <div class="panel-wrapper" v-if="!sStore.isSettingsButtonVisibile" @click.self="sStore.toggleSettingsWVisibility()">
        <Transition name="settings-panel"
        @after-leave="sStore.toggleSettingsBVisibility()"
        @before-leave="tStore.addTransition()" 
        @after-enter="tStore.removeTransition()">
            <div class="panel" v-if="sStore.isSettingsWindowVisible">
                <div class="header">
                    <RoundButton @click="sStore.toggleSettingsWVisibility()"/>
                    <div class="title">
                        Settings
                    </div>
                </div>
                <div class="devider"></div>
                <div class="content">
                    <div class="option">
                        <div class="text">
                            Disable "Add Card" button
                        </div>
                        <ToggleButton :id="'addCard'" v-model="sStore.isAddCardButtonVisible"/>
                    </div>
                    <div class="option">
                        <div class="text">
                            Drag-and-drop
                        </div>
                        <ToggleButton :id="'dragAndDrop'" v-model="sStore.isDragAndDropEnabled"/>
                    </div>


                    <div class="option">
                        <div class="text">
                            Limit columns
                        </div>
                        <ToggleButton :id="'limit-columns'" v-model="sStore.isLimitColumnsEnabled"/>
                    </div>
                    <div class="option sub" v-if="sStore.isLimitColumnsEnabled">
                        <div class="text">
                            Number of columns
                        </div>
                        <NumberInput :number="sStore.columnCount" :min="1" :max="100" @input-number-model="setColumnNumber($event)" />
                    </div>

                    <div class="option">
                        <div class="text">
                            Enable background image
                        </div>
                        <ToggleButton :id="'enableBgImage'" v-model="sStore.isBackgroundImageEnabled"/>
                    </div>
                    <div class="option sub" v-if="!sStore.isBackgroundImageEnabled">
                        <div class="text">
                            Background color
                        </div>
                        <input class="input-color" type="color" v-model="sStore.backgroundColor"> 
                    </div>
                    <div class="option sub" v-if="sStore.isBackgroundImageEnabled">
                        <div class="text">
                            Background image
                        </div>
                        <NormalButton :btn-type="ButtonTypes.Normal" @click="sStore.backgroundImage != null ? resetBackgroundImage() : open()">
                            {{ sStore.backgroundImage != null ? "Remove" : "Select" }}
                        </NormalButton>
                    </div>




                    <div class="option">
                        <div class="text">
                            Remove database
                        </div>
                        <NormalButton :btn-type="ButtonTypes.Warning" @click="cStore.removeDatabases()">
                            Delete
                        </NormalButton>
                    </div>
                </div>
            </div>
        </Transition>
    </div>
</template>




<script setup lang="ts">
import RoundButton from './default/RoundButton.vue';
import ToggleButton from './default/ToggleButton.vue';
import NormalButton from './default/NormalButton.vue';
import NumberInput from "./default/NumberInput.vue"

import { useFileDialog } from '@vueuse/core'
import { ButtonTypes } from '../enums';
import { useSettingsStore } from "../store/Settings"
import { useTransitionsStore } from '../store/Transitions';
import { useCardsStore } from '../store/Cards';
import { onMounted, watch } from 'vue';

const sStore = useSettingsStore()
const tStore = useTransitionsStore()
const cStore = useCardsStore()

const {open, reset, onChange} = useFileDialog({
    accept: "image/jpg, image/png, image/jpeg",
    multiple: false
})

function resetBackgroundImage():void{
    reset()
    sStore.backgroundImage = null
    setBackgroundImage(sStore.backgroundImage)
}

onChange((files:FileList|null) => {
    if(files != null){
        sStore.backgroundImage = files[0]
        setBackgroundImage(sStore.backgroundImage)
    }
})

function setBackgroundImage(file: File|null):void{
    const body:HTMLElement = document.body
    if(file == null){
        body.style.backgroundImage = "none"
    }else{
        const reader:FileReader = new FileReader()
        reader.readAsDataURL(file)
        reader.onloadend = () => {
            body.style.backgroundImage = `url(${reader.result})`
            sStore.updateBGDatabase()
        }
    }
}

function setBackgroundColor(color:string):void{
    const body:HTMLElement = document.body
    body.style.backgroundColor = color
}

function setColumnNumber(event: number){
    sStore.columnCount = event
}

watch(
    () => sStore.backgroundColor,
    () =>{
        const body:HTMLElement = document.body
        body.style.backgroundColor = sStore.backgroundColor
    }
)

watch(
    () =>  [sStore.backgroundImage, sStore.isBackgroundImageEnabled],
    () =>{
        if(sStore.isBackgroundImageEnabled){
            setBackgroundImage(sStore.backgroundImage)
        }else{
            setBackgroundImage(null)
        }
    }
)

onMounted(() => {
    if(sStore.isBackgroundImageEnabled){
        setBackgroundImage(sStore.backgroundImage)
    }
    setBackgroundColor(sStore.backgroundColor)
})

</script>



<style lang="scss" scoped>
    @use "../scss/Colors/Colors" as *;
    .panel-wrapper{
        z-index: 1;
        position: fixed;
        display: flex;
        justify-content: flex-end;
        align-items: center;
        height: 100%;
        width: 100%;
        color: #FFFFFF;
        
        .panel{
            height: 100%;
            width: 320px;
            background-color: #383642;
            display: flex;
            flex-flow: column;
            gap: 20px;
            padding: 10px;
            padding-left: 20px;
            padding-right: 20px;
            box-sizing: border-box;

            .devider{
                height: 3px;
                width: 100%;
                border-radius: 5px;
                background-color: #0000003b;
                box-sizing: border-box;
                align-self: center;
            }
            .header{
                display: flex;
                align-items: center;
                .title{
                    width: 100%;
                    display: flex;
                    font-size: 20px;
                    font-variation-settings: "wght" 600;
                    justify-content: center;
                }
            }
            .content{
                display: flex;
                flex-flow: column;
                gap: 20px;
                .option{
                    display: flex;
                    flex-flow: row;
                    justify-content: space-between;
                    align-items: center;
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
                }
                .sub{
                    border-left: 3px #0000008a solid;
                    padding-left: 15px;
                }
            }
        }
    }

    .settings-panel-enter-active{
        animation-name: hide-panel;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .3s;
        animation-timing-function: ease-in;
    }

    .settings-panel-leave-active{
        animation-name: hide-panel;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .3s;
        animation-timing-function: ease-out
    }

    @keyframes hide-panel {
        0%{
            transform: translateX(0%);
        }
        100%{
            transform: translateX(+100%);
        }
    }
</style>