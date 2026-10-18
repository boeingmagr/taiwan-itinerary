<script setup lang="ts">
import ThemePreview from '@/components/ThemePreview.vue'
</script>

<template>
  <main class="app-shell">
    <header class="app-header">
      <h1>Taiwanna</h1>
      <p>Trip planner for Taiwan — T-2 theme preview.</p>
    </header>

    <ThemePreview />
  </main>
</template>

<style scoped>
.app-header {
  margin-bottom: 1.5rem;
}

.app-header h1 {
  margin: 0;
}

.app-header p {
  margin: 0.25rem 0 0;
  opacity: 0.75;
}
</style>
