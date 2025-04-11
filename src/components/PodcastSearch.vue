<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ReleaseDateCalendar from './ReleaseDateCalendar.vue'
import SearchBar from './SearchBar.vue'
import PodcastList from './PodcastList.vue'
import { getLatestEpisodes, searchPodcasts } from '../api/spotify'
import type { SpotifyShow, SpotifyShowEpisode } from '@/api/spotify_interface'

const podcasts = ref<SpotifyShow[]>([])
const selectedPodcasts = ref<Record<string, SpotifyShow>>({})
const showToast = ref<boolean>(false)
const toastLevel = ref<'error' | 'success'>('error')
const toastMessage = ref<string>('')
// to access the child SearchBar's functions
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const podcastListRef = ref<InstanceType<typeof PodcastList> | null>(null)
const colours: string[] = ['#00796B', '#303F9F', '#CF4C00', '#6A1B9A', '#C62828']

const fetchSpotifyPodcasts = async (query: string): Promise<void> => {
  try {
    podcasts.value = []
    selectedPodcasts.value = {}
    podcasts.value = await searchPodcasts(query)
  } catch (error) {
    console.error('Could not make API request')
    showToast.value = true
    toastLevel.value = 'error'
    if (error instanceof Error) {
      toastMessage.value = error.message
    }
  }
}

const fetchReleaseDates = async (
  updatedSelectedPodcasts: Record<string, SpotifyShow>,
): Promise<void> => {
  try {
    const lenUpdated = Object.keys(updatedSelectedPodcasts).length
    const lenPrev = Object.keys(selectedPodcasts.value).length
    if (lenUpdated < lenPrev) {
      // do nothing (deselected)
      selectedPodcasts.value = updatedSelectedPodcasts
      return
    }

    const newId = Object.keys(updatedSelectedPodcasts).filter(
      (k) => !Object.keys(selectedPodcasts.value).includes(k),
    )[0]

    const result: SpotifyShowEpisode[] = await getLatestEpisodes(newId, 5)
    updatedSelectedPodcasts[newId] = {
      ...updatedSelectedPodcasts[newId],
      latest_episodes: result,
    }
    selectedPodcasts.value = updatedSelectedPodcasts
    showToast.value = true
    toastLevel.value = 'success'
    toastMessage.value = 'View episodes in calendar below!'
  } catch (error) {
    console.error('Could not make API request:', error)
  }
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === '/') {
      e.preventDefault()
      searchBarRef.value?.focusInput()
    } else if (e.key === 'Escape') {
      e.preventDefault()
      searchBarRef.value?.unfocusInput()
    } else if (e.key === 'ArrowUp') {
      e.preventDefault()
      searchBarRef.value?.unfocusInput()
      podcastListRef.value?.scrollHoverUp()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      searchBarRef.value?.unfocusInput()
      podcastListRef.value?.scrollHoverDown()
    }
  })
})
</script>

<template>
  <p class="pa-4">
    Start by searching for podcasts from Spotify. Then, select up to 5 podcasts to view their latest
    release date in the calendar below.
  </p>
  <v-snackbar v-model="showToast" :color="toastLevel" timeout="3000" location="bottom">
    {{ toastMessage }}
  </v-snackbar>
  <SearchBar :onClickSearch="fetchSpotifyPodcasts" ref="searchBarRef" />
  <PodcastList
    :podcasts="podcasts"
    :selectedPodcasts="selectedPodcasts"
    :colours="colours"
    :onSelectPodcast="fetchReleaseDates"
    :expanded="false"
    ref="podcastListRef"
  />
  <p class="pa-4">Podcast's latest episode release dates:</p>
  <div class="pb-10 px-4">
    <ReleaseDateCalendar :colours="colours" :selectedPodcasts="selectedPodcasts" />
  </div>
  <p class="pa-4">More information about the latest episodes:</p>
  <PodcastList
    :podcasts="Object.values(selectedPodcasts)"
    :selectedPodcasts="selectedPodcasts"
    :colours="colours"
    :expanded="true"
  />
</template>
