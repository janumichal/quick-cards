<template>
	<EditWindow />
	<SettingsPanel />
	<div class="overflow">
		<Transition name="show-settings" mode="out-in"
			@after-leave="gStore.toggleSettingsWVisibility()">
			<RoundButton class="settings" @click="gStore.toggleSettingsBVisibility()" v-if="gStore.isSettingsButtonVisibile">
				<img src="../assets/icons/settings.svg"/>
			</RoundButton>
		</Transition>
		<div class="home-wrapper">
			<div class="cards-wrapper">
					<Draggable 
						v-model="cStore.cards"
						tag="div"
						class="cards"
						id="cards-grid"
						item-key="idx"
						:animation="200"
						:disabled="!sStore.isDragAndDropEnabled"
						:ghostClass="'ghost'"
						@end="cStore.updateDatabase()"
						>
						<template #item="{ element: card }">
							<Card 
              :is-preview="false"
							:card="card"
              :key="card"
							class="d_card"
							/>
						</template>
						<template #footer>
							<AddCard draggable="false" v-if="sStore.isAddCardButtonEnabled"/>
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
import { useGeneralStore } from '../store/General';

import Card from "../components/Card.vue"
import EditWindow from "../components/EditWindow.vue"
import AddCard from '../components/AddCard.vue';
import RoundButton from '../components/default/RoundButton.vue';
import SettingsPanel from "../components/SettingsPanel.vue"

const cStore = useCardsStore()
const sStore = useSettingsStore()
const gStore = useGeneralStore()


const cards_element: Ref<HTMLElement|null> = ref(document.getElementById("cards-grid"))


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
	cStore.init()
	sStore.init()
})

watch(
	() => [sStore.columnCount, sStore.isLimitColumnsEnabled],
		() =>{
			if(sStore.isLimitColumnsEnabled){
				setWrapperWidth(sStore.columnCount)
			}else{
				setWrapperWidth()
			}
		}
)



</script>

<style lang="scss" scoped>
	.settings{
		justify-self: end;
		margin: 10px;
		box-sizing: border-box;
		position: fixed;
		z-index: 1;
	}

	.overflow{
		display: grid;
		grid-template-columns: 1fr;
		width: 100%;
		.wrapper, .settings{
			grid-row-start: 1;
			grid-column-start: 1;
		}
	}

	.overflow{
		height: 100vh;
    width: 100%;
		overflow: auto;
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


	.show-settings-enter-active{
        animation-name: hide-btn-kf;
        animation-direction: reverse;
        animation-fill-mode: forwards;
        animation-duration: .3s;
        animation-timing-function: ease-in;
    }
    .show-settings-leave-active{
        animation-name: hide-btn-kf;
        animation-direction: normal;
        animation-fill-mode: forwards;
        animation-duration: .3s;
        animation-timing-function: ease-out;
    }

	@keyframes hide-btn-kf {
        0%{
            transform: translateX(0%);
        }
        100%{
            transform: translateX(+200%);
        }
    }
</style>../store/Cards