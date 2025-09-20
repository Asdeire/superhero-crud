<template>
    <div class="p-6 max-w-5xl mx-auto">
        <!-- Superheroes Grid -->
        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <SuperheroCard v-for="s in store.list" :key="s.id" :hero="s" />
        </div>

        <!-- Pagination -->
        <div class="mt-8 flex justify-center items-center space-x-3">
            <button @click="changePage(-1)" :disabled="store.pagination.page <= 1"
                class="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition">
                Prev
            </button>
            <span class="text-gray-700 font-medium">{{ store.pagination.page }} / {{ store.pagination.totalPages
            }}</span>
            <button @click="changePage(1)" :disabled="store.pagination.page >= store.pagination.totalPages"
                class="px-4 py-2 border rounded disabled:opacity-50 hover:bg-gray-100 transition">
                Next
            </button>
        </div>
    </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useSuperheroStore } from '../stores/superhero'
import SuperheroCard from '../components/SuperheroCard.vue'

const store = useSuperheroStore()

onMounted(() => store.fetchList(1, 5))

const changePage = (delta) => store.fetchList(store.pagination.page + delta, store.pagination.limit)
</script>
