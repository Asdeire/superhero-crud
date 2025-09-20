<template>
    <div class="p-6">
        <div class="flex justify-between items-center mb-4">
            <h1 class="text-2xl font-bold">Superheroes</h1>
            <router-link to="/create" class="btn">Create</router-link>
        </div>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
            <SuperheroCard v-for="s in store.list" :key="s.id" :hero="s" />
        </div>
        <div class="mt-6 flex justify-center items-center space-x-2">
            <button @click="changePage(-1)" :disabled="store.pagination.page <= 1">Prev</button>
            <span>{{ store.pagination.page }} / {{ store.pagination.totalPages }}</span>
            <button @click="changePage(1)"
                :disabled="store.pagination.page >= store.pagination.totalPages">Next</button>
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