import { defineStore } from 'pinia'
import { ref, Ref, watch } from "vue"
import { iSettings, iSettingsObject } from '../Interfaces/SettingsInterface'
import { useCardsStore } from './Cards'
import { saveAs } from 'file-saver'
import { useFileDialog } from '@vueuse/core'

export const useSettingsStore = defineStore("settings", () => {
    const isEditWindowVisible: Ref<boolean> = ref(false)
    const isSettingsWindowVisible: Ref<boolean> = ref(false)
    const isSettingsButtonVisibile: Ref<boolean> = ref(!isSettingsWindowVisible.value)
    const isAddCardButtonVisible: Ref<boolean> = ref(true)
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
                    const settings: iSettingsObject = JSON.parse(reader.result)
                    cStore.cards = settings.cards
                    backgroundColor.value = settings.backgroundColor
                    backgroundImage.value = settings.backgroundImage
                    isBackgroundImageEnabled.value = settings.isBackgroundImageEnabled
                    columnCount.value = settings.columnCount
                    isLimitColumnsEnabled.value = settings.isLimitColumnsEnabled
                    isAddCardButtonVisible.value = settings.isAddCardButtonVisible
                    cStore.updateDatabase()
                }
            }
        }
    })

    function exportSettings(){
        const settingsObject:iSettingsObject = {
            cards: cStore.cards,
            backgroundColor: backgroundColor.value,
            backgroundImage: backgroundImage.value,
            isBackgroundImageEnabled: isBackgroundImageEnabled.value,
            columnCount: columnCount.value,
            isLimitColumnsEnabled: isLimitColumnsEnabled.value,
            isAddCardButtonVisible: isAddCardButtonVisible.value
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

    function toggleSettingsBVisibility():void{
        isSettingsButtonVisibile.value = !isSettingsButtonVisibile.value
    }

    function toggleSettingsWVisibility():void{
        isSettingsWindowVisible.value = !isSettingsWindowVisible.value
	}

    function toggleEditWVisibility(): void{
        isEditWindowVisible.value = !isEditWindowVisible.value
    }

    function init():void{
        isBackgroundImageEnabled.value = false
        isEditWindowVisible.value = false
        isSettingsWindowVisible.value = false
        isSettingsButtonVisibile.value = !isSettingsWindowVisible.value
        isAddCardButtonVisible.value = true
        isLimitColumnsEnabled.value = false
        columnCount.value = 6
        isDragAndDropEnabled.value = true
        backgroundColor.value = "#464352"
        getSettings()
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

    function getSettings():void{
        var jsonSettings: string|null = localStorage.getItem("cards-settings")
        if(jsonSettings != null){
            var settings: iSettings = JSON.parse(jsonSettings)
            isAddCardButtonVisible.value = settings.isAddCardButtonVisible
            isLimitColumnsEnabled.value = settings.isLimitColumnsEnabled
            columnCount.value = settings.columnCount
            isDragAndDropEnabled.value = settings.isDragAndDropEnabled
            isBackgroundImageEnabled.value = settings.isBackgroundImageEnabled
            backgroundColor.value = settings.backgroundColor
        }
    }

    function setSettings():void{
        var settings: iSettings = {
            "isAddCardButtonVisible": isAddCardButtonVisible.value,
            "isLimitColumnsEnabled": isLimitColumnsEnabled.value,
            "columnCount": columnCount.value,
            "isDragAndDropEnabled": isDragAndDropEnabled.value,
            "isBackgroundImageEnabled": isBackgroundImageEnabled.value,
            "backgroundColor": backgroundColor.value,
        }
        localStorage.setItem("cards-settings", JSON.stringify(settings))
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
        () => [
            isAddCardButtonVisible.value, 
            isLimitColumnsEnabled.value,
            columnCount.value,
            isDragAndDropEnabled.value,
            isBackgroundImageEnabled.value,
            backgroundColor.value,
        ],
            () =>{
                setSettings()
            }
    )

    watch(
        () => backgroundImage.value,
        () => {
            updateBGDatabase()
        }
    )

    return {
        isAddCardButtonVisible, isSettingsWindowVisible, isEditWindowVisible, isSettingsButtonVisibile, isLimitColumnsEnabled,
        columnCount, isDragAndDropEnabled, isBackgroundImageEnabled, backgroundColor, backgroundImage,
        toggleEditWVisibility, toggleSettingsWVisibility, toggleSettingsBVisibility, init, updateBGDatabase, convertFileToString, 
        exportSettings, importSettings
    }
})