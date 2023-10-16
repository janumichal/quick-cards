<template>
    <div class="toggle-wrapper">
        <input class="toggle" :id="id" type="checkbox" @change="toggle" v-model="isToggled"/>
        <label class="toggle-button" :for="id"></label>
    </div>
</template>

<script setup lang="ts">
    import { ref } from 'vue';
    const props = defineProps({
        modelValue: {
            required: true,
            type: Boolean,
        },
        id: {
            type: String,
            default: ""
        }
    })
    const isToggled = ref(props.modelValue)
    const emits = defineEmits(["update:modelValue"])

    /**
     * On being toggled emits event to the parent
     */
    function toggle(){
        emits("update:modelValue", isToggled.value)
    }

</script>

<style lang="scss" scoped>
    .toggle-wrapper{
        .toggle{
            display: none;
            &:checked + .toggle-button{
                border: 3px solid #7FC6A6;
                &:after {
                    left: 50%;
                    background: #7FC6A6;
                }
            }
        }
        .toggle-button{
            padding: 2px;
            transition: all .2s ease;
            background: transparent;
            border: 3px solid #f2f2f2;
            border-radius: 10px;
            outline: 0;
            display: block;
            width: 36px;
            height: 13px;
            position: relative;
            cursor: pointer;
            user-select: none;
            &:after, &:before{
                position: relative;
                display: block;
                content: "";
                width: 50%;
                height: 100%;
            }
            &:after{
                left: 0;
                transition: all .2s ease;
                background: #f2f2f2;
                content: "";
                border-radius: 10px;
            }
            &:before {
			    display: none;
            }
            &::selection {
                background: none;
            }
        }
    }
</style>