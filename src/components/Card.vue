<template>
    <a class="sc" :class="isEditModeCard() ? 'noninteractive':''" :href="props.url">
        <div ref="card_background" class="sc_body" >
            <RoundButton v-if="!isEditModeCard()" class="sc_edit" @click.stop="cardClicked($event)">
                <img src="../assets/icons/edit.svg">
            </RoundButton>
            <div v-if="isEditModeCard()" class="up-card-image" @click="loadedImage ? resetFile($event) : openFile($event)">
                <img v-if="!loadedImage" src="../assets/icons/upload.svg">
                <img v-if="loadedImage" src="../assets/icons/delete.svg">
            </div>
        </div>
        <div class="sc_name">{{ props.name }}</div>
    </a>
</template>

<script setup lang="ts">
import { useFileDialog } from '@vueuse/core'
import { iCard } from '../Interfaces/CardInterface';
import { useCardsStore } from '../store/Cards';
import {useSettingsStore} from "../store/Settings"
import RoundButton from './default/RoundButton.vue';
import { ref, Ref, onMounted, watch, nextTick } from 'vue';

const props = defineProps<iCard>()
const cStore = useCardsStore()
const sStore = useSettingsStore()
const loadedImage: Ref<boolean> = ref(false)
const card_background: Ref<HTMLElement|undefined> = ref()


const {files, open, reset, onChange} = useFileDialog({
    accept: "image/jpg, image/png, image/jpeg",
    multiple: false
})
const emit = defineEmits(["emitImage"])

function emitImage(file: string|null):void{
    emit("emitImage", file)
}

onChange((files:FileList|null) => {
    if(files != null){
        sStore.convertFileToString(files[0]).then(res =>{
            setImage(res)
            loadedImage.value = true
            emitImage(res)
        })
    }
})

function setImage(file: string|null):void{
    if(card_background.value != undefined){
        card_background.value.style.backgroundImage = `url(${file == null ? "none" : file})`
    }
}

function setColor(color: string):void{
    if(card_background.value != undefined){
        card_background.value.style.backgroundColor = color
    }
}

function isEditModeCard():boolean{
    return props.idx == -1
}

function openFile(event: Event):void{
    open()
    event.preventDefault()
}

function resetFile(event: Event):void{
    reset()
    setImage(null)
    emitImage(null)
    loadedImage.value = false
    event.preventDefault()
}

function cardClicked(event: Event): void {
    cStore.setEditedIdx(props.idx)
    sStore.toggleEditWVisibility()
    event.preventDefault()
}

onMounted(() => {
    loadedImage.value = files.value || props.image != null ? true : false
    setImage(props.image)
    setColor(props.color)
})

watch(
    () => cStore.cards[props.idx],
    () =>{
        nextTick(() => {
            setImage(props.image)
            setColor(props.color)
        })
    }
)

watch(
    () => cStore.editedCardColor,
    () => {
        if(props.idx == -1){
            setColor(cStore.editedCardColor)
        }
    }
)

</script>

<style lang="scss">
    .noninteractive{
        background-color: rgba(0, 0, 0, 0.2);
    }
    .sc{
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
        &:hover{
            background-color: rgba(0, 0, 0, 0.2);
            cursor: pointer;
        }
        &:hover>.sc_body>.sc_edit{
            transition: all ease-in-out 0.2s;
            opacity: 1;
        }

        .sc_body{
            aspect-ratio: 16/9;
            width: 100%;
            background-color: rgb(179, 179, 255);
            border-radius: 10px;
            display: flex;
            flex-flow: column;
            box-sizing: border-box;
            background-repeat: no-repeat;
            background-size: cover;
            box-shadow: 0px 0px 15px 0px rgba(0, 0, 0, 0.155);
            outline: 1px #00000046 solid;


            .up-card-image{
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
                img{
                    aspect-ratio: 1/1;
                    height: 50px;
                }
                &:hover{
                    opacity: 1;
                }
            }
        
            .sc_edit{
                aspect-ratio: 1/1;
                width: 30px;
                box-sizing: border-box;
                align-self: flex-end;
                margin: 5px;
                opacity: 0;
                img{
                    aspect-ratio: 1/1;
                    max-width: 100%;
                }
            }
        }
        
        .sc_name{
            font-size: 15px;
            color: #FFFFFF;
            font-weight: 200;
            text-shadow:
            -1px -1px 0 #000,
            0   -1px 0 #000,
            1px -1px 0 #000,
            1px  0   0 #000,
            1px  1px 0 #000,
            0    1px 0 #000,
            -1px  1px 0 #000,
            -1px  0   0 #000;
        }
    }
</style>