<template>
    <div class="panel-wrapper" v-if="!gStore.isSettingsButtonVisibile" @click.self="gStore.toggleSettingsWVisibility()">
        <Transition name="settings-panel" mode="out-in"
        @after-leave="gStore.toggleSettingsBVisibility()">
            <div class="panel" v-if="gStore.isSettingsWindowVisible">
                <div class="settings-wrapper">
                    <div class="header">
                        <RoundButton @click="gStore.toggleSettingsWVisibility()"/>
                        <div class="title">
                            Settings
                        </div>
                    </div>
                    <div class="devider"></div>
                    <div class="content">
                        <SettingsItem>
                            <template v-slot:label>
                                Disable "Add Card" button
                            </template>
                            <template v-slot:input>
                                <ToggleButton :id="'addCard'" v-model="sStore.isAddCardButtonEnabled"/>
                            </template>
                        </SettingsItem>

                        <SettingsItem>
                            <template v-slot:label>
                                Drag-and-drop
                            </template>
                            <template v-slot:input>
                                <ToggleButton :id="'dragAndDrop'" v-model="sStore.isDragAndDropEnabled"/>
                            </template>
                        </SettingsItem>

                        <SettingsItem>
                            <template v-slot:label>
                                Limit columns
                            </template>
                            <template v-slot:input>
                                <ToggleButton :id="'limit-columns'" v-model="sStore.isLimitColumnsEnabled"/>
                            </template>
                        </SettingsItem>

                        <SettingsItem :sub="true" v-if="sStore.isLimitColumnsEnabled">
                            <template v-slot:label>
                                Number of columns
                            </template>
                            <template v-slot:input>
                                <NumberInput :min="1" :max="100" v-model:input-number="sStore.columnCount" />
                            </template>
                        </SettingsItem>

                        <SettingsItem>
                            <template v-slot:label>
                                Enable background image
                            </template>
                            <template v-slot:input>
                                <ToggleButton :id="'enableBgImage'" v-model="sStore.isBackgroundImageEnabled"/>
                            </template>
                        </SettingsItem>

                        <SettingsItem :sub="true" v-if="!sStore.isBackgroundImageEnabled">
                            <template v-slot:label>
                                Background color
                            </template>
                            <template v-slot:input>
                                <ColorInput v-model:input-color="sStore.backgroundColor" />
                            </template>
                        </SettingsItem>

                        <SettingsItem :sub="true" v-if="sStore.isBackgroundImageEnabled">
                            <template v-slot:label>
                                Background image
                            </template>
                            <template v-slot:input>
                                <NormalButton :btn-type="ButtonTypes.Normal" @click="sStore.backgroundImage != null ? resetBackgroundImage() : open()">
                                {{ sStore.backgroundImage != null ? "Remove" : "Select" }}
                            </NormalButton>
                            </template>
                        </SettingsItem>
                        <SettingsItem>
                            <template v-slot:label>
                                Remove database
                            </template>
                            <template v-slot:input>
                                <NormalButton :btn-type="ButtonTypes.Warning" @click="cStore.removeDatabases()">
                                    Delete
                                </NormalButton>
                            </template>
                        </SettingsItem>
                    </div>
                </div>
                <div class="ie-wrapper">
                        <div class="ie" @click="sStore.importSettings()">
                            Import
                        </div>
                        <div class="devider"></div>
                        <div class="ie" @click="sStore.exportSettings()">
                            Export
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
import ColorInput from './default/ColorPicker.vue';
import SettingsItem from './SettingsItem.vue';

import { useSettingsStore } from "../store/Settings"
import { useCardsStore } from '../store/Cards';
import { useGeneralStore } from '../store/General';

import { useFileDialog } from '@vueuse/core'
import { ButtonTypes } from '../enums';
import { onMounted, watch } from 'vue';

const sStore = useSettingsStore()
const cStore = useCardsStore()
const gStore = useGeneralStore()

const {open, reset, onChange} = useFileDialog({
    accept: "image/jpg, image/png, image/jpeg",
    multiple: false
})

function resetBackgroundImage():void{
    reset()
    sStore.backgroundImage = null
    setBackgroundImage(sStore.backgroundImage)
    sStore.updateBGDatabase()
}

onChange((files:FileList|null) => {
    if(files != null){
        sStore.convertFileToString(files[0]).then(res =>{
            sStore.backgroundImage = res
            console.log(res);
            
            setBackgroundImage(sStore.backgroundImage)
            sStore.updateBGDatabase()
        })
    }
})


function setBackgroundImage(file: string|null):void{
    const body:HTMLElement = document.body
    body.style.backgroundImage = `url(${file == null ? "none" : file})`
}

function setBackgroundColor(color:string):void{
    const body:HTMLElement = document.body
    body.style.backgroundColor = color
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
    setBackgroundColor(sStore.backgroundColor)
    if(sStore.isBackgroundImageEnabled){
        setBackgroundImage(sStore.backgroundImage)
    }
})

</script>



<style lang="scss" scoped>
@use "../scss" as *;

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
        justify-content: space-between;
        .settings-wrapper{
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
                height: 100%;
                justify-content: flex-start;
            }
        }
        .ie-wrapper{
            display: flex;
            justify-content: space-between;
            .devider{
                height: 100%;
                width: 2px;
                background-color: #0d0d0f;
            }
            .ie{
                width: 100%;
                height: 40px;
                display: flex;
                align-items: center;
                justify-content: center;
                background-color: #22202788;
                cursor: pointer;
                transition: background-color ease-in-out 0.2s;

                &:hover{
                    background-color: #222027d3;
                }
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