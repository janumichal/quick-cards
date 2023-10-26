import { defineStore } from 'pinia'
import { ref, toRaw, Ref } from "vue"
import { iCard } from '../Interfaces/CardInterface'

import default_json from "../assets/default.json"

export const useCardsStore = defineStore("cards", () => {
    const cards: Ref<iCard[]> = ref([])
    const editedCardIdx: Ref<number> = ref(-1)
    const editedCardColor: Ref<string> = ref("#464352")

    function updateCard(card: iCard):void{
        if(card.idx == -1){
            var idx:number = cards.value.length
            card.idx = idx
            cards.value.push(card)
        }else{
            cards.value[card.idx] = card
        }
        updateDatabase()
    }

    function deleteCard(card: iCard):void{
        cards.value.splice(card.idx, 1)
        updateDatabase()
    }

    function getEditedCard():iCard{
        return getCardContents(getEditedIdx())
    }

    function getCardContents(idx: number): iCard{
        if(idx == -1){
            return {idx: -1, url: "", name: "", image: null, color: "#CCCCFF" }
        }
        return structuredClone(toRaw(cards.value[idx]))
    }


    function setEditedIdx(idx: number): void{
        editedCardIdx.value = idx
    }

    function getEditedIdx(): number{
        return editedCardIdx.value
    }

    function loadPreset(preset: {url:string, name: string}[]): void{
        for (let index = 0; index < preset.length; index++) {
            cards.value.push({...{idx: index}, ...preset[index], ...{image: null, color: "#CCCCFF"}})
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
        setEditedIdx, updateCard, deleteCard, init, getEditedCard, updateDatabase
        ,removeDatabases
    }
})