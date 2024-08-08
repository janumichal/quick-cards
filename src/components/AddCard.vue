<template>
    <div class="addcard-wrapper" @click="addNewCard()">
        <v-icon size="60px" class="opacity-60">mdi-plus</v-icon>
    </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '../store/Cards';
import { ref, toRaw } from "vue"
import { useModalsStore } from '../store/Modals';

const mStore = useModalsStore()
const cStore = useCardsStore()

function addNewCard() {
  cStore.setEditedCard(ref(structuredClone(toRaw(cStore.getEmptyCard()))))
  cStore.isNewCard = true
  mStore.isCardEditEnabled = true
}

</script>

<style lang="scss" scoped>
.addcard-wrapper {
    aspect-ratio: 16/9;
    width: 184px;
    background-color: #00000034;
    border-radius: 12px;
    margin: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in-out 0.2s;

    &:hover {
        background-color: #00000058;
        cursor: pointer;
    }
}
</style>../store/Modals