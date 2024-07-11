<template>
	<CardEdit />
  <Settings />
	<div class="overflow">
		<div class="home-wrapper">
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
</template>

<script setup lang="ts">
import { Ref, onBeforeMount, ref, watch} from 'vue';
import Draggable from 'vuedraggable'

import { useCardsStore } from '../store/Cards'
import { useSettingsStore } from '../store/Settings';
import { useDatabaseStore } from '../store/Database';

import Card from "../components/Card.vue"
import CardEdit from "../components/CardEdit.vue"
import AddCard from '../components/AddCard.vue';
import Settings from "../components/Settings.vue"

const cStore = useCardsStore()
const sStore = useSettingsStore()
const dStore = useDatabaseStore()


const cards_element: Ref<HTMLElement|null> = ref(document.getElementById("cards-grid"))

function refreshDraggeble(){
  dStore.saveCards()
}

function setWrapperWidth(columns?: number):void{
	cards_element.value = document.getElementById("cards-grid")
	if(cards_element.value != null){
		if(columns === undefined){
			cards_element.value.style.width = `fit-content`
		}else{
			var width:number = 200
			var gap:number = 10
			if(columns != undefined){
				cards_element.value.style.width = `min(${width*columns + gap*(columns-1)}px,100%`
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
	.overflow{
		height: 100vh;
    width: 100%;
		overflow: auto;
    display: flex;
    align-items: center;
		.home-wrapper{
			height: fit-content;
			width: 100%;
			display: flex;
			align-items: center;
			flex-flow: column;
			align-self: center;
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
					gap: 10px;
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
		}	
	}
</style>