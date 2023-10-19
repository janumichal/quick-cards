<template>
	<EditWindow />
	<SettingsPanel />
	<div class="overflow">
		<Transition name="show-settings"
			@after-leave="sStore.toggleSettingsWVisibility()"
			@before-leave="tStore.addTransition()"
			@after-enter="tStore.removeTransition()">
			<RoundButton class="settings" @click="sStore.toggleSettingsBVisibility()" v-if="sStore.isSettingsBVisible()">
				<img src="../assets/icons/settings.svg"/>
			</RoundButton>
		</Transition>
		<div class="wrapper">
			<div class="cards-wrapper">
				<div class="cards">
					<Card 
						v-for="sc in cStore.cards" 
						:url="sc.url"
						:name="sc.name"
						:idx="sc.idx"
						:key="sc.idx"
						/>
				</div>
			</div>
		</div>
	</div>
</template>

<script setup lang="ts">
import { useCardsStore } from '../store/Cards'
import { useTransitionsStore } from '../store/Transitions';
import { useSettingsStore } from '../store/Settings';

import Card from "../components/Card.vue"
import EditWindow from "../components/EditWindow.vue"
import RoundButton from '../components/default/RoundButton.vue';
import SettingsPanel from "../components/SettingsPanel.vue"
import { onBeforeMount } from 'vue';

const cStore = useCardsStore()
const tStore = useTransitionsStore()
const sStore = useSettingsStore()

onBeforeMount(()=> {
	cStore.init()
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
		.wrapper{
			height: fit-content;
			width: 100%;
			display: flex;
			justify-content: center;
			align-items: center;
			flex-flow: column;
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