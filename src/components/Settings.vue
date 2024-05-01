<template>
  <div class="panel-wrapper" v-if="!mStore.isSettingsButtonEnabled" @click.self="mStore.isSettingsWindowEnabled = !mStore.isSettingsWindowEnabled">
    <Transition name="settings-panel" mode="out-in" @after-leave="mStore.isSettingsButtonEnabled = !mStore.isSettingsButtonEnabled">
      <div class="panel" v-if="mStore.isSettingsWindowEnabled">
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
                <Button
                  @click="sStore.settings.backgroundImage != null ? resetBackgroundImage() : open()">
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
      </div>
    </Transition>
  </div>
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

const sStore = useSettingsStore()
const mStore = useModalsStore()
const dStore = useDatabaseStore()

const { open, reset, onChange } = useFileDialog({
  accept: "image/jpg, image/png, image/jpeg",
  multiple: false
})

function resetBackgroundImage(): void {
  reset()
  sStore.setBackgroundImage(null)
  dStore.saveSettings()
}

onChange((files: FileList | null) => {
  if (files != null) {
    sStore.convertFileToString(files[0]).then((image: string) => {
      sStore.setBackgroundImage(image)
      dStore.saveSettings()
    })
  }
})
</script>



<style lang="scss" scoped>
@use "../scss" as *;

.panel-wrapper {
  z-index: 1;
  position: fixed;
  display: flex;
  justify-content: flex-end;
  align-items: center;
  height: 100%;
  width: 100%;
  color: #FFFFFF;
  background-color: $modal-bg;

  .panel {
    height: 100%;
    width: 320px;
    background-color: #383642;
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

        .title {
          width: 100%;
          display: flex;
          font-size: 20px;
          font-variation-settings: "wght" 600;
          justify-content: center;
        }
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

        &:hover {
          background-color: #222027d3;
        }
      }

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