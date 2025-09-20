<template>
    <div @click="goToDetails"
        class="bg-white shadow-md rounded-lg overflow-hidden cursor-pointer transform transition hover:shadow-xl">
        <!-- Image -->
        <div v-if="hero.image_path" class="h-[80%] w-full overflow-hidden">
            <img :src="imageUrl(hero.image_path)" class="w-full h-full object-cover" />
        </div>

        <!-- Info -->
        <div class="p-4">
            <h3 class="font-semibold text-lg text-gray-800 truncate">{{ hero.nickname }}</h3>
            <p class="text-sm text-gray-500 truncate">{{ hero.real_name }}</p>
        </div>
    </div>
</template>

<script setup>
import { useRouter } from 'vue-router'
import { imageUrl } from '../utils/imageUrl'

const props = defineProps({ hero: Object })
const router = useRouter()

const goToDetails = () => {
    router.push(`/superheroes/${props.hero.id}`)
}
</script>
