import { defineStore } from 'pinia'
import { ref, Ref } from "vue"


export const useGeneralStore = defineStore("general", () => {
    const isEditWindowVisible: Ref<boolean> = ref(false)
    const isSettingsWindowVisible: Ref<boolean> = ref(false)
    const isSettingsButtonVisibile: Ref<boolean> = ref(!isSettingsWindowVisible.value)


    function toggleSettingsBVisibility():void{
        isSettingsButtonVisibile.value = !isSettingsButtonVisibile.value
    }

    function toggleSettingsWVisibility():void{
        isSettingsWindowVisible.value = !isSettingsWindowVisible.value
	}

    function toggleEditWVisibility(): void{
        isEditWindowVisible.value = !isEditWindowVisible.value
    }

    function init(): void{
        isEditWindowVisible.value = false
        isSettingsWindowVisible.value = false
        isSettingsButtonVisibile.value = !isSettingsWindowVisible.value
    }

    return {
        toggleSettingsBVisibility, toggleSettingsWVisibility, toggleEditWVisibility, init,
        isSettingsButtonVisibile, isSettingsWindowVisible
    }
})