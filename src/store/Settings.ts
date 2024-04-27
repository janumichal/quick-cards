import { defineStore } from 'pinia'
import { ref, Ref, watch, toValue, toRaw } from "vue"
import { iSettings } from '../Interfaces/SettingsInterface'
import { saveAs } from 'file-saver'
import { useFileDialog } from '@vueuse/core'
import { useDatabaseStore } from './Database'
import { useCardsStore } from './Cards'

export const useSettingsStore = defineStore("settings", () => {
  const isAddCardButtonEnabled: Ref<boolean> = ref(true)
  const isLimitColumnsEnabled: Ref<boolean> = ref(false)
  const columnCount: Ref<number> = ref(6)
  const isDragAndDropEnabled: Ref<boolean> = ref(true)

  const isBackgroundImageEnabled: Ref<boolean> = ref(false)
  const backgroundColor: Ref<string> = ref("#464352")
  const backgroundImage: Ref<string|null> = ref(null)

  const { open, onChange } = useFileDialog({
      accept: "application/json",
      multiple: false
  })

  const dStore = useDatabaseStore()
  const cStore = useCardsStore()

  function importSettings(){
      open()
  }

  onChange((files:FileList|null) => {
      if(files != null){
          const reader:FileReader = new FileReader()
          reader.readAsText(files[0])
          reader.onloadend = () => {
              if(typeof reader.result === "string"){
                  const settings: iSettings = JSON.parse(reader.result)
                  cStore.cards = settings.cards.map(e => ref(e))
                  backgroundColor.value = settings.backgroundColor
                  backgroundImage.value = settings.backgroundImage
                  isBackgroundImageEnabled.value = settings.isBackgroundImageEnabled
                  columnCount.value = settings.columnCount
                  isLimitColumnsEnabled.value = settings.isLimitColumnsEnabled
                  isAddCardButtonEnabled.value = settings.isAddCardButtonEnabled
                  dStore.saveCards(cStore.cards.map(e => toValue(e)))
              }
          }
      }
  })

  function exportSettings(){
      const settingsObject: iSettings = {
          cards: structuredClone(toRaw(cStore.cards)).map(e => toValue(e)),
          backgroundColor: backgroundColor.value,
          backgroundImage: backgroundImage.value,
          isBackgroundImageEnabled: isBackgroundImageEnabled.value,
          columnCount: columnCount.value,
          isLimitColumnsEnabled: isLimitColumnsEnabled.value,
          isAddCardButtonEnabled: isAddCardButtonEnabled.value,
          isDragAndDropEnabled: isDragAndDropEnabled.value
      }
      saveAs(new File([JSON.stringify(settingsObject)], "quick-cards-export.json",{
          type: "application/json"
      }))
  }

  function convertFileToString(file: File):Promise<string|null>{
      return new Promise((resolve) => {
          const reader:FileReader = new FileReader()
          reader.readAsDataURL(file)
          reader.onloadend = () => {
              if(typeof reader.result === "string"){
                  resolve(reader.result)
              }
          }
      })
  }

  function init():void{
      isBackgroundImageEnabled.value = false
      isAddCardButtonEnabled.value = true
      isLimitColumnsEnabled.value = false
      columnCount.value = 6
      isDragAndDropEnabled.value = true
      backgroundColor.value = "#464352"
      // getSettings()
      var dbExists:string|null = localStorage.getItem("hasBG")
      if(dbExists == null){
          putBGToDatabase()
      }else{
          getBGFromDatabase().then(res =>{
              if(res != null){
                  backgroundImage.value = res.image
              }
          })
      }
  }

  function initBGDatabase():Promise<IDBDatabase>{
      return new Promise((resolve) => {
          const request = indexedDB.open("card-bg");
          request.onupgradeneeded = () => {
              const db:IDBDatabase = request.result;
              const store = db.createObjectStore("background", {keyPath: "id"})
              store.createIndex("by_image", "image")
          }
          request.onsuccess = () => {
              resolve(request.result)
          }
      })
  }

  function updateBGDatabase():void{
      const request = indexedDB.open("card-bg")
      request.onsuccess = () => {
          const db:IDBDatabase = request.result
          const tx = db.transaction("background", "readwrite")
          const store = tx.objectStore("background")
          const request_clr = store.clear()
          request_clr.onsuccess = () => {
              putBGToDatabase()
              console.log("RENEW BG DB");
          }
      }
  }

  function putBGToDatabase():void{
      initBGDatabase().then(res => {
          const db:IDBDatabase = res
          const tx = db.transaction("background", "readwrite")
          const store = tx.objectStore("background")
          store.put({id: 0, image: backgroundImage.value})
          tx.oncomplete = () => {
              localStorage.setItem("hasBG", "true")
          }
      })
  }

  function getBGFromDatabase():Promise<{id: number, image: string}|null>{
      return new Promise((resolve) => {
          const request = indexedDB.open("card-bg");
          request.onsuccess = () => {
              const tx = request.result.transaction("background", "readwrite")
              const store = tx.objectStore("background")
              const getAllRequest = store.get(0)
              getAllRequest.onsuccess = () => {
                  resolve(getAllRequest.result)
              }
              getAllRequest.onerror = () => {
                  resolve(null)
              }
          }
      })
  }

watch(
  () => backgroundImage.value,
  () => {
      updateBGDatabase()
  }
)

  return {
      isAddCardButtonEnabled, isLimitColumnsEnabled, columnCount, isDragAndDropEnabled, 
      isBackgroundImageEnabled, backgroundColor, backgroundImage,
      init, updateBGDatabase, convertFileToString, exportSettings, importSettings
  }
})