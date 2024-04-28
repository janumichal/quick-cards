import { defineStore } from 'pinia'
import { ref, watch, toValue, toRaw, Ref } from "vue"
import { saveAs } from 'file-saver'
import { useFileDialog } from '@vueuse/core'
import { useDatabaseStore } from './Database'
import { useCardsStore } from './Cards'
import { iExport } from '../Interfaces/ExportInterface'
import { iSettings } from '../Interfaces/SettingsInterface'

export const useSettingsStore = defineStore("settings", () => {

  const settings: Ref<iSettings> = ref({
    isAddCardButtonEnabled: true,
    isLimitColumnsEnabled: false,
    columnCount: 6,
    isDragAndDropEnabled: true,
    isBackgroundImageEnabled: false,
    backgroundColor: "#464352",
    backgroundImage: null,
  })



  const { open, onChange } = useFileDialog({
    accept: "application/json",
    multiple: false
  })

  const dStore = useDatabaseStore()
  const cStore = useCardsStore()

  function importSettings() {
    open()
  }

  onChange((files: FileList | null) => {
    if (files != null) {
      const reader: FileReader = new FileReader()
      reader.readAsText(files[0])
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          const new_settings: iExport = JSON.parse(reader.result)
          cStore.cards = new_settings.cards.map(e => ref(e))
          settings.value.backgroundColor = new_settings.backgroundColor
          settings.value.backgroundImage = new_settings.backgroundImage
          settings.value.isBackgroundImageEnabled = new_settings.isBackgroundImageEnabled
          settings.value.columnCount = new_settings.columnCount
          settings.value.isLimitColumnsEnabled = new_settings.isLimitColumnsEnabled
          settings.value.isAddCardButtonEnabled = new_settings.isAddCardButtonEnabled
          dStore.saveCards()
          dStore.saveSettings()
        }
      }
    }
  })

  function exportSettings() {
    const settingsObject: iExport = {
      cards: structuredClone(toRaw(cStore.cards)).map(e => toValue(e)),
      ...(Object.fromEntries(Object.entries(settings).map((k, v) => [k, toValue(v)])))
    }
    saveAs(new File([JSON.stringify(settingsObject)], "quick-cards-export.json", {
      type: "application/json"
    }))
  }

  function convertFileToString(file: File): Promise<string> {
    const reader: FileReader = new FileReader()
    return new Promise((resolve) => {
      reader.readAsDataURL(file)
      reader.onloadend = () => {
        if (typeof reader.result === "string") {
          resolve(reader.result)
        }
      }
    })
  }

  async function init(): Promise<void> {
    if (!await dStore.settingsDbExists()) {
      dStore.saveSettings()
    } else {
      dStore.getSettings().then(new_settings => {
        settings.value = new_settings[0]
      })
    }
    setBackgroundColor(settings.value.backgroundColor)
    if (settings.value.isBackgroundImageEnabled) {
      setBackgroundImage(settings.value.backgroundImage)
    }
  }

  function setBackgroundImage(file: string | null): void {
    settings.value.backgroundImage = file
    const body: HTMLElement = document.body
    body.style.backgroundImage = `url(${file == null ? "none" : file})`
  }

  function setBackgroundColor(color: string): void {
    settings.value.backgroundColor = color
    const body: HTMLElement = document.body
    body.style.backgroundColor = color
  }

  watch(
    () => settings.value,
    () => {
      dStore.saveSettings()
    },
    { deep: true }
  )

  watch(
    () => settings.value.backgroundColor,
    () => {
      setBackgroundColor(settings.value.backgroundColor)
    }
  )

  watch(
    () => [settings.value.isBackgroundImageEnabled],
    () => {
      if (settings.value.isBackgroundImageEnabled) {
        setBackgroundImage(settings.value.backgroundImage)
      } else {
        setBackgroundImage(null)
      }
    }
  )

  return {
    settings,
    init, 
    convertFileToString, exportSettings, importSettings,
    setBackgroundImage, setBackgroundColor
  }
})