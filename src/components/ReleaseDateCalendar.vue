<script setup lang="ts">
import type { CalendarEvent, SpotifyShow } from '@/api/spotify_interface'
import { ref, computed, onMounted } from 'vue'
import { VCalendar } from 'vuetify/labs/VCalendar'

const props = defineProps<{
  selectedPodcasts: Record<string, SpotifyShow>
  colours: string[]
}>()

const viewMode = ref<'month' | 'week'>('month')
const displayValue = ref<string>(new Date().toISOString().slice(0, 10))

// Generate calendar events from podcast episodes
const events = computed(() => {
  const allEvents: CalendarEvent[] = []

  Object.entries(props.selectedPodcasts).forEach(([, /* unused */ podcast], i) => {
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

const moveDate = (offset: number): void => {
  const current = new Date(displayValue.value)
  if (viewMode.value === 'month') {
    current.setMonth(current.getMonth() + offset)
  } else if (viewMode.value === 'week') {
    current.setDate(current.getDate() + offset * 7)
  }
  displayValue.value = current.toISOString().slice(0, 10)
}

const handleKeydown = (e: KeyboardEvent): void => {
  const target = e.target as HTMLElement
  const isTyping = ['INPUT', 'TEXTAREA'].includes(target.tagName) || target.getAttribute('contenteditable') === 'true'

  if (isTyping) return
  if (e.key === 'ArrowLeft') {
    e.preventDefault()
    moveDate(-1)
    console.log('left')
  } else if (e.key === 'ArrowRight') {
    e.preventDefault()
    moveDate(1)
    console.log('right')
  } else if (e.key === 'w') {
    e.preventDefault()
    viewMode.value = 'week'
  } else if (e.key === 'm') {
    e.preventDefault()
    viewMode.value = 'month'
  }
}

onMounted(() => {
  window.addEventListener('keydown', handleKeydown)
})
</script>

<template>
  <div>
    <v-row class="mb-4 d-flex">
      <v-col cols="4" class="d-flex justify-start">
        <v-btn-toggle v-model="viewMode" divided mandatory>
          <v-btn style="background-color: var(--vt-c-accent-dark-1)" value="week"
            >Week View (w)</v-btn
          >
          <v-btn style="background-color: var(--vt-c-accent-dark-1)" value="month"
            >Month View (m)</v-btn
          >
        </v-btn-toggle>
      </v-col>

      <v-col cols="8" class="d-flex justify-end">
        <v-btn color="black" @click="moveDate(-1)">&lt; Previous</v-btn>

        <h2 class="text-xl font-bold mx-4">
          {{ new Date(displayValue).toLocaleDateString('en', { month: 'long', year: 'numeric' }) }}
        </h2>

        <v-btn color="black" @click="moveDate(1)">Next &gt;</v-btn>
      </v-col>
    </v-row>

    <v-calendar
      hide-header
      :display-value="displayValue"
      :events="events"
      :view-mode="viewMode"
      :hide-week-number="true"
    />
  </div>
</template>
