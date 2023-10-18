import { defineStore } from 'pinia'
import { ref, toRaw } from "vue"
import type { Ref } from "vue"
import { iCard } from '../Interfaces/CardInterface'

import default_json from "../assets/default.json"

export const useCardsStore = defineStore("cards", () => {
    const cards: Ref<iCard[]> = ref([])
    const editedCardIdx: Ref<number|null> = ref(null)


    function updateCard(card: iCard){
        cards.value[card.idx] = {idx: card.idx, name: card.name, url: card.url}
    }

    function getCardContents(idx: number|null): iCard{
        if(idx == null){
            return {idx: -1, url: "", name: ""}
        }
        return structuredClone(toRaw(cards.value[idx]))
    }

    function setEditedIdx(idx: number): void{
        editedCardIdx.value = idx
    }

    function getEditedIdx(): number|null{
        return editedCardIdx.value
    }

    function getCards(): iCard[] {
        if(!cards.value.length){
            loadPreset(default_json)
        }
        return cards.value
    }

    function loadPreset(preset: {url: string, name: string}[]): void{
        for (let index = 0; index < preset.length; index++) {
            const element = preset[index];
            cards.value.push({url: element.url, name: element.name, idx: index})
        }
    }
    return {
        setEditedIdx, getEditedIdx, getCards, getCardContents, updateCard
    }
})