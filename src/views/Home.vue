<template>
	<CardEdit />
  <Settings />

	<div class="h-screen w-100 overflow-auto d-flex">
		<div class="w-100 d-flex h-fit-content align-center flex-column home-wrapper ma-auto">
			<div class="cards-wrapper">
					<Draggable
						v-model="cStore.cards"
						tag="div"
						class="cards"
						id="cards-grid"
						item-key="(item) => item.value"
						:animation="200"
						:disabled="!sStore.settings.isDragAndDropEnabled"
						:ghostClass="'ghost'"
						@end="refreshDraggeble()"
						>
						<template #item="{ element: card }">
							<Card 
              :is-preview="false"
							:card="card"
							/>
						</template>
						<template #footer>
							<AddCard draggable="false" v-if="sStore.settings.isAddCardButtonEnabled"/>
						</template>
					</Draggable>
			</div>
		</div>
	</div>

  <v-snackbar 
    v-model="mStore.isSnackbarAddedCardEnabled"
    :timeout="baseTimeout"
    color="success"
    variant="tonal">
    <div class="d-flex">
      <v-icon>
        mdi-check-circle
      </v-icon>
      <div class="d-flex w-100 justify-center">
        New card&nbsp;<b>Added</b>
      </div>
    </div>
  </v-snackbar>

  <v-snackbar 
    v-model="mStore.isSnackbarEditedCardEnabled"
    :timeout="baseTimeout"
    variant="tonal">
    <div class="d-flex">
      <v-icon>
        mdi-pencil
      </v-icon>
      <div class="d-flex w-100 justify-center">
        Card&nbsp;<b>Edited</b>
      </div>
    </div>
  </v-snackbar>

  <v-snackbar 
    v-model="mStore.isSnackbarDeletedCardEnabled"
    :timeout="baseTimeout"
    color="warning"
    variant="tonal">
    <div class="d-flex">
      <v-icon>
        mdi-delete
      </v-icon>
      <div class="d-flex w-100 justify-center">
        Card was&nbsp;<b>Deleted</b>
      </div>
    </div>
  </v-snackbar>
</template>

<script setup lang="ts">
import { Ref, onBeforeMount, ref, watch} from 'vue';
import Draggable from 'vuedraggable'

import { useCardsStore } from '../store/Cards'
import { useSettingsStore } from '../store/Settings';
import { useDatabaseStore } from '../store/Database';
import { useModalsStore } from '../store/Modals'

import Card from "../components/Card.vue"
import CardEdit from "../components/CardEdit.vue"
import AddCard from '../components/AddCard.vue'
import Settings from "../components/Settings.vue"

const cStore = useCardsStore()
const sStore = useSettingsStore()
const dStore = useDatabaseStore()
const mStore = useModalsStore()

const baseTimeout : number = 2000

const cardsElement: Ref<HTMLElement|null> = ref(document.getElementById("cards-grid"))

function refreshDraggeble(){
  dStore.saveCards()
}

function setWrapperWidth(columns?: number):void{
	cardsElement.value = document.getElementById("cards-grid")
	if(cardsElement.value != null){
		if(columns === undefined){
			cardsElement.value.style.width = `fit-content`
		}else{
			var width:number = 200
			var gap:number = 20
			if(columns != undefined){
				cardsElement.value.style.width = `min(${width*columns + gap*(columns-1)}px,100%`
			}
		}
	}
}

onBeforeMount(()=> {
  // dStore.deleteCardsDatabase()
  // dStore.deleteSettingsDatabase()
	cStore.init()
	sStore.init()
})

watch(
	() => [sStore.settings.columnCount, sStore.settings.isLimitColumnsEnabled],
		() =>{
			if(sStore.settings.isLimitColumnsEnabled){
				setWrapperWidth(sStore.settings.columnCount)
			}else{
				setWrapperWidth()
			}
		}
)



</script>
<style lang="scss" scoped>
  .cards-wrapper {
    background-color: transparent;
    min-height: max-content;
    width: fit-content;
    display: flex;
    justify-content: center;
    box-sizing: border-box;
    .cards {
      background-color: transparent;
      width: fit-content;
      max-width: 90vw;
      height: fit-content;
      gap: 20px;
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
      justify-items: center;
      margin-top: 20px;
      margin-bottom: 20px;
      .ghost {
        opacity: 0.5;
      }
    }
  }
</style>