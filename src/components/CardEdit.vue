<template>
  <v-dialog v-model="mStore.isCardEditEnabled">
    <div class="d-flex flex-wrap w-fit-content ga-7 ma-auto align-center justify-center">
      <v-card 
        class="w-fit-content">
        <v-card-title>
          <v-icon start size="small">mdi-card-plus</v-icon>
          {{ cStore.isNewCard ? "Create" : "Edit" }} Shortcut
        </v-card-title>
        <v-card-text class="pa-5">
          <div class="d-flex flex-row align-center">
            <div class="d-flex flex-column ga-5 h-fit-content">
              <v-text-field label="Name" v-model="cStore.getEditedCard().value.name"></v-text-field>
              <v-text-field label="URL" v-model="cStore.getEditedCard().value.url"></v-text-field>
            </div>
            <v-divider 
              class="mx-5"
              vertical></v-divider>
            <div class="d-flex flex-column ga-5">
              <v-color-picker v-model="cStore.getEditedCard().value.color"></v-color-picker>
              <v-file-input v-model="cardImage" label="Optional image" chips persistent-clear></v-file-input>
            </div>
          </div>
          <div class="d-flex w-100 justify-space-between mt-7">
            <v-btn color="warning">Delete</v-btn>
            <div class="d-flex ga-3">
              <v-btn>Cancel</v-btn>
              <v-btn color="success">Save</v-btn>
            </div>
          </div>

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




  <div>
    <Modal :isOpen="false" @modal-close="closeEditModal()">
      <template v-slot:header>
        <div class="title">
          {{ cStore.isNewCard ? "Create" : "Edit" }} Shortcut
        </div>
      </template>
      <template v-slot:content>
        <div class="wrapper">
          <div class="content-wrapper">
            <div class="text-content-wrapper">
              <div class="edit-wrapper">
                <div class="subtitle">
                  Name
                </div>
                <div class="input-wrapper">
                  <input type="text" id="cd_name" v-model="cStore.getEditedCard().value.name">
                </div>
              </div>
              <div class="edit-wrapper">
                <div class="subtitle">
                  URL
                </div>
                <div class="input-wrapper">
                  <input type="url" id="cd_url" v-model="cStore.getEditedCard().value.url">
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="card-content-wrapper">
              <Card :card='ref(cStore.getEditedCard().value)' :key="cStore.getEditedCard().value.color" :is-preview='true' />
              <div class="edit-color-wrapper">
                <div>
                  Card color
                </div>
                <ColorPicker v-model:input-color="cStore.getEditedCard().value.color"/>
              </div>
            </div>
          </div>
          <div class="button-wrapper" :style="'justify-content:' + (cStore.isNewCard ? 'end;': 'space-between;')">
            <Button v-if="!cStore.isNewCard" class="delete-btn" :button-class="'warning'" @click="deleteCard()">
              Delete
            </Button>
            <Button class="save-btn" :button-class="'submit'" @click="saveCard()">
              {{ cStore.isNewCard ? "Create" : "Save" }}
            </Button>
          </div>
        </div>

      </template>
    </Modal>
  </div>
</template>


<script setup lang="ts">
import Modal from "../components/default/Modal.vue"
import Card from "./Card.vue";
import Button from "./default/Button.vue";


import { ref, toRaw, Ref, watch } from "vue";
import { useCardsStore } from "../store/Cards"
import { useModalsStore } from "../store/Modals";
import ColorPicker from "./default/ColorPicker.vue";
import { useFilesStore } from "../store/Files";

const cStore = useCardsStore()
const mStore = useModalsStore()
const fStore = useFilesStore()

const cardImage: Ref<File|null> = ref(null)

function deleteCard(): void {
  cStore.deleteEditedCard()
  closeEditModal()
}

function saveCard(): void {
  if (cStore.isNewCard) {
    cStore.cards.push(ref(structuredClone(toRaw(cStore.getEditedCard().value))))
  } else {
    cStore.applyEditedCardChanges()
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