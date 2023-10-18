<template>
    <EditWindow />
    <div class="scs_wrapper">
		<div class="scs">
			<Card 
				v-for="sc in cStore.getCards()" 
				:url="sc.url"
				:name="sc.name"
				:idx="sc.idx"
				:key="sc.idx"
				/>
		</div>
	</div>
</template>

<script setup lang="ts">
    import { useCardsStore } from '../store/Cards'
	import Card from "../components/Card.vue"
    import EditWindow from "../components/EditWindow.vue"

	const cStore = useCardsStore()
</script>

<style lang="scss" scoped>
	.scs_wrapper {
		background-color: transparent;
		width: 100%;
		display: flex;
		justify-content: center;

		.scs {
			background-color: transparent;
			width: max-content;
			max-width: 90vw;
			gap: 10px;
			display: grid;
			grid-template-columns: repeat(auto-fill, minmax(200px, 1fr));
			justify-items: center;
			margin-top: 20px;
			margin-bottom: 20px;
		}
	}
</style>../store/Cards