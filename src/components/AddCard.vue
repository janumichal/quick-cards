<template>
  <div @click="addNewCard()">
    <v-hover v-slot="{ isHovering, props }">
      <v-card width="200px" v-bind:="props"
        class="w-fit-content ma-auto d-flex flex-column align-center pa-2 cursor-pointer"
        color="transparent" flat>
        <v-responsive :aspect-ratio="16 / 9" class="w-100 rounded-lg elevation-2">
          <div class="w-100 h-100 bg-black opacity-20 d-flex align-center justify-center bg-animated"
            :class="isHovering ? 'opacity-30' : ''">
            <v-icon size="70px" class="opacity-90">mdi-plus</v-icon>
          </div>
        </v-responsive>
        <v-card-title class="py-0 px-4 mt-2 text-placeholder
            rounded-pill 
            text-center font-weight-bold text-subtitle-2 text-outline bg-black opacity-20 bg-animated"
            :class="isHovering ? 'opacity-30' : ''"
            v-if="sStore.settings.cardNameEnabled">
        </v-card-title>
      </v-card>
    </v-hover>
  </div>
</template>
<script setup lang="ts">
import { useCardsStore } from '../store/Cards';
import { useModalsStore } from '../store/Modals';
import { useSettingsStore } from '../store/Settings';
import { ref, toRaw } from "vue"

const mStore = useModalsStore()
const cStore = useCardsStore()
const sStore = useSettingsStore()

function addNewCard() {
  cStore.setEditedCard(ref(structuredClone(toRaw(cStore.getEmptyCard()))))
  cStore.isNewCard = true
  mStore.isCardEditEnabled = true
}

</script>

<style lang="scss" scoped>
@use "../scss" as *;

.text-placeholder{
  width: 100px;
  height: 18px;
}
.bg-animated{
  transition: opacity .2s ease-out;
}
</style>