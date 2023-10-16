import { defineStore } from 'pinia'
import { ref } from "vue"
import type { Ref } from "vue"


export const useSettingsStore = defineStore("settings", () => {
    const editWindowVisible: Ref<boolean> = ref(false)

    function toggleEditWVisibility(): void{
        editWindowVisible.value = !editWindowVisible.value
    }

    function isEditWVisibile(): boolean{
        return editWindowVisible.value
    }

    return {
        toggleEditWVisibility, isEditWVisibile
    }
})