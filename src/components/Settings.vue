<template>
  <v-layout>
    <v-navigation-drawer 
      v-model="mStore.isSettingsPanelOpen" 
      elevation="5" width="350" location="right" 
      temporary tile>
      <div class="d-flex flex-column justify-space-between h-100 mx-5">
        <div>
          <v-btn 
            class="position-absolute mt-3" 
            style="left: -50px;" 
            @click="mStore.isSettingsPanelOpen = !mStore.isSettingsPanelOpen" 
            :icon="mStore.isSettingsPanelOpen ? 'mdi-close' : 'mdi-cog' "
            density="comfortable" 
            elevation="1"></v-btn>
          <v-card class="mb-5 mt-3">
            <v-card-title>
              <v-icon start size="small">mdi-cards</v-icon>
              General
            </v-card-title>
            <v-card-text class="pt-2">
              <div class="d-flex justify-space-between align-center">
                <span>Add card button</span>
                <v-switch v-model="sStore.settings.isAddCardButtonEnabled"></v-switch>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span>Drag-and-drop</span>
                <v-switch v-model="sStore.settings.isDragAndDropEnabled"></v-switch>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span>Card name</span>
                <v-switch v-model="sStore.settings.cardNameEnabled"></v-switch>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span>Card edit button</span>
                <v-switch v-model="sStore.settings.cardEditEnabled"></v-switch>
              </div>
              <div class="d-flex justify-space-between align-center">
                <span>Spacer on hover effect</span>
                <v-switch v-model="sStore.settings.spacerOnHoverEffectEnabled"></v-switch>
              </div>
            </v-card-text>
          </v-card>

          <v-card class="mb-5">
            <v-card-title>
              <v-icon start size="small">mdi-aspect-ratio</v-icon>
              Layout
            </v-card-title>
            <v-card-text class="pt-2">
              <span>Card Aspect ratio</span>
              <div class="d-flex justify-space-between align-center">
                <v-number-input
                  label="Width"
                  :min="1"
                  v-model="sStore.settings.cardAspectRatioWidth"
                  class="mt-3"
                  density="compact"
                  variant="solo-filled"
                  flat hide-details></v-number-input>
              </div>
              <div class="d-flex justify-space-between align-center">
                <v-number-input
                  label="Height"
                  :min="1"
                  v-model="sStore.settings.cardAspectRatioHeight"
                  class="mt-3"
                  density="compact"
                  variant="solo-filled"
                  flat hide-details></v-number-input>
              </div>
              <div class="d-flex flex-column align-center">
                <v-btn 
                  v-if="sStore.settings.cardAspectRatioHeight != sStore.defaultSettings.cardAspectRatioHeight ||
                  sStore.settings.cardAspectRatioWidth != sStore.defaultSettings.cardAspectRatioWidth"
                  class="mt-3 w-fit-content"
                  @click="sStore.restoreDefaultAspectRatio()"
                  color="primary"
                  round
                  density="compact"
                  icon="mdi-history">
              </v-btn>
              </div>
              
              <v-divider class="mt-3 mb-2"></v-divider>

              <span>Card Size</span>
              <div class="d-flex justify-space-between align-center">
                <v-number-input
                  label="Size in pixels"
                  :min="1"
                  v-model="sStore.settings.cardSize"
                  class="mt-3"
                  density="compact"
                  variant="solo-filled"
                  flat hide-details></v-number-input>
              </div>
              <div class="d-flex flex-column align-center">
                <v-btn 
                  v-if="sStore.settings.cardSize != sStore.defaultSettings.cardSize"
                  class="mt-3 w-fit-content"
                  @click="sStore.restoreDefaultCardSize()"
                  color="primary"
                  round
                  density="compact"
                  icon="mdi-history">
                </v-btn>
              </div>

              <v-divider class="mt-3"></v-divider>

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

              <v-divider class="mt-3 mb-2"></v-divider>

              <span>Card spacing</span>
              <div class="d-flex justify-space-between align-center">
                <v-number-input
                  label="Gap size in pixels"
                  :min="1"
                  v-model="sStore.settings.gap"
                  class="mt-3"
                  density="compact"
                  variant="solo-filled"
                  flat hide-details></v-number-input>
              </div>
              <div class="d-flex flex-column align-center">
                <v-btn 
                  v-if="sStore.settings.gap != sStore.defaultSettings.gap"
                  class="mt-3 w-fit-content"
                  @click="sStore.restoreDefaultGap()"
                  color="primary"
                  round
                  density="compact"
                  icon="mdi-history">
                </v-btn>
              </div>
              
            </v-card-text>
          </v-card>

          <v-card>
            <v-card-title>
              <v-icon start size="small">mdi-wall</v-icon>
              Background
            </v-card-title>
            <v-card-text>
              <v-btn-toggle
                class="w-100 mt-3"
                v-model="sStore.settings.isBackgroundImageEnabled">
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
                    width="100%"></v-color-picker>
                    <v-btn 
                      v-if="sStore.settings.backgroundColor != sStore.defaultSettings.backgroundColor"
                      class="mt-3"
                      @click="sStore.restoreDefaultColor()"
                      color="primary"
                      round
                      density="compact"
                      icon="mdi-history">
                    </v-btn>
                </div>
                <div v-if="sStore.settings.isBackgroundImageEnabled">
                  <v-file-input
                    v-model="backgroundImage"
                    label="Choose image" 
                    chips persistent-clear></v-file-input>
                </div>
              </div>
            </v-card-text>
          </v-card>
        </div>
        <div class="d-flex justify-space-around mt-4 pb-3">
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
</template>



<script setup lang="ts">
import { useSettingsStore } from "../store/Settings"
import { useModalsStore } from '../store/Modals';
import { Ref, ref, watch } from 'vue';
import { useFilesStore } from '../store/Files';
import { iFile } from "../Interfaces/FileInterface";

const sStore = useSettingsStore()
const mStore = useModalsStore()
const fStore = useFilesStore()
const backgroundImage: Ref<File|null> = ref(null);

watch(
    () => mStore.isSettingsPanelOpen,
    () => {
      if(mStore.isSettingsPanelOpen){
        const image: iFile|null = sStore.settings.backgroundImage
        if(image !== null){
          backgroundImage.value = new File([], image.name)
        }
      }
    }
  )

  watch(
    () => backgroundImage.value,
    () => {
      if(backgroundImage.value !== null && sStore.settings.isBackgroundImageEnabled){
        if(backgroundImage.value.size != 0){
          const image: File = backgroundImage.value
          fStore.convertFileToString(image).then(res =>{
            sStore.setBackgroundImage({name: image.name,data: res})
          })
        }
      }else{
        sStore.setBackgroundImage(null)
      }
    }
  )

</script>



<style lang="scss" scoped>
@use "../scss" as *;
</style>