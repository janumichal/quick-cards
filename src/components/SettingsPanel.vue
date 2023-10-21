<template>
    <div class="panel-wrapper" v-if="!sStore.isSettingsButtonVisibile">
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
                            Add background image
                        </div>
                        <NormalButton :btn-type="ButtonTypes.Normal" @click="">
                            Choose
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

import { ButtonTypes } from '../enums';
import { useSettingsStore } from "../store/Settings"
import { useTransitionsStore } from '../store/Transitions';
import { useCardsStore } from '../store/Cards';

const sStore = useSettingsStore()
const tStore = useTransitionsStore()
const cStore = useCardsStore()



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
        background-color: rgba(0, 0, 0, 0.498);
        color: #FFFFFF;
        
        .panel{
            height: 100%;
            width: 320px;
            background-color: $primary-bg;
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