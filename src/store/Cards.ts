import { defineStore } from 'pinia'
import { ref, toRaw, Ref, watch } from "vue"
import { iCard } from '../Interfaces/CardInterface'

import default_json from "../assets/default.json"

export const useCardsStore = defineStore("cards", () => {
    const cards: Ref<iCard[]> = ref([])
    const editedCardIdx: Ref<number> = ref(-1)

    watch(
        () => cards.value,
            () =>{
                reIndexArray()
            }
    )

    function reIndexArray():void{
        for (let index = 0; index < cards.value.length; index++) {
            cards.value[index].idx = index
        }
    }

    function updateCard(card: iCard):void{
        if(card.idx == -1){
            var idx:number = cards.value.length
            card.idx = idx
            cards.value.push(card)
            addItemDB(card)
        }else{
            cards.value[card.idx] = card
            editItemDB(card)
        }
    }

    function deleteCard(card: iCard):void{
        cards.value.splice(card.idx, 1)
        reIndexArray()
        renewDB()
    }

    function getEditedCard():iCard{
        return getCardContents(getEditedIdx())
    }

    function getCardContents(idx: number): iCard{
        if(idx == -1){
            return {idx: -1, url: "", name: "", image: null }
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
            cards.value.push({...{idx: index}, ...preset[index], ...{image: null}})
        }
    }

    function init():void{
        var dbExists:string|null = localStorage.getItem("hasCustom")
        
        if(dbExists == null){
            loadPreset(default_json)
            putCardsToDB()
        }else{
            getCardsFromDB().then(res => {
                cards.value = res
            })
        }
    }

    function putCardsToDB():void{
        initDatabase().then(res => {
            const db:IDBDatabase = res
            const tx = db.transaction("cards", "readwrite")
            const store = tx.objectStore("cards")
            cards.value.forEach(element => {
                store.put({idx: element.idx, url: element.url, name: element.name, image: element.image})
            })
            tx.oncomplete = () => {
                localStorage.setItem("hasCustom", "true")
            }
        })
    }

    function getCardsFromDB():Promise<iCard[]>{
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

    function removeDatabases():void{
        const request = indexedDB.deleteDatabase("card-layout"); 
        request.onsuccess = () => { 
                console.log("Database deleted successfully"); 
        } 
        localStorage.clear()
    }

    function initDatabase():Promise<IDBDatabase>{
        return new Promise((resolve) => {
            const request = indexedDB.open("card-layout");
            request.onupgradeneeded = () => {
                const db:IDBDatabase = request.result;
                const store = db.createObjectStore("cards", {keyPath: "idx"})
                store.createIndex("by_url", "url")
                store.createIndex("by_name", "name")
                store.createIndex("by_image", "image")
            }
            request.onsuccess = () => {
                resolve(request.result)
            }
        })
        
    }

    function addItemDB(card:iCard):void{
        const request = indexedDB.open("card-layout");
        request.onsuccess = () => {
            const db:IDBDatabase = request.result
            const tx = db.transaction("cards", "readwrite")
            const store = tx.objectStore("cards")
            store.put(toRaw(card))
            tx.oncomplete = () => {
                console.log("ADDED to DB");
            }
        }
    }

    function editItemDB(card:iCard):void{
        const request = indexedDB.open("card-layout");
        request.onsuccess = () => {
            const db:IDBDatabase = request.result
            const tx = db.transaction("cards", "readwrite")
            const store = tx.objectStore("cards")
            store.put(toRaw(card))
            tx.oncomplete = () => {
                console.log("EDITED in DB");
            }
        }
    }

    function renewDB():void{
        const request = indexedDB.open("card-layout")
        request.onsuccess = () => {
            const db:IDBDatabase = request.result
            const tx = db.transaction("cards", "readwrite")
            const store = tx.objectStore("cards")
            const request_clr = store.clear()
            request_clr.onsuccess = () => {
                putCardsToDB()
                console.log("RENEW DB");
            }
        }
    }

    return {
        cards,
        setEditedIdx, updateCard, deleteCard, init, getEditedCard, renewDB
        ,removeDatabases
    }
})