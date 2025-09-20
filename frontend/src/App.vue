<template>
  <div class="min-h-screen bg-gray-100">
    <Header />
    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
import Header from './components/Header.vue'
</script>

<style>
/* можна залишити пустим або додати глобальні стилі */
</style>
