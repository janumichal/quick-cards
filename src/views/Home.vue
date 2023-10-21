<template>
	<EditWindow />
	<SettingsPanel />
	<div class="overflow">
		<Transition name="show-settings"
			@after-leave="sStore.toggleSettingsWVisibility()"
			@before-leave="tStore.addTransition()"
			@after-enter="tStore.removeTransition()">
			<RoundButton class="settings" @click="sStore.toggleSettingsBVisibility()" v-if="sStore.isSettingsButtonVisibile">
				<img src="../assets/icons/settings.svg"/>
			</RoundButton>
		</Transition>
		<div class="home-wrapper">
			<div class="cards-wrapper">
					<Draggable 
						v-model="cStore.cards"
						tag="div"
						class="cards"
						item-key="idx"
						:animation="200"
						:disabled="false"
						:ghostClass="'ghost'"
						@end="cStore.renewDB()"
						>
						<template #item="{ element: card }">
							<Card 
							:url="card.url"
							:name="card.name"
							:idx="card.idx"
							:key="card.idx"
							class="d_card"
							/>
						</template>
						<template #footer>
							<AddCard draggable="false" v-if="sStore.isAddCardButtonVisible"/>
						</template>
					</Draggable>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { onBeforeMount } from 'vue';
import Draggable from 'vuedraggable'

import { useCardsStore } from '../store/Cards'
import { useTransitionsStore } from '../store/Transitions';
import { useSettingsStore } from '../store/Settings';

import Card from "../components/Card.vue"
import EditWindow from "../components/EditWindow.vue"
import AddCard from '../components/AddCard.vue';
import RoundButton from '../components/default/RoundButton.vue';
import SettingsPanel from "../components/SettingsPanel.vue"

const cStore = useCardsStore()
const tStore = useTransitionsStore()
const sStore = useSettingsStore()


onBeforeMount(()=> {
	cStore.init()
	sStore.init()
	tStore.init()
})

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