<template>
    <Transition name="modal" appear>
        <div class="modal-wrapper" v-if="modalVisisble" @click.self="onClickClose()">
            <div class="modal-inner">
                <div class="modal-header">
                    <RoundButton @click="onClickClose()"/>
                    <slot name="header">
                        Default Header
                    </slot>
                </div>
                <div class="modal-content">
                    <slot name="content">
                        Default Content
                    </slot>
                </div>
            </div>
        </div>
    </Transition>
</template>

<script setup lang="ts">
    import RoundButton from './RoundButton.vue';
    import { ref, nextTick } from "vue"

    const emit = defineEmits(['toggleModal'])

    const props = defineProps({
        visible: {
            type: Boolean,
            required: true
        }
    })

    const modalVisisble = ref(props.visible)

    /**
     * Toggles the modal window open/close
     */
    function onClickClose(){
        modalVisisble.value = !modalVisisble.value
        nextTick(() => {
            emit("toggleModal", modalVisisble.value)
        })
    }
</script>

<style lang="scss" scoped>
    @use "../../scss/Colors/Colors" as *;

    .modal-wrapper{
        z-index: 9999;
        position: fixed;
        display: flex;
        justify-content: center;
        align-items: center;
        top: 0;
        left: 0;
        height: 100%;
        width: 100%;
        backdrop-filter: blur(4px);

        .modal-inner{
            width: fit-content;
            height: fit-content;
            background-color: $primary-bg;
            display: flex;
            flex-direction: column;
            padding: 15px;
            border-radius: 6px;
            gap: 10px;
            color: #FFFFFF;
            margin-left: 10px;
            margin-right: 10px;
            box-sizing: border-box;
            .modal-header{
                font-size: 20px;
                font-variation-settings: "wght" 600;
                display: flex;
                flex-direction: row-reverse;
                justify-content: space-between;
                box-sizing: border-box;
            }
            .modal-content{
                box-sizing: border-box;
            }
        }
    }

    $animation-duration: .2s;
    .modal-enter-active{
        animation-name: appear_modal;
        animation-duration: $animation-duration;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
        animation-direction: normal;
    }

    .modal-leave-active{
        animation-name: appear_modal;
        animation-duration: $animation-duration;
        animation-fill-mode: forwards;
        animation-timing-function: ease-out;
        animation-direction: reverse;
    }

    @keyframes appear_modal {
        0%{
            opacity: 0%;
            transform: scale(1.1);
        }
        100%{
            opacity: 100%;
            transform: scale(1);
        }
    }
</style>