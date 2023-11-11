<template>
    <div class="option" :class='props.sub ? "sub" : "" '>
        <div class="text">
            <slot name="label">
                Label
            </slot>
        </div>
        <slot name="input">
            Placeholder
        </slot>
    </div>
</template>


<script setup lang="ts">
const props = defineProps({
    sub: {
        type: Boolean,
        default: false
    }
})

</script>


<style lang="scss">
.option{
    display: flex;
    flex-flow: row;
    justify-content: space-between;
    align-items: center;
}
.sub{
    border-left: 3px #0000008a solid;
    padding-left: 15px;
}
</style>