<template>
    <Transition name="modal" appear>
        <div class="modal-wrapper" v-if="isOpen" @click.self='closeOnClickOutside ? onClose(): ""'>
            <div class="modal-inner">
                <div class="modal-header">
                    <Button :button-class="'round'" @click="onClose()" />
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
import Button from './Button.vue';

defineProps({
  isOpen: Boolean,
  closeOnClickOutside: {
    type: Boolean,
    default: true,
    required: false
  }
})
const emit = defineEmits(['modal-close'])

function onClose() {
  emit('modal-close');
}

</script>

<style lang="scss" scoped>
@use "../../scss" as *;

.modal-wrapper {
    z-index: 9999;
    position: fixed;
    display: flex;
    justify-content: center;
    align-items: center;
    top: 0;
    left: 0;
    height: 100%;
    width: 100%;
    background-color: rgba(0, 0, 0, 0.5);

    .modal-inner {
        width: fit-content;
        height: fit-content;
        max-width: 100%;
        min-width: min-content;
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

        .modal-header {
            font-size: 20px;
            font-variation-settings: "wght" 600;
            display: flex;
            flex-direction: row-reverse;
            justify-content: space-between;
            box-sizing: border-box;
        }

        .modal-content {
            box-sizing: border-box;
        }
    }
}

$animation-duration: .2s;

.modal-enter-active {
    animation-name: appear_modal;
    animation-duration: $animation-duration;
    animation-fill-mode: forwards;
    animation-timing-function: ease-out;
    animation-direction: normal;
}

.modal-leave-active {
    animation-name: appear_modal;
    animation-duration: $animation-duration;
    animation-fill-mode: forwards;
    animation-timing-function: ease-out;
    animation-direction: reverse;
}

@keyframes appear_modal {
    0% {
        opacity: 0%;
        transform: scale(1.1);
    }

    100% {
        opacity: 100%;
        transform: scale(1);
    }
}
</style>