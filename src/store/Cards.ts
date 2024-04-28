import { defineStore } from 'pinia'
import { ref, Ref } from "vue"
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
  var editedCard: Ref<iCard> = ref(getEmptyCard())
  const editedCardColor: Ref<string> = ref("#464352")
  const dStore = useDatabaseStore()

  function getEmptyCard():iCard{
    return emptyCard
  }

  function deleteCard(card: iCard):void{
    const idx = cards.value.indexOf(ref(card))
    cards.value.splice(idx, 1)
  }

  function getEditedCard():Ref<iCard>{
      return editedCard
  }

  function setEditedCard(card: Ref<iCard>): void{
      editedCard = card
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
    editedCardColor,
    init, 
    setEditedCard,
    getEditedCard, getEmptyCard,
    deleteCard,
  }
})