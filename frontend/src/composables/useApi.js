import axios from 'axios'
import { ref } from 'vue'

const api = axios.create({ baseURL: import.meta.env.VITE_API_BASE || 'http://localhost:3000/api' })

export function useApi() {
    const loading = ref(false)
    const error = ref(null)

    const request = async (fn) => {
        loading.value = true
        error.value = null
        try {
            const res = await fn()
            return res
        } catch (e) {
            error.value = e.response?.data || e.message
            throw e
        } finally {
            loading.value = false
        }
    }

    return { api, loading, error, request }
}