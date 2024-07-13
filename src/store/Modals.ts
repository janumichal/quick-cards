import { defineStore } from 'pinia'
import { ref, Ref } from "vue"

export const useModalsStore = defineStore("modals", () => {
  const isCardEditEnabled: Ref<boolean> = ref(false)
  const isSettingsPanelOpen: Ref<boolean> = ref(false)
  const isSnackbarDeletedCardEnabled: Ref<boolean> = ref(false)
  const isSnackbarAddedCardEnabled: Ref<boolean> = ref(false)
  const isSnackbarEditedCardEnabled: Ref<boolean> = ref(false)



  return {
    isSettingsPanelOpen, isCardEditEnabled, 
    isSnackbarDeletedCardEnabled, isSnackbarAddedCardEnabled, isSnackbarEditedCardEnabled
  }
})