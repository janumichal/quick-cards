import { defineStore } from 'pinia'
import { ref, Ref } from "vue"
import { iCard } from '../Interfaces/CardInterface'

import default_json from "../assets/default.json"

export const useCardsStore = defineStore("cards", () => {
  const emptyCard: iCard = {
    url: "",
    name: "",
    color: "#b3b3ff",
    image: null
  }
  const cards: Ref<iCard[]> = ref([])
  const editedCard: Ref<iCard> = ref(getEmptyCard())
  const editedCardColor: Ref<string> = ref("#464352")

  function getEmptyCard():iCard{
    return emptyCard
  }

  function deleteCard(card: iCard):void{
    const idx = cards.value.indexOf(card)
      cards.value.splice(idx, 1)
      updateDatabase()
  }

  function getEditedCard():iCard{
      return editedCard.value
  }

  function setEditedCard(card: iCard): void{
      editedCard.value = card
  }

  function loadPreset(preset: {url:string, name: string}[]): void{
      for (let index = 0; index < preset.length; index++) {
          cards.value.push({...preset[index], ...{image: null, color: "#CCCCFF"}})
      }
  }

  function init():void{
      var dbExists:string|null = localStorage.getItem("hasCustom")
      
      if(dbExists == null){
          loadPreset(default_json)
          putCardsToDatabase()
      }else{
          getCardsFromDatabase().then(res => {
              cards.value = res
          })
      }
  }

  function initDatabase():Promise<IDBDatabase>{
      return new Promise((resolve) => {
          const request = indexedDB.open("card-layout");
          request.onupgradeneeded = () => {
              const db:IDBDatabase = request.result;
              const store = db.createObjectStore("cards", {keyPath: "idx"})
              store.createIndex("by_url", "url")
              store.createIndex("by_name", "name")
              store.createIndex("by_color", "color")
              store.createIndex("by_image", "image")
          }
          request.onsuccess = () => {
              resolve(request.result)
          }
      })
      
  }

  function updateDatabase():void{
      const request = indexedDB.open("card-layout")
      request.onsuccess = () => {
          const db:IDBDatabase = request.result
          const tx = db.transaction("cards", "readwrite")
          const store = tx.objectStore("cards")
          const request_clr = store.clear()
          request_clr.onsuccess = () => {
              putCardsToDatabase()
              console.log("RENEW DB");
          }
      }
  }

    function putCardsToDatabase():void{
        initDatabase().then(res => {
            const db:IDBDatabase = res
            const tx = db.transaction("cards", "readwrite")
            const store = tx.objectStore("cards")
            for (let index = 0; index < cards.value.length; index++) {
                const element = cards.value[index]
                store.put({idx: index, url: element.url, name: element.name, image: element.image, color: element.color})
            }
            tx.oncomplete = () => {
                localStorage.setItem("hasCustom", "true")
            }
        })
    }

  function getCardsFromDatabase():Promise<iCard[]>{
      return new Promise((resolve) => {
          const request = indexedDB.open("card-layout");
          request.onsuccess = () => {
              const tx = request.result.transaction("cards", "readwrite")
              const store = tx.objectStore("cards")
              const getAllRequest = store.getAll()
              getAllRequest.onsuccess = () => {
                  resolve(getAllRequest.result)
              }
              getAllRequest.onerror = () => {
                  resolve([])
              }
          }
      })
  }

  function removeDatabases():void{ // TODO remove
      const request = indexedDB.deleteDatabase("card-layout"); 
      const request2 = indexedDB.deleteDatabase("card-bg"); 
      request.onsuccess = () => { 
              console.log("Card database deleted successfully"); 
      } 
      request2.onsuccess = () => { 
          console.log("BG database deleted successfully"); 
  } 
      localStorage.clear()
  }

  return {
      cards, editedCardColor,
      setEditedCard, deleteCard, init, getEditedCard, getEmptyCard,
      updateDatabase, removeDatabases
  }
})