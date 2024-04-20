<template>
  <div>
    <ModalWindow :isOpen="gStore.isCardEditOpen" @modal-close="closeEditModal()">
      <template v-slot:header>
        <div class="title">
          {{ gStore.isNewCard ? "Create" : "Edit" }} Shortcut
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
                  <input type="text" id="cd_name" v-model="editedCard.name">
                </div>
              </div>
              <div class="edit-wrapper">
                <div class="subtitle">
                  URL
                </div>
                <div class="input-wrapper">
                  <input type="url" id="cd_url" v-model="editedCard.url">
                </div>
              </div>
            </div>
            <div class="divider"></div>
            <div class="card-content-wrapper">
              <Card @get-image="tmpImage = $event" :card='editedCard' :key="editedCard.color" :is-preview='true'/>
              <div class="edit-color-wrapper">
                <div>
                  Card color
                </div>
                <input class="edit-color-picker" type="color" v-model="editedCard.color">
              </div>
            </div>
          </div>
          <div class="button-wrapper">
            <NormalButton class="delete-btn" :btn-type="ButtonTypes.Warning" @click="deleteCard()">
              Delete
            </NormalButton>
            <NormalButton class="save-btn" :btn-type="ButtonTypes.Submit" @click="saveCard()">
              {{ gStore.isNewCard ? "Create" : "Save" }}
            </NormalButton>
          </div>
        </div>

      </template>
    </ModalWindow>
  </div>
</template>


<script setup lang="ts">
  import ModalWindow from "../components/default/ModalWindow.vue"
  import Card from "./Card.vue";
  import NormalButton from "./default/NormalButton.vue";


  import { ref, watch, Ref, toRaw } from "vue";
  import { useCardsStore } from "../store/Cards"
  import { useGeneralStore } from "../store/General";
  import { iCard } from "../Interfaces/CardInterface";
  import { ButtonTypes } from "../enums"

  const cStore = useCardsStore()
  const gStore = useGeneralStore()
  const card: Ref<iCard> = ref(cStore.getEditedCard())
  const editedCard: Ref<iCard> = ref(cStore.getEditedCard())
  const tmpImage: Ref<string | null> = ref(card.value.image)

  function deleteCard(): void {
    cStore.deleteCard(card.value)
    closeEditModal()
  }

  function saveCard(): void {
    editedCard.value.image = tmpImage.value
    tmpImage.value = null

    if(gStore.isNewCard){
      cStore.cards.push(structuredClone(toRaw(editedCard.value)))
    }else{
      // card.value = structuredClone(toRaw(editedCard.value))
      cStore.cards[cStore.cards.indexOf(card.value)] = structuredClone(toRaw(editedCard.value))
    }
    console.log(cStore.cards);
    
    cStore.updateDatabase()
    closeEditModal()
  }

  function closeEditModal() {
    gStore.isCardEditOpen = false
  }

  watch(
    () => gStore.isCardEditOpen,
    () => {
      if(gStore.isCardEditOpen == true){
        card.value = cStore.getEditedCard()
        editedCard.value = structuredClone(toRaw(card.value))
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
    justify-content: space-between;

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
</style>