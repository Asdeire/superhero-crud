<template>
    <div class="p-6 max-w-3xl mx-auto">
        <h1 class="text-2xl font-bold mb-4">{{ isEdit ? 'Edit' : 'Create' }} Superhero</h1>

        <form @submit.prevent="onSubmit" class="space-y-6 bg-white p-6 rounded shadow">

            <!-- Main fields -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput v-model="form.nickname" placeholder="Nickname" required />
                <BaseInput v-model="form.real_name" placeholder="Real Name" required />
            </div>

            <BaseInput v-model="form.origin_description" placeholder="Origin Description" type="textarea" />

            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                <BaseInput v-model="form.superpowers" placeholder="Superpowers (comma separated)" />
                <BaseInput v-model="form.catch_phrase" placeholder="Catch Phrase" />
            </div>

            <!-- Existing images -->
            <div v-if="isEdit" class="mt-2">
                <h3 class="font-semibold mb-2">Existing Images</h3>
                <div v-if="existingImages.length === 0" class="text-sm text-gray-500">No images yet</div>
                <div class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <ImageCard v-for="img in existingImages" :key="img.id" :src="imageUrl(img.path)" :id="img.id"
                        buttonText="Delete" :onRemove="deleteExistingImage" />
                </div>
            </div>

            <!-- New files + previews -->
            <div>
                <label class="block mb-2 font-semibold">Add Images</label>
                <input type="file" multiple accept="image/*" @change="onFiles" class="mb-3" />

                <div v-if="newFiles.length > 0" class="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                    <ImageCard v-for="file in newFiles" :key="file.id" :src="file.url" :id="file.id"
                        :fileName="file.file.name" :onRemove="removeNewFile" />
                </div>
            </div>

            <!-- Buttons -->
            <div class="flex gap-3">
                <Button type="submit" variant="primary">
                    {{ isEdit ? 'Save' : 'Create' }}
                </Button>
                <Button type="button" variant="secondary" @click="onCancel">
                    Cancel
                </Button>
            </div>
        </form>
    </div>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useSuperheroStore } from '../stores/superhero'
import { imageUrl } from '../utils/imageUrl'

import BaseInput from '../components/ui/BaseInput.vue'
import Button from '../components/ui/Button.vue'
import ImageCard from '../components/ImageCard.vue'

const route = useRoute()
const router = useRouter()
const store = useSuperheroStore()

const isEdit = !!route.params.id
const id = route.params.id

const form = ref({
    nickname: '',
    real_name: '',
    originDescription: '',
    superpowers: '',
    catchPhrase: ''
})

const existingImages = ref([])
const newFiles = ref([])

const onFiles = e => {
    Array.from(e.target.files || []).forEach(file => {
        const uid = `${Date.now()}-${Math.random().toString(36).slice(2, 8)}`
        const url = URL.createObjectURL(file)
        newFiles.value.push({ id: uid, file, url })
    })
    e.target.value = null
}

const removeNewFile = id => {
    const idx = newFiles.value.findIndex(f => f.id === id)
    if (idx >= 0) {
        URL.revokeObjectURL(newFiles.value[idx].url)
        newFiles.value.splice(idx, 1)
    }
}

const deleteExistingImage = async (imageId) => {
    if (!confirm('Are you sure you want to delete this image?')) return
    try {
        await store.deleteImage(id, imageId)
        await store.fetchById(id)
        existingImages.value = store.current?.images || []
    } catch (err) {
        console.error(err)
        alert('Error deleting image')
    }
}

onMounted(async () => {
    if (isEdit) {
        await store.fetchById(id)
        const data = store.current || {}
        form.value = {
            nickname: data.nickname || '',
            real_name: data.real_name || '',
            origin_description: data.origin_description || '',
            superpowers: data.superpowers || '',
            catch_phrase: data.catch_phrase || ''
        }
        existingImages.value = data.images || []
    }
})

onBeforeUnmount(() => {
    newFiles.value.forEach(f => {
        try { URL.revokeObjectURL(f.url) } catch (e) { }
    })
})

const onSubmit = async () => {
    try {
        const payload = { ...form.value }
        const files = newFiles.value.map(f => f.file)

        if (isEdit) {
            await store.update(id, payload, files)
            newFiles.value.forEach(f => URL.revokeObjectURL(f.url))
            newFiles.value = []
            await store.fetchById(id)
            router.push({ name: 'Detail', params: { id } })
        } else {
            const res = await store.create(payload, files)
            newFiles.value.forEach(f => URL.revokeObjectURL(f.url))
            newFiles.value = []
            const createdId = res?.data?.id
            if (createdId) router.push({ name: 'Detail', params: { id: createdId } })
            else router.push({ name: 'Home' })
        }
    } catch (err) {
        console.error(err)
        alert('Error saving superhero')
    }
}

const onCancel = () => router.back()
</script>

<style scoped>
.input {
    width: 100%;
    padding: 0.5rem;
    border: 1px solid #e5e7eb;
    border-radius: 0.375rem;
}
</style>
