import { defineStore } from 'pinia'
import { ref, Ref } from "vue"


export const useGeneralStore = defineStore("general", () => {
    const isCardEditOpen: Ref<boolean> = ref(false)
    const isNewCard: Ref<boolean> = ref(false)
    const isSettingsWindowVisible: Ref<boolean> = ref(false)
    const isSettingsButtonVisibile: Ref<boolean> = ref(!isSettingsWindowVisible.value)

    function toggleSettingsBVisibility():void{
        isSettingsButtonVisibile.value = !isSettingsButtonVisibile.value
    }

    function toggleSettingsWVisibility():void{
        isSettingsWindowVisible.value = !isSettingsWindowVisible.value
	}

    return {
      isNewCard,
      toggleSettingsBVisibility, toggleSettingsWVisibility,
      isSettingsButtonVisibile, isSettingsWindowVisible, isCardEditOpen
    }
})