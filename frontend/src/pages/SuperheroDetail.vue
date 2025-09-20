<template>
    <div class="p-6 max-w-4xl mx-auto">
        <!-- Navigation Buttons -->
        <div class="flex justify-between items-center mb-6">
            <Button @click="$router.push({ name: 'Home' })" variant="default">Back</Button>

            <Button type="button" variant="primary"
                @click="$router.push({ name: 'Edit', params: { id: store.current.id } })">
                Edit
            </Button>
        </div>

        <div v-if="store.current" class="bg-white shadow rounded p-6">
            <!-- Hero Info -->
            <h1 class="text-3xl font-bold mb-2">{{ store.current.nickname }}</h1>
            <p class="text-gray-700 mb-1"><span class="font-semibold">Real name:</span> {{ store.current.real_name }}
            </p>
            <p class="mt-2">{{ store.current.origin_description }}</p>
            <p class="mt-2 italic text-gray-600">"{{ store.current.catch_phrase }}"</p>

            <!-- Images Gallery -->
            <div class="mt-6 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                <div v-for="img in store.current.images" :key="img.id" class="overflow-hidden rounded-lg shadow-sm">
                    <img :src="imageUrl(img.path)" class="w-full h-[100%] object-cover" />
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

import Button from '../components/ui/Button.vue'

const route = useRoute()
const store = useSuperheroStore()

onMounted(() => store.fetchById(route.params.id))
</script>
