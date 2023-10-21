<template>
    <div>
        <ModalWindow @toggle-modal="sStore.toggleEditWVisibility()" :visible="sStore.isEditWindowVisible" :key="reloadModal">
            <template v-slot:header>
                <div class="title">
                    {{ card.idx == -1 ? "Create" : "Edit" }} Shortcut
                </div>
            </template>
            <template v-slot:content>
                <div class="wrapper">
                    <div class="content-wrapper">
                        <div class="text-content-wrapper">
                            <div class="edit-wrapper">
                                <div class="subtitle">
                                    Name 
                                </div>
                                <div class="input-wrapper">
                                    <input type="text" id="cd_name" v-model="card.name">
                                </div>
                            </div>
                            <div class="edit-wrapper">
                                <div class="subtitle">
                                    URL
                                </div>
                                <div class="input-wrapper">
                                    <input type="url" id="cd_url" v-model="card.url">
                                </div>
                            </div>
                        </div>
                        <div class="divider"></div>
                        <div class="card-content-wrapper">
                            <Card :idx="-1" :name="card.name" :url="card.url" class="noninteractable" />
                        </div>
                    </div>
                    <div class="button-wrapper">
                        <NormalButton class="delete-btn" :btn-type="ButtonTypes.Warning" @click="deleteCard()">
                            Delete
                        </NormalButton>
                        <NormalButton class="save-btn" :btn-type="ButtonTypes.Submit" @click="saveCard()">
                            {{ card.idx == -1 ? "Create" : "Save" }}
                        </NormalButton>
                    </div>
                </div>

            </template>
        </ModalWindow>
    </div>
</template>


<script setup lang="ts">
    import ModalWindow from "../components/default/ModalWindow.vue"
    import Card from "./Card.vue";
    import NormalButton from "./default/NormalButton.vue";


    import { ref, watch, Ref } from "vue";
    import { useSettingsStore } from "../store/Settings";
    import { useCardsStore } from "../store/Cards"
    import { iCard } from "../Interfaces/CardInterface";
    import { ButtonTypes } from "../enums"

    const sStore = useSettingsStore()
    const cStore = useCardsStore()
    const reloadModal: Ref<number> = ref(0)

    const card: Ref<iCard> = ref(cStore.getEditedCard())

    function deleteCard(): void {
        cStore.deleteCard(card.value)
        sStore.toggleEditWVisibility()
    }

    function saveCard(): void {
        cStore.updateCard(card.value)
        sStore.toggleEditWVisibility()
    }

    watch(
        () => sStore.isEditWindowVisible,
            () =>{
                card.value = cStore.getEditedCard()
                reloadModal.value++
            }
    )

</script>


<style lang="scss" scoped>
    @media only screen and (max-width: 592px) {
        .divider{
            display: none;
        }
        .wrapper{
            max-width: 300px;
        }
    }
    .title{
        align-self: center;
    }
    .wrapper{
        display: flex;
        flex-flow: column;
        width: fit-content;
        gap: 20px;
        .button-wrapper{
            font-size: 16px;
            font-variation-settings: "wght" 500;
            display: flex;
            justify-content: space-between;
            .save-btn, .delete-btn{
                padding: 10px 20px 10px 20px;
            }

        }

        .content-wrapper{
            display: flex;
            flex-flow: row;
            gap: 20px;
            align-items: center;
            min-width: 100%;
            flex-wrap: wrap;
            min-height: max-content;
            justify-content: center;
    
            .divider{
                height: 200px;
                width: 3px;
                border-radius: 5px;
                background-color: #0000003b;
                box-sizing: border-box;
            }
    
            .text-content-wrapper{
                min-width: 300px;
                display: flex;
                flex-flow: column;
                gap: 10px;
        
                .edit-wrapper{
                    .subtitle{
                        width: 100%;
                        padding-top: 5px;
                        padding-left: 5px;
                        padding-bottom: 2px;
                        box-sizing: border-box;
                        font-size: 18px;
                        display: flex;
                        justify-content: left;
                        border-radius: 5px;
                    }
                    .input-wrapper{
                        width: 100%;
            
                        input{
                            border: none;
                            outline: none;
                            padding: 10px;
                            box-sizing: border-box;
                            width: 100%;
            
            
                            font-size: 16px;
                            color: #c5c5c5;
                            background-color: #00000041;
                            border-radius: 4px;
                        }
                        
                    }
                }
            }
            .card-content-wrapper{
                width: max-content;
                height: 100%;
            }
        }
    }

</style>../store/Cards../Interfaces/CardInterface