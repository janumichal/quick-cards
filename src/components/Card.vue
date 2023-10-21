<template>
    <a class="sc" :class="isInteractive()" :href="props.url">
        <div class="sc_body">
            <RoundButton class="sc_edit" @click.stop="cardClicked($event)">
                <img src="../assets/icons/edit.svg">
            </RoundButton>
        </div>
        
        <div class="sc_name">{{ props.name }}</div>
    </a>
</template>

<script setup lang="ts">
import { iCard } from '../Interfaces/CardInterface';
import { useCardsStore } from '../store/Cards';
import {useSettingsStore} from "../store/Settings"
import RoundButton from './default/RoundButton.vue';

    const props = defineProps<iCard>()
    const cStore = useCardsStore()
    const sStore = useSettingsStore()


    function isInteractive(): string {
        return props.idx == -1 ? "noninteractive" : ""
    }


    function cardClicked(event: Event): void {
        cStore.setEditedIdx(props.idx)
        console.log(cStore.getEditedCard());
        sStore.toggleEditWVisibility()
        event.preventDefault()
    }

</script>

<style lang="scss">
    .noninteractive{
        pointer-events: none;
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
            padding: 5px;
            box-sizing: border-box;
        
            .sc_edit{
                aspect-ratio: 1/1;
                width: 30px;
                box-sizing: border-box;
                align-self: flex-end;
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
</style>../store/Cards../Interfaces/CardInterface