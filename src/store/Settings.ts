import { defineStore } from 'pinia'
import { ref, watch, toValue, toRaw, Ref } from "vue"
import { saveAs } from 'file-saver'
import { useFileDialog } from '@vueuse/core'
import { useDatabaseStore } from './Database'
import { useCardsStore } from './Cards'
import { iExport } from '../Interfaces/ExportInterface'
import { iSettings } from '../Interfaces/SettingsInterface'
import { iFile } from '../Interfaces/FileInterface'

export const useSettingsStore = defineStore("settings", () => {

  const defaultSettings = {
      isAddCardButtonEnabled: true,
      isLimitColumnsEnabled: false,
      columnCount: 6,
      isDragAndDropEnabled: true,
      isBackgroundImageEnabled: false,
      backgroundColor: "#464352",
      backgroundImage: null,
      cardNameEnabled: true,
      cardEditEnabled: true
    }

  const settings: Ref<iSettings> = ref(defaultSettings)

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
          settings.value.cardNameEnabled = new_settings.cardNameEnabled
          settings.value.cardEditEnabled = new_settings.cardEditEnabled
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

  function setBackgroundImage(file: iFile | null): void {
    if(settings.value.isBackgroundImageEnabled){
      settings.value.backgroundImage = file
    }
    const body: HTMLElement = document.body
    body.style.backgroundImage = `url(${file == null ? "none" : file.data})`
  }

  function setBackgroundColor(color: string): void {
    settings.value.backgroundColor = color
    const body: HTMLElement = document.body
    body.style.backgroundColor = color
  }

  function restoreDefaultColor(){
    settings.value.backgroundColor = defaultSettings.backgroundColor;
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
    () => settings.value.isBackgroundImageEnabled,
    () => {
      if (settings.value.isBackgroundImageEnabled) {
        setBackgroundImage(settings.value.backgroundImage)
      } else {
        setBackgroundImage(null)
      }
    }
  )

  return {
    settings, defaultSettings,
    init, 
    exportSettings, importSettings,
    setBackgroundImage, setBackgroundColor,
    restoreDefaultColor
  }
})