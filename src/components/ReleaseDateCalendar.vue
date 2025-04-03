<script setup lang="ts">
import type { SpotifyShow } from '@/api/spotify_interface';
import { ref, computed } from 'vue'

const props = defineProps<{
  selectedPodcasts: Record<string, SpotifyShow>,
  colours: string[],
}>()

// convert releaseDates + colours into VCalendar attributes
const attrs = computed(() => {
  if (Object.keys(props.selectedPodcasts).length === 0) return []

  return Object.entries(props.selectedPodcasts).map(([_, podcast], index) => ({
    key: `release-${index}`,
    dates: podcast?.latest_episode?.release_date,
    highlight: {
      style: {
        backgroundColor: props.colours[index],
      }
    },
    popover: {
      label: `${podcast?.name}: ${podcast?.latest_episode?.name}`,
      color: props.colours[index]
    },
  }))
})
</script>

<template>
  <div class="calendar-scale mb-10" style="max-width: 800px; margin: auto;">
    <VCalendar
      :attributes="attrs"
      title-position="center"
      expanded
    />
  </div>
</template>

<style scoped>
.calendar-scale {
  transform: scale(1.2);
  transform-origin: top center;
}
</style>
