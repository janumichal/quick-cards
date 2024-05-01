import { defineStore } from 'pinia'
import { ref, Ref } from "vue"

export const useModalsStore = defineStore("modals", () => {
  const isCardEditEnabled: Ref<boolean> = ref(false)
  const isSettingsWindowEnabled: Ref<boolean> = ref(false)
  const isSettingsButtonEnabled: Ref<boolean> = ref(!isSettingsWindowEnabled.value)

  return {
    isSettingsButtonEnabled, isSettingsWindowEnabled, isCardEditEnabled
  }
})