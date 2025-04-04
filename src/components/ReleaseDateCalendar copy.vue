<script setup lang="ts">
import type { SpotifyShow } from '@/api/spotify_interface';
import { ref, computed, onMounted } from 'vue'

const props = defineProps<{
  selectedPodcasts: Record<string, SpotifyShow>,
  colours: string[],
}>()
const calendarView = ref<'week' | 'month'>('month')
const focusedDate = ref<Date>(new Date()) 

// convert releaseDates + colours into VCalendar attributes
const attrs = computed(() => {
  if (Object.keys(props.selectedPodcasts).length === 0) return []

  return Object.entries(props.selectedPodcasts).flatMap(([_, podcast], podcastIndex) => {
    const color = props.colours[podcastIndex]

    return podcast.latest_episodes?.map((episode, episodeIndex) => ({
      key: `release-${podcastIndex}-${episodeIndex}`,
      dates: episode.release_date,
      highlight: {
        style: {
          backgroundColor: color,
        }
      },
      popover: {
        label: `${podcast?.name}: ${episode.name}`,
        // visibility: `if focusedDate == episode.releaseDate then show else show on hover`
        hideIndicator: true,
      },
    }))

  })
})

function moveFocus(days: number): void {
  const date = new Date(focusedDate.value)
  date.setDate(date.getDate() + days)
  focusedDate.value = date
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft') {
      e.preventDefault()
      moveFocus(-1)
      console.log('arrow lefting', focusedDate.value.toISOString().split('T')[0])
    } else if (e.key === 'ArrowRight') {
      e.preventDefault()
      moveFocus(1)
      console.log('arrow righting', focusedDate.value.toISOString().split('T')[0])
    }
  })
})
</script>

<template>
  <div class="mb-10" style="max-width: 800px; margin: auto;">
    <v-calendar
      :attributes="attrs"
      title-position="center"
      expanded
      :view-mode="calendarView"
    />
    </div>
    <div class="d-flex justify-center mt-4">
    <v-btn-toggle
      v-model="calendarView"
      class="mt-4"
      divided
      mandatory
    >
      <v-btn style="background-color: var(--vt-c-accent-dark-1);" value="weekly">Week View</v-btn>
      <v-btn style="background-color: var(--vt-c-accent-dark-1);" value="monthly">Month View</v-btn>
    </v-btn-toggle>
  </div>
</template>

<style scoped>
.calendar-scale {
  transform: scale(1.2);
  transform-origin: top center;
}
</style>
