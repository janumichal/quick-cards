import { defineStore } from 'pinia'
import { ref } from "vue"
import type { Ref } from "vue"


export const useSettingsStore = defineStore("settings", () => {
    const isEditWindowVisible: Ref<boolean> = ref(false)
    const isSettingsWindowVisible: Ref<boolean> = ref(false)
    const isSettingsButtonVisibile: Ref<boolean> = ref(!isSettingsWindowVisible.value)
    const isAddCardButtonVisible: Ref<boolean> = ref(true)

    function toggleSettingsBVisibility():void{
        isSettingsButtonVisibile.value = !isSettingsButtonVisibile.value
    }

    function toggleSettingsWVisibility():void{
        isSettingsWindowVisible.value = !isSettingsWindowVisible.value
	}

    function toggleEditWVisibility(): void{
        isEditWindowVisible.value = !isEditWindowVisible.value
    }

    function init():void{
        isEditWindowVisible.value = false
        isSettingsWindowVisible.value = false
        isSettingsButtonVisibile.value = !isSettingsWindowVisible.value
        isAddCardButtonVisible.value = true
    }

    return {
        isAddCardButtonVisible, isSettingsWindowVisible, isEditWindowVisible, isSettingsButtonVisibile,
        toggleEditWVisibility, toggleSettingsWVisibility, toggleSettingsBVisibility, init
    }
})