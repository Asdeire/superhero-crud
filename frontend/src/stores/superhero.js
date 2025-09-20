import { defineStore } from 'pinia'
import { useSuperheroes } from '../composables/useSuperheroes'


export const useSuperheroStore = defineStore('superhero', () => {
    const { list, pagination, current, loading, error, fetchList, fetchById, create, update, remove, deleteImage } = useSuperheroes()
    return { list, pagination, current, loading, error, fetchList, fetchById, create, update, remove, deleteImage }
})