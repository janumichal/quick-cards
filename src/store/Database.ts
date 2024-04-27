import { defineStore } from 'pinia'
import { iCard } from '../Interfaces/CardInterface';
import { iSettings } from '../Interfaces/SettingsInterface';
import { toRaw } from 'vue';

export const useDatabaseStore = defineStore("database", () => {
  const LAYOUT_DB = "cards_layout";
  const LAYOUT_OBJECT_STORE = "cards"
  const SETTINGS_DB = "cards_settings";
  const SETTINGS_OBJECT_STORE = "settings"

  const CURRENT_DB_VERSION = 1

  async function databaseExists(databaseName: string): Promise<boolean>{
    return new Promise(resolve => {
      const request = window.indexedDB.open(databaseName);
      request.onupgradeneeded = () => {
          request.transaction?.abort();
      }
      request.onerror = () => {
        console.log(`Database ${databaseName} does NOT exists`);
        resolve(false)
      }
      request.onsuccess = () => {
        console.log(`Database ${databaseName} does exists`);
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
        console.log("onupgradeneeded");
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


  function saveCards(cards: iCard[]): void {
    saveElements(cards, LAYOUT_DB, LAYOUT_OBJECT_STORE)
  }

  function saveSettings(settings: iSettings) {
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

  // function initDatabase(): Promise<IDBDatabase> {
  //   return new Promise((resolve) => {
  //     const request = indexedDB.open("card-layout");
  //     request.onupgradeneeded = () => {
  //       const db: IDBDatabase = request.result;
  //       const store = db.createObjectStore("cards", { keyPath: "idx" })
  //       store.createIndex("by_url", "url")
  //       store.createIndex("by_name", "name")
  //       store.createIndex("by_color", "color")
  //       store.createIndex("by_image", "image")
  //     }
  //     request.onsuccess = () => {
  //       resolve(request.result)
  //     }
  //   })
  // }

  // function updateDatabase(cards: Ref<Ref<iCard>[]>): void {
  //   const request = indexedDB.open("card-layout")
  //   request.onsuccess = () => {
  //     const db: IDBDatabase = request.result
  //     const tx = db.transaction("cards", "readwrite")
  //     const store = tx.objectStore("cards")
  //     const request_clr = store.clear()
  //     request_clr.onsuccess = () => {
  //       putCardsToDatabase(cards)
  //     }
  //   }
  // }

  // function putCardsToDatabase(cards: Ref<Ref<iCard>[]>): void {
  //   initDatabase().then(res => {
  //     const db: IDBDatabase = res
  //     const tx = db.transaction("cards", "readwrite")
  //     const store = tx.objectStore("cards")
  //     for (let index = 0; index < cards.value.length; index++) {
  //       const element = cards.value[index]
  //       store.put({
  //         idx: index,
  //         url: element.value.url,
  //         name: element.value.name,
  //         image: element.value.image,
  //         color: element.value.color
  //       })
  //     }
  //     tx.oncomplete = () => {
  //       localStorage.setItem("hasCustom", "true")
  //     }
  //   })
  // }

  // function getCardsFromDatabase(): Promise<iCard[]> {
  //   return new Promise((resolve) => {
  //     const request = indexedDB.open("card-layout");
  //     request.onsuccess = () => {
  //       const tx = request.result.transaction("cards", "readwrite")
  //       const store = tx.objectStore("cards")
  //       const getAllRequest = store.getAll()
  //       getAllRequest.onsuccess = () => {
  //         resolve(getAllRequest.result)
  //       }
  //       getAllRequest.onerror = () => {
  //         resolve([])
  //       }
  //     }
  //   })
  // }

  // function removeDatabases(): void { // TODO remove
  //   const request = indexedDB.deleteDatabase("card-layout");
  //   const request2 = indexedDB.deleteDatabase("card-bg");
  //   request.onsuccess = () => {
  //     console.log("Card database deleted successfully");
  //   }
  //   request2.onsuccess = () => {
  //     console.log("BG database deleted successfully");
  //   }
  //   localStorage.clear()
  // }


  async function deleteDatabase(databaseName: string): Promise<void> {
    return new Promise(resolve => {
      const request = indexedDB.deleteDatabase(databaseName)
      request.onsuccess = () => {
        console.log(`Database ${databaseName} deleted successfully`);
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