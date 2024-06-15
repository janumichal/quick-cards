<template>
  <v-layout>
    <v-navigation-drawer 
      v-model="mStore.isSettingsPanelOpen" 
      elevation="5" width="350" location="right" 
      class="px-5 py-3"
      temporary tile>
      <div class="d-flex flex-column justify-space-between h-100">
        <div>
          <v-btn 
            id="settings-btn"
            class="position-absolute" 
            style="left: -50px;" 
            @click="mStore.isSettingsPanelOpen = !mStore.isSettingsPanelOpen" 
            :icon="mStore.isSettingsPanelOpen ? 'mdi-close' : 'mdi-cog' " variant="tonal"
            density="comfortable" 
            elevation="1"></v-btn>
          <v-tooltip v-if="!mStore.isSettingsPanelOpen" activator="#settings-btn" location="start">Settings</v-tooltip>
          <v-card color="surface-darken-2" class="mb-5">
            <template v-slot:title>
              <v-icon start size="small">mdi-cards</v-icon>
              Cards
            </template>
            <v-card-text class="bg-surface-darken-1">
              <div class="d-flex justify-space-between align-center">
                <span>Add card button</span>
                <v-switch v-model="sStore.settings.isAddCardButtonEnabled"></v-switch>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span>Drag-and-drop</span>
                <v-switch v-model="sStore.settings.isDragAndDropEnabled"></v-switch>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span>Limit columns</span>
                <v-switch v-model="sStore.settings.isLimitColumnsEnabled"></v-switch>
              </div>

              <div class="d-flex justify-space-between align-center">
                <v-number-input
                  label="Number of columns"
                  :min="1"
                  :disabled="!sStore.settings.isLimitColumnsEnabled"
                  v-model="sStore.settings.columnCount"
                  class="mt-1"
                  density="compact"
                  variant="solo-filled"
                  flat hide-details></v-number-input>
              </div>
            </v-card-text>
          </v-card>
          
          <v-card color="surface-darken-2">
            <template v-slot:title>
              <v-icon start size="small">mdi-wall</v-icon>
              Background
            </template>
            <v-card-text class="bg-surface-darken-1">
              <v-btn-toggle
                class="w-100 mt-3"
                density="compact"
                variant="tonal"
                v-model="sStore.settings.isBackgroundImageEnabled"
                mandatory>
                <v-btn 
                  width="50%"
                  :value="false">
                  <v-icon start>mdi-palette</v-icon>
                  <span>color</span>
                </v-btn>
                <v-btn 
                  width="50%"
                  :value="true">
                  <v-icon start>mdi-image</v-icon>
                  <span>image</span>
                </v-btn>
              </v-btn-toggle>

              <div class="mt-4">
                <div v-if="!sStore.settings.isBackgroundImageEnabled"
                  class="d-flex flex-column align-center">
                  <v-color-picker
                    v-model="sStore.settings.backgroundColor"
                    width="100%"
                    mode="hex"
                    dot-size="20"
                    :modes="['hex']"></v-color-picker>
                    <v-btn 
                      v-if="sStore.settings.backgroundColor != sStore.defaultSettings.backgroundColor"
                      class="mt-3"
                      @click="sStore.restoreDefaultColor()"
                      color="primary">
                      <v-icon start>mdi-history</v-icon>
                      Default color
                    </v-btn>
                </div>
                <div v-if="sStore.settings.isBackgroundImageEnabled">
                  <v-file-input
                    v-model="backgroundImage"
                    accept="image/png, image/jpeg"
                    prepend-icon="mdi-image-plus"
                    label="Choose image" 
                    variant="solo-filled"
                    chips></v-file-input>
                    <div class="d-flex justify-space-between">
                      <v-btn color="success"
                        v-if="backgroundImage != null"
                        @click="applyBackgroundImage()">
                        <v-icon start>mdi-check</v-icon>
                        Apply
                      </v-btn>
                      <v-btn 
                        id="clear-bg-img-btn"
                        v-if="sStore.settings.backgroundImage != null"
                        @click="sStore.setBackgroundImage(null)">
                        Clear
                      </v-btn>
                      <v-tooltip activator="#clear-bg-img-btn" location="start"
                        v-if="sStore.settings.backgroundImage != null">
                        Clear background image
                      </v-tooltip>
                    </div>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <div class="d-flex justify-space-around">
          <v-btn @click="sStore.importSettings()" variant="tonal">
            <v-icon start>mdi-import</v-icon>
            Import
          </v-btn>
          <v-btn @click="sStore.exportSettings()" variant="tonal">
            <v-icon start>mdi-export</v-icon>
            Export
          </v-btn>
        </div>
      </div>
    </v-navigation-drawer>
  </v-layout>


  
  <!-- <div class="panel">
    <div class="settings-wrapper">
      <div class="header">
        <Button :button-class="'round'" @click="mStore.isSettingsWindowEnabled = !mStore.isSettingsWindowEnabled" />
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
            <Toggle :id="'addCard'" v-model="sStore.settings.isAddCardButtonEnabled" />
          </template>
        </SettingsItem>

        <SettingsItem>
          <template v-slot:label>
            Drag-and-drop
          </template>
          <template v-slot:input>
            <Toggle :id="'dragAndDrop'" v-model="sStore.settings.isDragAndDropEnabled" />
          </template>
        </SettingsItem>

        <SettingsItem>
          <template v-slot:label>
            Limit columns
          </template>
          <template v-slot:input>
            <Toggle :id="'limit-columns'" v-model="sStore.settings.isLimitColumnsEnabled" />
          </template>
        </SettingsItem>

        <SettingsItem :sub="true" v-if="sStore.settings.isLimitColumnsEnabled">
          <template v-slot:label>
            Number of columns
          </template>
          <template v-slot:input>
            <NumberInput :min="1" :max="100" v-model:input-number="sStore.settings.columnCount" />
          </template>
        </SettingsItem>

        <SettingsItem>
          <template v-slot:label>
            Enable background image
          </template>
          <template v-slot:input>
            <Toggle :id="'enableBgImage'" v-model="sStore.settings.isBackgroundImageEnabled" />
          </template>
        </SettingsItem>

        <SettingsItem :sub="true" v-if="!sStore.settings.isBackgroundImageEnabled">
          <template v-slot:label>
            Background color
          </template>
          <template v-slot:input>
            <ColorInput v-model:input-color="sStore.settings.backgroundColor" />
          </template>
        </SettingsItem>

        <SettingsItem :sub="true" v-if="sStore.settings.isBackgroundImageEnabled">
          <template v-slot:label>
            Background image
          </template>
          <template v-slot:input>
            <Button @click="sStore.settings.backgroundImage != null ? resetBackgroundImage() : open()">
              {{ sStore.settings.backgroundImage != null ? "Remove" : "Select" }}
            </Button>
          </template>
        </SettingsItem>
      </div>
    </div>
    <div class="ie-wrapper">
      <div class="ie" @click="sStore.importSettings()">
        Import
      </div>
      <div class="ie" @click="sStore.exportSettings()">
        Export
      </div>
    </div>
  </div> -->
</template>




<script setup lang="ts">

import Toggle from './default/Toggle.vue';
import Button from './default/Button.vue';
import NumberInput from "./default/NumberInput.vue"
import ColorInput from './default/ColorPicker.vue';
import SettingsItem from './SettingsItem.vue';

import { useSettingsStore } from "../store/Settings"

import { useFileDialog } from '@vueuse/core'
import { useDatabaseStore } from '../store/Database';
import { useModalsStore } from '../store/Modals';
import { Ref, ref, watch } from 'vue';
import { useFilesStore } from '../store/Files';

const sStore = useSettingsStore()
const mStore = useModalsStore()
const dStore = useDatabaseStore()
const fStore = useFilesStore()

const { open, reset, onChange } = useFileDialog({
  accept: "image/jpg, image/png, image/jpeg",
  multiple: false
})

const backgroundImage: Ref<File|null> = ref(null);

function resetBackgroundImage(): void {
  reset()
  sStore.setBackgroundImage(null)
  dStore.saveSettings()
}

onChange((files: FileList | null) => {
  if (files != null) {
    fStore.convertFileToString(files[0]).then((image: string) => {
      sStore.setBackgroundImage(image)
      dStore.saveSettings()
    })
  }
})

  function applyBackgroundImage(){
    if(backgroundImage.value instanceof File){
      fStore.convertFileToString(backgroundImage.value).then(res =>{
        sStore.setBackgroundImage(res)
      })
    }
  }

</script>



<style lang="scss" scoped>
@use "../scss" as *;


.title {
  font-size: 20px;
  font-variation-settings: "wght" 600;
}

.panel {
  height: 100%;
  width: 320px;
  // background-color: #383642;
  display: flex;
  flex-flow: column;
  justify-content: space-between;

  .settings-wrapper {
    display: flex;
    flex-flow: column;
    gap: 20px;
    padding: 10px;
    padding-left: 20px;
    padding-right: 20px;
    box-sizing: border-box;

    .devider {
      height: 3px;
      width: 100%;
      border-radius: 5px;
      background-color: #0000003b;
      box-sizing: border-box;
      align-self: center;
    }

    .header {
      display: flex;
      align-items: center;


    }

    .content {
      display: flex;
      flex-flow: column;
      gap: 20px;
      height: 100%;
      justify-content: flex-start;
    }
  }

  .ie-wrapper {
    display: flex;
    padding: 8px;
    gap: 8px;

    .ie {
      width: 100%;
      height: 35px;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: $default-btn;
      cursor: pointer;
      transition: background-color ease-in-out 0.2s;
      border-radius: 5px;

      // &:hover {
      //   // background-color: #222027d3;
      // }
    }

  }
}

.settings-panel-enter-active {
  animation-name: hide-panel;
  animation-direction: reverse;
  animation-fill-mode: forwards;
  animation-duration: .3s;
  animation-timing-function: ease-in;
}

.settings-panel-leave-active {
  animation-name: hide-panel;
  animation-direction: normal;
  animation-fill-mode: forwards;
  animation-duration: .3s;
  animation-timing-function: ease-out
}

@keyframes hide-panel {
  0% {
    transform: translateX(0%);
  }

  100% {
    transform: translateX(+100%);
  }
}
</style>../store/Modals