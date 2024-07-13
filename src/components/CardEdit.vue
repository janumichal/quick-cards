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
            <v-btn color="warning" @click="deleteConfirmationEnabled=true" v-if="!cStore.isNewCard">Delete</v-btn>
            <v-btn class="ml-auto" color="success" @click="saveCard()">{{ cStore.isNewCard ? "Add Card" : "Save"}}</v-btn>
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

  <v-dialog v-model="deleteConfirmationEnabled">
    <div class="d-flex flex-wrap w-fit-content ga-7 ma-auto align-center justify-center">
      <v-card class="w-fit-content">
        <v-card-text class="pa-5">
          Are you sure you want to delete this card?
        </v-card-text>
        <v-card-actions>
          <v-btn color="warning" @click="deleteCard()" v-if="!cStore.isNewCard">Delete</v-btn>
          <v-btn class="ml-auto" @click="deleteConfirmationEnabled=false">Cancel</v-btn>
        </v-card-actions>
      </v-card>
    </div>
  </v-dialog>
</template>


<script setup lang="ts">
import Card from "./Card.vue";

import { ref, toRaw, Ref, watch } from "vue";
import { useCardsStore } from "../store/Cards"
import { useModalsStore } from "../store/Modals";
import { useFilesStore } from "../store/Files";

const cStore = useCardsStore()
const mStore = useModalsStore()
const fStore = useFilesStore()

const cardImage: Ref<File|null> = ref(null)
const deleteConfirmationEnabled : Ref<boolean> = ref(false)

function deleteCard(): void {
  deleteConfirmationEnabled.value = false
  cStore.deleteEditedCard()
  closeEditModal()
  mStore.isSnackbarDeletedCardEnabled = true
}

function saveCard(): void {
  if (cStore.isNewCard) {
    cStore.cards.push(ref(structuredClone(toRaw(cStore.getEditedCard().value))))
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
    () => cardImage.value,
    () => {
      if(cardImage.value !== null){
        const image: File = cardImage.value
        fStore.convertFileToString(image).then(res => {
          cStore.getEditedCard().value.image = {name: image.name, data: res}
        })
      }
    }
  )
</script>


<style lang="scss" scoped>
@use "../scss" as *;


@media only screen and (max-width: 592px) {
  .divider {
    display: none;
  }

  .wrapper {
    max-width: 300px;
  }
}

.title {
  align-self: center;
}

.wrapper {
  display: flex;
  flex-flow: column;
  width: fit-content;
  gap: 20px;

  .button-wrapper {
    font-size: 16px;
    font-variation-settings: "wght" 500;
    display: flex;

    .save-btn,
    .delete-btn {
      padding: 10px 20px 10px 20px;
    }
  }

  .content-wrapper {
    display: flex;
    flex-flow: row;
    gap: 20px;
    align-items: center;
    min-width: 100%;
    flex-wrap: wrap;
    min-height: max-content;
    justify-content: center;

    .divider {
      height: 200px;
      width: 3px;
      border-radius: 5px;
      background-color: #0000003b;
      box-sizing: border-box;
    }

    .text-content-wrapper {
      min-width: 300px;
      display: flex;
      flex-flow: column;
      gap: 10px;

      .edit-wrapper {
        .subtitle {
          width: 100%;
          padding-top: 5px;
          padding-left: 5px;
          padding-bottom: 2px;
          box-sizing: border-box;
          font-size: 18px;
          display: flex;
          justify-content: left;
          border-radius: 5px;
        }

        .input-wrapper {
          width: 100%;

          input {
            border: none;
            outline: none;
            padding: 10px;
            box-sizing: border-box;
            width: 100%;
            font-size: 16px;
            color: #c5c5c5;
            background-color: #00000041;
            border-radius: 4px;
          }

        }
      }
    }

    .card-content-wrapper {
      width: max-content;
      height: 100%;
      display: flex;
      flex-flow: column;
      gap: 10px;

      .edit-color-wrapper {
        display: flex;
        flex-flow: row;
        justify-content: center;
        align-items: center;
        gap: 10px;

        input[type="color"] {
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

          &:hover {
            outline: 2px #222027 solid;
          }
        }

        ::-webkit-color-swatch-wrapper {
          padding: 0;
        }

        ::-webkit-color-swatch {
          border: 0;
          border-radius: 0;
        }

        ::-moz-color-swatch,
        ::-moz-focus-inner {
          border: 0;
        }

        ::-moz-focus-inner {
          padding: 0;
        }
      }
    }
  }
}
</style>../store/Modals