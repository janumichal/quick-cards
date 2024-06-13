import { defineStore } from 'pinia'
import { ref, Ref, toRaw } from "vue"
import { iCard } from '../Interfaces/CardInterface'

import default_json from "../assets/default.json"
import { useDatabaseStore } from './Database'

export const useCardsStore = defineStore("cards", () => {
  const emptyCard: iCard = {
    url: "",
    name: "",
    color: "#b3b3ff",
    image: null
  }

  var cards: Ref<Ref<iCard>[]> = ref([])
  var originalCard: Ref<iCard> = ref(getEmptyCard())
  var editedCard: Ref<iCard> = ref(getEmptyCard())

  const isNewCard: Ref<boolean> = ref(false)

  const dStore = useDatabaseStore()

  function getEmptyCard():iCard{
    return emptyCard
  }

  function deleteEditedCard():void{
    const idx = cards.value.indexOf(originalCard)
    cards.value.splice(idx, 1)
    clearEditedCard()
    dStore.saveCards()
  }

  function getEditedCard():Ref<iCard>{
      return editedCard
  }

  function setEditedCard(card: Ref<iCard>): void{
    originalCard = card
    editedCard.value = structuredClone(toRaw(originalCard.value))
  }

  function clearEditedCard(): void{
    setEditedCard(ref(getEmptyCard()))
  }

  function applyEditedCardChanges():void{
    originalCard.value = structuredClone(toRaw(editedCard.value))
    dStore.saveCards()
  }

  function loadPreset(preset: {url:string, name: string}[]): void{
      for (let index = 0; index < preset.length; index++) {
          cards.value.push(ref({...preset[index], ...{image: null, color: "#CCCCFF"}}))
      }
  }

  async function init():Promise<void>{
      if(!await dStore.cardDbExists()){
          loadPreset(default_json)
          dStore.saveCards()
      }else{
        dStore.getCards().then(res => {
            cards.value = res.map(card => ref(card))
        })
      }
  }



  return {
    cards,
    init, 
    setEditedCard,
    getEditedCard, getEmptyCard, 
    clearEditedCard, applyEditedCardChanges,
    isNewCard,
    deleteEditedCard,
  }
})