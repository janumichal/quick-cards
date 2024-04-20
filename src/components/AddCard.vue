<template>
     <div class="addcard-wrapper" @click="addNewCard()">
        <img src="../assets/icons/add.svg"/>
     </div>
</template>

<script setup lang="ts">
import { useCardsStore } from '../store/Cards';
import { useGeneralStore } from '../store/General';

const gStore = useGeneralStore()
const cStore = useCardsStore()


function addNewCard(){
    cStore.setEditedIdx(-1)
    gStore.toggleEditWVisibility()
}

</script>

<style lang="scss" scoped>
.addcard-wrapper{
    aspect-ratio: 16/9;
    width: 184px;
    background-color: #00000034;
    border-radius: 12px;
    margin: 8px;
    display: flex;
    justify-content: center;
    align-items: center;
    transition: all ease-in-out 0.2s;

    img{
        aspect-ratio: 1/1;
        width: 60px;
        opacity: .85;
    }

    &:hover{
        background-color: #00000058;
        cursor: pointer;
    }
}
    
</style>