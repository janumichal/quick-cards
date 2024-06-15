import { defineStore } from 'pinia'
import { iCard } from '../Interfaces/CardInterface';
import { toRaw, toValue } from 'vue';
import { iSettings } from '../Interfaces/SettingsInterface';
import { useCardsStore } from './Cards';
import { useSettingsStore } from './Settings';

export const useDatabaseStore = defineStore("database", () => {
  const LAYOUT_DB = "cards_layout";
  const LAYOUT_OBJECT_STORE = "cards"
  const SETTINGS_DB = "cards_settings";
  const SETTINGS_OBJECT_STORE = "settings"

  const CURRENT_DB_VERSION = 1

  const cStore = useCardsStore()
  const sStore = useSettingsStore()

  async function databaseExists(databaseName: string): Promise<boolean>{
    return new Promise(resolve => {
      const request = window.indexedDB.open(databaseName);
      request.onupgradeneeded = () => {
          request.transaction?.abort();
      }
      request.onerror = () => {
        // console.log(`Database ${databaseName} does NOT exists`);
        resolve(false)
      }
      request.onsuccess = () => {
        // console.log(`Database ${databaseName} does exists`);
        resolve(true)
      }
    })
  }

  async function getDatabase(databaseName: string, objectStoreName: string): Promise<IDBDatabase> {
    return new Promise((resolve, reject) => {
      let request = window.indexedDB.open(databaseName, CURRENT_DB_VERSION);
      request.onerror = (e) => {
        console.log("Error opening db", e);
        reject('Error')
      }

      request.onsuccess = () => {
        resolve(request.result)
      }

      request.onupgradeneeded = () => {
        // console.log("onupgradeneeded");
        let db = request.result;
        const objectStore = db.createObjectStore(objectStoreName, { keyPath: "idx" })
        objectStore.createIndex("element", "element")
      }
    });
  }

  async function clearDatabase(databaseName: string, objectStoreName: string): Promise<void> {
    let db = await getDatabase(databaseName, objectStoreName);
    return new Promise(resolve => {
      let transaction = db.transaction([objectStoreName], 'readwrite');
      transaction.oncomplete = () => {
        resolve();
      }

      let objectStore = transaction.objectStore(objectStoreName);
      objectStore.clear()
    })
  }

  async function getElements(databaseName: string, objectStoreName: string): Promise<any[]> {
    const db = await getDatabase(databaseName, objectStoreName);
    return new Promise(resolve => {
      const transaction = db.transaction([objectStoreName], 'readonly');
      transaction.oncomplete = () => {
        resolve(elements)
      }

      let elements: any[] = [];
      const objectStore = transaction.objectStore(objectStoreName);

      const request = objectStore.getAll();
      request.onsuccess = () => {
        elements = request.result.map(e => e.element)
      }

    })
  }

  async function saveElements(elements: any[], databaseName: string, objectStoreName: string, clearBefore: boolean = true): Promise<void> {
    const db = await getDatabase(databaseName, objectStoreName);
    if (clearBefore) {
      await clearDatabase(databaseName, objectStoreName)
    }
    return new Promise(resolve => {
      const transaction = db.transaction([objectStoreName], 'readwrite');
      transaction.oncomplete = () => {
        resolve()
      }
      const objectStore = transaction.objectStore(objectStoreName);
      for (let index = 0; index < elements.length; index++) {
        objectStore.put({ idx: index, element: toRaw(elements[index])})
      }
    })
  }


  function saveCards(): void {
    const cards: iCard[] = cStore.cards.map(e => toValue(e))
    saveElements(cards, LAYOUT_DB, LAYOUT_OBJECT_STORE)
  }

  function saveSettings() {
    const settings: iSettings = sStore.settings
    saveElements([settings], SETTINGS_DB, SETTINGS_OBJECT_STORE)
  }

  function getCards(): Promise<iCard[]> {
    return getElements(LAYOUT_DB, LAYOUT_OBJECT_STORE)
  }

  async function getSettings(): Promise<iSettings[]> {
    return getElements(SETTINGS_DB, SETTINGS_OBJECT_STORE)
  }

  async function cardDbExists(): Promise<boolean> {
    return await databaseExists(LAYOUT_DB)
  }

  async function settingsDbExists(): Promise<boolean> {
    return databaseExists(SETTINGS_DB)
  }


  async function deleteDatabase(databaseName: string): Promise<void> {
    return new Promise(resolve => {
      const request = indexedDB.deleteDatabase(databaseName)
      request.onsuccess = () => {
        // console.log(`Database ${databaseName} deleted successfully`);
        resolve()
      }
    })
  }

  async function deleteCardsDatabase(): Promise<void> {
    return deleteDatabase(LAYOUT_DB)
  }

  async function deleteSettingsDatabase(): Promise<void> {
    return deleteDatabase(SETTINGS_DB)
  }

  return {
    saveCards, saveSettings, 
    getCards, getSettings,
    cardDbExists, settingsDbExists,
    deleteCardsDatabase, deleteSettingsDatabase,
  }
})