<script setup lang="ts">
import { onMounted, ref } from 'vue'
import ReleaseDateCalendar from './ReleaseDateCalendar.vue'
import SearchBar from './SearchBar.vue';
import PodcastList from './PodcastList.vue';
import { getLatestEpisodes, searchPodcasts } from '../api/spotify';
import type { SpotifyShow, SpotifyShowEpisode } from '@/api/spotify_interface';

let podcasts = ref<SpotifyShow[]>([])
const selectedPodcasts = ref<Record<string, SpotifyShow>>({});
const showErrorToast = ref<boolean>(false)
const toastMessage = ref<string>('')
// to access the child SearchBar's functions
const searchBarRef = ref<InstanceType<typeof SearchBar> | null>(null)
const podcastListRef = ref<InstanceType<typeof PodcastList> | null>(null)
  const colours: string[] = [
  '#00796B',
  '#303F9F',
  '#EF6C00',
  '#6A1B9A',
  '#C62828',
]

const fetchSpotifyPodcasts = async (query: string): Promise<void> => {
  try {
    selectedPodcasts.value = {}
    podcasts.value = await searchPodcasts(query)
  } catch (error) {
    console.log('Could not make API request')
    showErrorToast.value = true;
    if (error instanceof Error) {
      toastMessage.value = error.message
    }
  }
}

const fetchReleaseDates = async (updatedSelectedPodcasts: Record<string, SpotifyShow>): Promise<void> => {
  try {
    selectedPodcasts.value = updatedSelectedPodcasts
    const selectedIds = Object.keys(selectedPodcasts.value)
    const result = await Promise.all(
      selectedIds.map(async (id) => {
        const episodes: SpotifyShowEpisode[] = await getLatestEpisodes(id, 5)
        return { id, episodes }
      })
    )

    const releaseMap: Record<string, SpotifyShow> = {}
    result.forEach(({id, episodes}) => {
      const latestEpisodes = episodes.map((episode) => {
        return {
          release_date: episode.release_date,
          name: episode.name,
        }
      })
      releaseMap[id] = {
        ...selectedPodcasts.value[id],
        latest_episodes: latestEpisodes
      }
    })
    console.log('Release dates:', releaseMap)
    selectedPodcasts.value = releaseMap

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
      podcastListRef.value?.scrollHoverUp()
    } else if (e.key === 'ArrowDown') {
      e.preventDefault()
      podcastListRef.value?.scrollHoverDown()
    }
  })
})
</script>

<template>
    <p class="pa-4">Start by searching for podcasts from Spotify. Then, select up to 5 podcasts to
       view their latest release date in the calendar below.</p>
       <v-snackbar
        v-model="showErrorToast"
        color="error"
        timeout="3000"
        location="top"
      >
        {{ toastMessage }}
      </v-snackbar>
    <SearchBar :onClickSearch="fetchSpotifyPodcasts" ref="searchBarRef"/>
    <PodcastList 
      :podcasts="podcasts"
      :selectedPodcasts="selectedPodcasts"
      :colours="colours" 
      :onSelectPodcast="fetchReleaseDates"
      ref="podcastListRef"
    />
    <p class="pa-4">Podcast's latest episode release dates (hover to view podcast name):</p>
    <div class="pb-10 px-4">
      <ReleaseDateCalendar 
        :colours="colours" 
        :selectedPodcasts="selectedPodcasts"
      />
    </div>
</template>

<style scoped>
.centered {
  width: fit-content;
  margin-left: auto;
  margin-right: auto;
}
</style>
