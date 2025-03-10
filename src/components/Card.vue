<template>
  <div>
    <v-hover v-slot="{ isHovering, props }" :disabled="cardProps.isPreview">
      <a class="text-decoration-none text-white"
        @click="(!isHovering || cardProps.card.value.isSpacer) ? $event.preventDefault(): ''"
        :class="(cardProps.isPreview || cardProps.card.value.isSpacer)? 'cursor-default': ''"
        :href="cardProps.card.value.url">
        <v-card 
          :width="sStore.settings.cardSize"
          v-bind:="props"
          class="w-fit-content ma-auto d-flex flex-column align-center rounded-0" 
          color="transparent"
          flat>
          <v-responsive :aspect-ratio="sStore.settings.cardAspectRatioWidth / sStore.settings.cardAspectRatioHeight" 
          class="w-100  rounded-lg"
          :class="cardProps.card.value.isSpacer? '' : 'elevation-2'">
            <div class="w-100 h-100 bg-size-cover pa-2 border-radius-10" ref="card_background">
              <v-btn 
                v-if="sStore.settings.cardEditEnabled"
                @click="onEdit($event)"
                height="30px"
                width="30px"
                icon=""
                density="comfortable"
                class="d-flex ml-auto opacity-0 z-index-1" 
                :class="isHovering? 'opacity-80':''">
                <v-icon size="20">mdi-pencil</v-icon>
              </v-btn>
            </div>
            <div 
            class="w-100 h-100 border-lg rounded-lg position-absolute top-0 border-surface border-opacity-animated top-div"
            :class="(isHovering && (!cardProps.card.value.isSpacer || sStore.settings.spacerOnHoverEffectEnabled)) ? 'border-opacity-75' : 'border-opacity-0'">
            </div>
          </v-responsive>
          <v-card-title v-if="sStore.settings.cardNameEnabled"
            class="py-0 px-4 mt-2 w-fit-content max-w-100
            rounded-pill
            text-center font-weight-bold text-subtitle-2 text-outline bg-opacity-animated"
            :class="(cardProps.card.value.name && !cardProps.card.value.isSpacer) ? (isHovering ? 'bg-surface-opacity-100' : 'bg-surface-opacity-70') : ''">
            {{ cardProps.card.value.isSpacer? '' : cardProps.card.value.name }}
          </v-card-title>
        </v-card>
      </a>
    </v-hover>
  </div>
</template>

<script setup lang="ts">
import { iCard } from '../Interfaces/CardInterface';
import { useCardsStore } from '../store/Cards';
import { useModalsStore } from '../store/Modals';
import { ref, Ref, onMounted, PropType } from 'vue';
import { watchDeep } from '@vueuse/core';
import { useSettingsStore } from '../store/Settings';
import { iFile } from '../Interfaces/FileInterface';

const cardProps = defineProps({
  isPreview: {
    type: Boolean,
    default: false,
    required: false
  },
  card: {
    type: Object as PropType<Ref<iCard>>,
    required: true
  }
})

const cStore = useCardsStore()
const mStore = useModalsStore()
const sStore = useSettingsStore()
const card_background: Ref<HTMLElement | undefined> = ref()

function setImage(file: iFile | null): void {
  if (card_background.value != undefined) {
    if (cardProps.card.value.isSpacer) {
      card_background.value.style.backgroundImage = 'url("none")';
    } else {
      card_background.value.style.backgroundImage = `url(${file == null ? "none" : file.data})`;
    }
  }
}

function setColor(color: string): void {
  if (card_background.value != undefined) {
    if (cardProps.card.value.isSpacer) {
      card_background.value.style.backgroundColor = 'transparent'
    } else {
      card_background.value.style.backgroundColor = color
    }
  }
}

async function onEdit(event: Event): Promise<void> {
  cStore.setEditedCard(cardProps.card)
  mStore.isCardEditEnabled = true
  cStore.isNewCard = false
  event.preventDefault()
}

onMounted(() => {
    setImage(cardProps.card.value.image)
    setColor(cardProps.card.value.color)
})

watchDeep(
  () => cardProps.card,
  () => {
    setImage(cardProps.card.value.image)
    setColor(cardProps.card.value.color)
  }
)

</script>

<style lang="scss" scoped>
@use "../scss" as *;
.border-radius-10 {
  border-radius: 10px;
}
.max-w-100 {
  max-width: 100%;
}
</style>
