<template>
    <div class="bg-white shadow rounded p-4 flex items-center space-x-4">
        <img v-if="hero.image_path" :src="imageUrl(hero.image_path)" class="w-20 h-20 object-cover rounded" />
        <div class="flex-1">
            <h3 class="font-semibold">{{ hero.nickname }}</h3>
            <p class="text-sm text-gray-500">{{ hero.real_name }}</p>
        </div>
        <div class="flex flex-col space-y-2">
            <router-link :to="`/superheroes/${hero.id}`" class="text-sm">Details</router-link>
            <router-link :to="`/edit/${hero.id}`" class="text-sm">Edit</router-link>
        </div>
    </div>
</template>


<script setup>
import { computed } from 'vue'

const props = defineProps({ hero: Object })
const imageUrl = (path) => path.startsWith('http') ? path : `${import.meta.env.VITE_API_BASE?.replace('/api', '') || 'http://localhost:3000'}${path.startsWith('/') ? path : '/' + path}`
</script>