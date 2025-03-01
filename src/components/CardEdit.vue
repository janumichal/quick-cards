<template>
  <v-dialog v-model="mStore.isCardEditEnabled">
    <div class="d-flex flex-wrap w-fit-content ga-7 ma-auto align-center justify-center">
      <v-card 
        class="w-fit-content">
        <v-card-title class="d-flex align-center">
          <v-icon start size="small">mdi-card-plus</v-icon>
          {{ cStore.isNewCard ? "Create" : "Edit" }} Shortcut
          <v-btn class="ml-auto" icon="mdi-close" density="comfortable" elevation="1" @click="closeEditModal()"></v-btn>
        </v-card-title>
        <v-card-text class="pa-5 ">
          <div class="d-flex flex-row align-center">
            <div class="d-flex flex-column ga-5 h-fit-content">
              <v-text-field label="Name" v-model="cStore.getEditedCard().value.name"></v-text-field>
              <v-text-field label="URL" v-model="cStore.getEditedCard().value.url"></v-text-field>
              <v-file-input v-model="cardImage" label="Optional Background Image" chips persistent-clear></v-file-input>
            </div>
            <v-divider
              class="mx-5"
              vertical></v-divider>
            <div class="d-flex flex-column ga-5">
              <v-color-picker v-model="cStore.getEditedCard().value.color"></v-color-picker>
            </div>
          </div>
          <v-card-actions class="pa-0 mt-3 min-h-fit-content">
            <v-btn variant="outlined" color="warning" @click="deleteCard()" v-if="!cStore.isNewCard">Delete</v-btn>
            <v-spacer></v-spacer>
            <v-btn variant="outlined" color="success" @click="saveCard()">{{ cStore.isNewCard ? "Add Card" : "Save"}}</v-btn>
          </v-card-actions>
        </v-card-text>
      </v-card>

      <v-card>
        <v-card-title>
          Preview
        </v-card-title>
        <v-card-text class="pa-5">
          <Card :is-preview="true" :card="cStore.getEditedCard()"></Card>
        </v-card-text>
      </v-card>
    </div>
  </v-dialog>
</template>


<script setup lang="ts">
import Card from "./Card.vue";

import { ref, Ref, watch } from "vue";
import { useCardsStore } from "../store/Cards"
import { useModalsStore } from "../store/Modals";
import { useFilesStore } from "../store/Files";
import { iFile } from "../Interfaces/FileInterface";

const cStore = useCardsStore()
const mStore = useModalsStore()
const fStore = useFilesStore()

const cardImage: Ref<File|null> = ref(null)

function deleteCard(): void {
  cStore.deleteEditedCard()
  closeEditModal()
  mStore.isSnackbarDeletedCardEnabled = true
}

function saveCard(): void {
  if (cStore.isNewCard) {
    cStore.saveEditedCard()
    mStore.isSnackbarAddedCardEnabled = true
  } else {
    cStore.applyEditedCardChanges()
    mStore.isSnackbarEditedCardEnabled = true
  }
  cStore.clearEditedCard()
  closeEditModal()
}

function closeEditModal() {
  mStore.isCardEditEnabled = false
}

watch(
    () => mStore.isCardEditEnabled,
    () => {
      if(mStore.isCardEditEnabled){
        const image: iFile|null = cStore.getEditedCard().value.image
        if(image !== null){
          cardImage.value = new File([], image.name)
        } else {
          cardImage.value = null
        }
      }
    }
  )

watch(
    () => cardImage.value,
    () => {
      if (cardImage.value !== null){
        if (cardImage.value.size == 0) {
          return;
        }
        const image: File = cardImage.value
        fStore.convertFileToString(image).then(res => {
          cStore.getEditedCard().value.image = {name: image.name, data: res}
        })
      } else {
        cStore.getEditedCard().value.image = null
      }
    }
  )
</script>


<style lang="scss" scoped>
@use "../scss" as *;

</style>