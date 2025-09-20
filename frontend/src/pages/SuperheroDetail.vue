<template>
    <div class="p-6">
        <button @click="$router.push({ name: 'Home' })">Back</button>
        <div v-if="store.current" class="mt-4">
            <h1 class="text-2xl font-bold">{{ store.current.nickname }}</h1>
            <p class="text-gray-700">Real name: {{ store.current.real_name }}</p>
            <p class="mt-2">{{ store.current.origin_description }}</p>
            <p class="mt-2 italic">{{ store.current.catch_phrase }}</p>
            <div class="mt-4 grid grid-cols-2 md:grid-cols-4 gap-2">
                <div v-for="img in store.current.images" :key="img.id" class="border p-1">
                    <img :src="imageUrl(img.path)" class="w-full h-36 object-cover" />
                    <button @click="deleteImg(img.id)" class="text-red-600 text-sm">Delete image</button>
                </div>
            </div>
        </div>
    </div>
</template>


<script setup>
import { onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { useSuperheroStore } from '../stores/superhero'
import { imageUrl } from '../utils/imageUrl'

const route = useRoute()
const store = useSuperheroStore()

onMounted(() => store.fetchById(route.params.id))

const deleteImg = async (imageId) => { await store.deleteImage(route.params.id, imageId); await store.fetchById(route.params.id) }
</script>