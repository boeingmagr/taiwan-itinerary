<script setup lang="ts">
import { useRoute } from 'vue-router'

const route = useRoute()
</script>

<template>
  <section class="view">
    <h2>Day</h2>
    <p class="tw-num">trip: {{ route.params.id }} · day: {{ route.params.dayId }}</p>
  </section>
</template>

<style scoped>
.view {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}
</style>
