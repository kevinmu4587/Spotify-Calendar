<script setup lang="ts">
import { ref } from 'vue'
import ReleaseDateCalendar from './ReleaseDateCalendar.vue'
import SearchBar from './SearchBar.vue';
import PodcastList from './PodcastList.vue';
import { getLatestEpisode, searchPodcasts } from '../api/spotify';
import type { SpotifyShow, SpotifyShowEpisode } from '@/api/spotify_interface';

let podcasts = ref<SpotifyShow[]>([])
const selectedPodcasts = ref<Record<string, SpotifyShow>>({});


const fetchSpotifyPodcasts = async (query: string): Promise<void> => {
  try {
    selectedPodcasts.value = {}
    podcasts.value = await searchPodcasts(query)
  } catch (error) {
    console.log('Could not make API request')
  }
}
const colours: string[] = [
  '#00796B',
  '#303F9F',
  '#EF6C00',
  '#6A1B9A',
  '#C62828',
]

const fetchReleaseDates = async (updatedSelectedPodcasts: Record<string, SpotifyShow>): Promise<void> => {
  try {
    selectedPodcasts.value = updatedSelectedPodcasts
    const selectedIds = Object.keys(selectedPodcasts.value)
    const result = await Promise.all(
      selectedIds.map(async (id) => {
        const episode: SpotifyShowEpisode = await getLatestEpisode(id)
        return { id, episode }
      })
    )

    const releaseMap: Record<string, SpotifyShow> = {}
    result.forEach(({id, episode}) => {
      if (episode) releaseMap[id] = {
        ...selectedPodcasts.value[id],
        latest_episode: {
          release_date: episode.release_date,
          name: episode.name
        }
      }
    })
    console.log('Release dates:', releaseMap)
    selectedPodcasts.value = releaseMap

  } catch (error) {
    console.error('Could not make API request:', error)
  }
}
</script>

<template>
    <p class="pa-4">Start by searching for podcasts from Spotify. Then, select up to 5 podcasts to
       view their latest release date in the calendar below.</p>
    <SearchBar :onClickSearch="fetchSpotifyPodcasts"/>
    <PodcastList 
      :podcasts="podcasts"
      :selectedPodcasts="selectedPodcasts"
      :colours="colours" 
      :onSelectPodcast="fetchReleaseDates"
    />
    <p>Podcast's latest episode release dates (hover to view podcast name):</p>
    <div class="centered pb-10">
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
