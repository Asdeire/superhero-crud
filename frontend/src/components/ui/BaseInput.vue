<template>
  <input v-if="type !== 'textarea'" :value="modelValue" :placeholder="placeholder" :required="required" class="input"
    @input="$emit('update:modelValue', $event.target.value)" />
  <textarea v-else :value="modelValue" :placeholder="placeholder" :required="required" class="input h-28"
    @input="$emit('update:modelValue', $event.target.value)" />
</template>

<script setup>
defineProps({
  modelValue: [String, Number],
  type: { type: String, default: 'text' },
  placeholder: String,
  required: Boolean
})
</script>
