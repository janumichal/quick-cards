<template>
    <a class="sc" :href="props.url">
        <div class="sc_body">
            <RoundButton class="sc_edit" @click.stop="cardClicked($event)">
                <img src="../assets/icons/edit.svg">
            </RoundButton>
        </div>
        
        <div class="sc_name">{{ props.name }}</div>
    </a>
</template>

<script setup lang="ts">
    import { ShortcutID } from '../Interfaces/ShortcutInterface';
    import { useShortcutsStore } from '../store/Shortcuts';
    import {useSettingsStore} from "../store/Settings"
    import RoundButton from './default/RoundButton.vue';

    const props = defineProps<ShortcutID>()
    const scStore = useShortcutsStore()
    const stStore = useSettingsStore()

    function cardClicked(event: Event): void{
        event.preventDefault()
        scStore.setEditedIdx(props.idx)
        stStore.toggleEditWVisibility()
    }

</script>

<style lang="scss">
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
</style>