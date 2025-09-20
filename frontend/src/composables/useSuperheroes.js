import { ref } from 'vue'
import { useApi } from './useApi'


export function useSuperheroes() {
    const { api, loading, error, request } = useApi()
    const list = ref([])
    const pagination = ref({ page: 1, limit: 5, totalCount: 0, totalPages: 0 })
    const current = ref(null)


    const fetchList = async (page = 1, limit = 5) =>
        request(async () => {
            const res = await api.get(`/superheroes?page=${page}&limit=${limit}`)
            list.value = res.data.data
            pagination.value = res.data.pagination
            return res
        })


    const fetchById = async (id) =>
        request(async () => {
            const res = await api.get(`/superheroes/${id}`)
            current.value = res.data
            return res
        })


    const create = async (payload, files = []) =>
        request(async () => {
            const form = new FormData()
            Object.keys(payload).forEach(k => form.append(k, payload[k]))
            files.forEach(f => form.append('images', f))
            return await api.post('/superheroes', form, { headers: { 'Content-Type': 'multipart/form-data' } })
        })


    const update = async (id, payload, files = []) =>
        request(async () => {
            const form = new FormData()
            Object.keys(payload).forEach(k => form.append(k, payload[k]))
            files.forEach(f => form.append('images', f))
            return await api.put(`/superheroes/${id}`, form, { headers: { 'Content-Type': 'multipart/form-data' } })
        })


    const remove = async (id) =>
        request(async () => await api.delete(`/superheroes/${id}`))


    const deleteImage = async (id, imageId) =>
        request(async () => await api.delete(`/superheroes/${id}/images/${imageId}`))


    return { list, pagination, current, loading, error, fetchList, fetchById, create, update, remove, deleteImage }
}