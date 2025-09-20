<template>
    <button :type="type" :class="buttonClasses" @click="$emit('click', $event)">
        <slot />
    </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
    type: { type: String, default: 'button' }, 
    variant: { type: String, default: 'primary' } 
})

const buttonClasses = computed(() => {
    switch (props.variant) {
        case 'primary':
            return 'px-4 py-2 bg-emerald-600 text-white rounded hover:bg-emerald-500 transition'
        case 'secondary':
            return 'px-4 py-2 border rounded hover:border-emerald-600 hover:text-emerald-600 transition'
        case 'danger':
            return 'px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700 transition'
        default:
            return 'px-4 py-2 bg-gray-200 shadow text-gray-800 rounded hover:bg-gray-300 transition'
    }
})
</script>
