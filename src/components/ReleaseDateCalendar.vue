<script setup lang="ts">
import type { SpotifyShow } from '@/api/spotify_interface'
import { ref, computed, onMounted, onBeforeUnmount } from 'vue'
import { VCalendar } from 'vuetify/labs/VCalendar'

const props = defineProps<{
  selectedPodcasts: Record<string, SpotifyShow>,
  colours: string[],
}>()

const viewMode = ref<'month' | 'week'>('month')
const displayValue = ref<string>(new Date().toISOString().slice(0, 10))

// Generate calendar events from podcast episodes
const events = computed(() => {
  const allEvents: any[] = []

  Object.entries(props.selectedPodcasts).forEach(([_, podcast], i) => {
    const color = props.colours[i]
    const episodes = podcast.latest_episodes || []

    episodes.forEach((ep) => {
      allEvents.push({
        title: `${podcast.name}: ${ep.name}`,
        start: new Date(ep.release_date),
        end: new Date(ep.release_date),
        color,
        timed: false,
      })
    })
  })

  return allEvents
})

function onEventClick({ event }: { event: any }) {
  console.log('Clicked event:', event)
}

function moveDate(offset: number) {
  const current = new Date(displayValue.value)

  if (viewMode.value === 'month') {
    current.setMonth(current.getMonth() + offset)
  } else if (viewMode.value === 'week') {
    current.setDate(current.getDate() + offset * 7)
  }

  displayValue.value = current.toISOString().slice(0, 10)
}

function handleKeydown(e: KeyboardEvent) {
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    moveDate(-1)
    console.log('value: ', value.value)
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    moveDate(1)
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})

onBeforeUnmount(() => {
  window.removeEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <v-btn-toggle
      v-model="viewMode"
      class="mr-4 my-4"
      divided
      mandatory
    >
      <v-btn style="background-color: var(--vt-c-accent-dark-1);" value="week">Week View</v-btn>
      <v-btn style="background-color: var(--vt-c-accent-dark-1);" value="month">Month View</v-btn>
    </v-btn-toggle>

    <v-calendar
      ref="calendar"
      :display-value="displayValue"
      :events="events"
      :view-mode="viewMode"
      :hide-week-number="true"
      @click:event="onEventClick"
    />
  </div>
</template>
