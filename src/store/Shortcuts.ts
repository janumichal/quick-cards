import { defineStore } from 'pinia'
import { ref } from "vue"
import type { Ref } from "vue"
import { Shortcut } from '../Interfaces/ShortcutInterface'
import { ShortcutID } from '../Interfaces/ShortcutInterface'

import default_json from "../assets/default.json"

export const useShortcutsStore = defineStore("shortcuts", () => {
    const cards: Ref<ShortcutID[]> = ref([])
    const editedCardIdx: Ref<number|null> = ref(null)


    function getEditedContents(idx: number|null): Shortcut{
        if(idx == null){
            return {url: "", name: ""}
        }
        var card: ShortcutID = cards.value[idx]
        return {url: card.url, name: card.name}
    }

    function setEditedIdx(idx: number): void{
        editedCardIdx.value = idx
    }

    function getEditedIdx(): number|null{
        return editedCardIdx.value
    }

    function getCards(): ShortcutID[] {
        if(!cards.value.length){
            loadPreset(default_json)
        }
        return cards.value
    }

    function loadPreset(preset: Shortcut[]): void{
        for (let index = 0; index < preset.length; index++) {
            const element = preset[index];
            cards.value.push({url: element.url, name: element.name, idx: index})
        }
    }
    return {
        setEditedIdx, getEditedIdx, getCards, getEditedContents
    }
})