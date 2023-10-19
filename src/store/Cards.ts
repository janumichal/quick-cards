import { defineStore } from 'pinia'
import { ref, toRaw, Ref } from "vue"
import { iCard } from '../Interfaces/CardInterface'

import default_json from "../assets/default.json"

export const useCardsStore = defineStore("cards", () => {
    const cards: Ref<iCard[]> = ref([])
    const editedCardIdx: Ref<number|null> = ref(null)

    function updateLocalStorege():void{
        localStorage.setItem("cards", JSON.stringify(toRaw(cards.value)))
    }

    function updateCard(card: iCard):void{
        cards.value[card.idx] = card
        // updateLocalStorege()
    }

    function deleteCard(card: iCard):void{
        cards.value.splice(card.idx, 1)
        updateLocalStorege()
    }

    function getEditedCard():iCard{
        return getCardContents(getEditedIdx())
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

    function getCards(): iCard[] { // TODO delete later
        return cards.value
    }

    function loadPreset(preset: {url: string, name: string}[]): void{
        for (let index = 0; index < preset.length; index++) {
            const element = preset[index];
            cards.value.push({url: element.url, name: element.name, idx: index})
        }
    }

    function init():void{
        var jsonString: string|null = localStorage.getItem("cards")

        if(jsonString == null){
            loadPreset(default_json)
        }else{
            cards.value = JSON.parse(jsonString)
        }
    }

    return {
        cards,
        setEditedIdx, getCards, updateCard, deleteCard, init, getEditedCard
    }
})