<template>
    <div class="relative border rounded overflow-hidden">
        <img :src="src" class="w-full h-52 object-fit" />
        <button v-if="onRemove" type="button" @click="onRemove(id)"
            class="absolute top-1 right-1 bg-red-600 text-white px-2 py-1 text-xs rounded">
            {{ buttonText }}
        </button>
        <div v-if="fileName" class="text-xs p-1 truncate bg-white/80">{{ fileName }}</div>
    </div>
</template>

<script setup>
defineProps({
    src: String,
    id: [String, Number],
    fileName: String,
    buttonText: { type: String, default: 'Delete' },
    onRemove: Function
})
</script>
