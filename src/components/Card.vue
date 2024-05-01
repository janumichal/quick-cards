<template>
  <a class="sc" :class="props.isPreview ? 'noninteractive' : ''" :href="props.card.value.url">
    <div ref="card_background" class="sc_body">
      <Button class="sc_edit" :button-class="'round'" v-if="!props.isPreview" @click.stop="onEdit($event)">
        <img src="../assets/icons/edit.svg">
      </Button>
      <div v-if="props.isPreview" class="up-card-image" @click="loadedImage ? resetFile($event) : openFile($event)">
        <img v-if="!loadedImage" src="../assets/icons/upload.svg">
        <img v-if="loadedImage" src="../assets/icons/delete.svg">
      </div>
    </div>
    <div class="sc_name">{{ props.card.value.name }}</div>
  </a>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { iCard } from '../Interfaces/CardInterface';
import { useCardsStore } from '../store/Cards';
import { useSettingsStore } from "../store/Settings"
import { ref, Ref, onMounted, PropType, watch } from 'vue';
import { useModalsStore } from '../store/Modals';
import Button from './default/Button.vue';

const props = defineProps({
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
const sStore = useSettingsStore()
const mStore = useModalsStore()
const loadedImage: Ref<boolean> = ref(false)
const card_background: Ref<HTMLElement | undefined> = ref()

const { files, open, reset, onChange } = useFileDialog({
  accept: "image/jpg, image/png, image/jpeg",
  multiple: false
})
const emit = defineEmits(["get-image"])

onChange((files: FileList | null) => {
  if (files != null) {
    sStore.convertFileToString(files[0]).then(res => {
      setImage(res)
      loadedImage.value = true
      emit("get-image", res)
    })
  }
})

function setImage(file: string | null): void {
  if (card_background.value != undefined) {
    card_background.value.style.backgroundImage = `url(${file == null ? "none" : file})`
  }
}

function setColor(color: string): void {
  if (card_background.value != undefined) {
    card_background.value.style.backgroundColor = color
  }
}

function openFile(event: Event): void {
  open()
  event.preventDefault()
}

function resetFile(event: Event): void {
  reset()
  setImage(null)
  emit("get-image", null)
  loadedImage.value = false
  event.preventDefault()
}

async function onEdit(event: Event): Promise<void> {
  cStore.setEditedCard(props.card)
  mStore.isCardEditEnabled = true
  cStore.isNewCard = false
  event.preventDefault()
}

onMounted(() => {
  loadedImage.value = files.value || props.card.value.image != null ? true : false
  setImage(props.card.value.image)
  setColor(props.card.value.color)
})

watch(
  () => cStore.cards[cStore.cards.indexOf(props.card)],
  () => {
    setImage(props.card.value.image)
    setColor(props.card.value.color)
  },
  {
    deep: true
  }
)

</script>

<style lang="scss">
.noninteractive {
  background-color: rgba(0, 0, 0, 0.2);
}

.sc {
  width: 200px;
  height: fit-content;
  display: flex;
  flex-flow: column;
  align-items: center;
  gap: 5px;
  border-radius: 12px;
  padding: 8px;
  box-sizing: border-box;
  text-decoration: none;
  transition: background-color ease-in-out 0.2s;

  &:hover {
    background-color: rgba(0, 0, 0, 0.2);
    cursor: pointer;
  }

  &:hover>.sc_body>.sc_edit {
    transition: all ease-in-out 0.2s;
    opacity: 1;
  }

  .sc_body {
    aspect-ratio: 16/9;
    width: 100%;
    background-color: #b3b3ff;
    border-radius: 10px;
    display: flex;
    flex-flow: column;
    box-sizing: border-box;
    background-repeat: no-repeat;
    background-size: cover;
    box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.155);
    outline: 1px #00000046 solid;


    .up-card-image {
      height: 100%;
      cursor: pointer;
      background-color: #00000040;
      border-radius: 8px;
      display: flex;
      justify-content: center;
      align-items: center;
      opacity: .6;
      transition: all ease-in-out 0.2s;
      pointer-events: all;

      img {
        aspect-ratio: 1/1;
        height: 50px;
      }

      &:hover {
        opacity: 1;
      }
    }

    .sc_edit {
      aspect-ratio: 1/1;
      width: 30px;
      box-sizing: border-box;
      align-self: flex-end;
      margin: 5px;
      opacity: 0;

      img {
        aspect-ratio: 1/1;
        max-width: 100%;
      }
    }
  }

  .sc_name {
    font-size: 15px;
    color: #FFFFFF;
    font-weight: 200;
    text-shadow:
      -1px -1px 0 #000,
      0 -1px 0 #000,
      1px -1px 0 #000,
      1px 0 0 #000,
      1px 1px 0 #000,
      0 1px 0 #000,
      -1px 1px 0 #000,
      -1px 0 0 #000;
  }
}
</style>../store/Modals