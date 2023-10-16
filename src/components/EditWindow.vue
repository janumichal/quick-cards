<template>
    <div>
        <ModalWindow @toggle-modal="stStore.toggleEditWVisibility()" :visible="stStore.isEditWVisibile()" :key="reloadModal">
            <template v-slot:header>
                <div class="title">
                    {{ !card.url.length ? "Create" : "Edit" }} Shortcut
                </div>
            </template>
            <template v-slot:content>
                Name: 
                <input type="text" :value="card.name">
                <br />
                URL: 
                <input type="url" :value="card.url">
            </template>
        </ModalWindow>
    </div>
</template>


<script setup lang="ts">
    import ModalWindow from "../components/default/ModalWindow.vue"
    import { ref, watch } from "vue";
    import type { Ref } from "vue"
    import { useSettingsStore } from "../store/Settings";
    import { useShortcutsStore } from "../store/Shortcuts"
    import { Shortcut } from "../Interfaces/ShortcutInterface";

    const stStore = useSettingsStore()
    const scStore = useShortcutsStore()

    const card: Ref<Shortcut> = ref(scStore.getEditedContents(scStore.getEditedIdx()))
    
    const reloadModal: Ref<number> = ref(0)

    watch(
    () => stStore.isEditWVisibile(),
        () =>{
                card.value = scStore.getEditedContents(scStore.getEditedIdx())
                reloadModal.value++
        }
    )

</script>


<style lang="scss">
    .title{
        align-self: center;
    }
</style>