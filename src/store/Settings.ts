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
      cardEditEnabled: true,
      cardAspectRatioWidth: 16,
      cardAspectRatioHeight: 9,
      cardSize: 200,
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
          settings.value.isDragAndDropEnabled = new_settings.isDragAndDropEnabled
          settings.value.isAddCardButtonEnabled = new_settings.isAddCardButtonEnabled
          settings.value.cardNameEnabled = new_settings.cardNameEnabled
          settings.value.cardEditEnabled = new_settings.cardEditEnabled
          settings.value.cardAspectRatioWidth = new_settings.cardAspectRatioWidth
          settings.value.cardAspectRatioHeight = new_settings.cardAspectRatioHeight
          settings.value.cardSize = new_settings.cardSize
          dStore.saveCards()
          dStore.saveSettings()
        }
      }
    }
  })

  function exportSettings() {
    const settingsObject: iExport = {
      cards: toRaw(cStore.cards).map(e => toValue(e)),
      ...(toRaw(settings.value))
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

  function restoreDefaultAspectRatio() {
    settings.value.cardAspectRatioHeight = defaultSettings.cardAspectRatioHeight;
    settings.value.cardAspectRatioWidth = defaultSettings.cardAspectRatioWidth;
  }

  function restoreDefaultCardSize() {
    settings.value.cardSize = defaultSettings.cardSize
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
    restoreDefaultColor, restoreDefaultAspectRatio, restoreDefaultCardSize
  }
})