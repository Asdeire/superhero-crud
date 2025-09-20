<template>
  <div class="min-h-screen bg-gray-100">
    <header class="bg-white shadow p-4 flex justify-between">
      <h1 class="text-xl font-bold">Superhero CRUD</h1>
      <nav class="space-x-4">
        <router-link to="/" class="hover:underline">Home</router-link>
        <router-link to="/create" class="hover:underline">Create</router-link>
      </nav>
    </header>

    <main class="p-6">
      <router-view />
    </main>
  </div>
</template>

<script setup>
</script>

<style>
/* можна залишити пустим або додати глобальні стилі */
</style>
