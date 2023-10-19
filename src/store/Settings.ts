import { defineStore } from 'pinia'
import { ref } from "vue"
import type { Ref } from "vue"


export const useSettingsStore = defineStore("settings", () => {
    const editWindowVisible: Ref<boolean> = ref(false)
    const settingsWindowVisible: Ref<boolean> = ref(false)
    const settingsButtonVisibile: Ref<boolean> = ref(!settingsWindowVisible.value)
    const addCardButtonVisible: Ref<boolean> = ref(true)

    function toggleSettingsBVisibility():void{
        settingsButtonVisibile.value = !settingsButtonVisibile.value
    }

    function isSettingsBVisible():boolean{
        return settingsButtonVisibile.value
    }

    function toggleSettingsWVisibility():void{
        settingsWindowVisible.value = !settingsWindowVisible.value
	}

    function isSettingsWVisibile(): boolean{
        return settingsWindowVisible.value
    }

    function toggleEditWVisibility(): void{
        editWindowVisible.value = !editWindowVisible.value
    }

    function isEditWVisibile(): boolean{
        return editWindowVisible.value
    }

    return {
        addCardButtonVisible,
        toggleEditWVisibility, isEditWVisibile, toggleSettingsWVisibility, isSettingsWVisibile, toggleSettingsBVisibility, isSettingsBVisible
    }
})