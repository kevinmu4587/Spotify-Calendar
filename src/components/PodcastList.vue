<script setup lang="ts">
import type { SpotifyShow } from '@/api/spotify_interface';
import { ref } from 'vue';
import PodcastModal from './PodcastModal.vue';

const props = defineProps<{
  podcasts: SpotifyShow[],
  selectedPodcasts: Record<string, SpotifyShow>,
  colours: string[],
  onSelectPodcast: (selectedPodcasts: Record<string, SpotifyShow>) => {}
}>()

const isShowModal = ref<boolean>(false)
const modalPodcast = ref<SpotifyShow | null>(null)

const toggleSelect = (id: string) => {
  const selected = { ...props.selectedPodcasts }

  if (id in selected) {
    delete selected[id]
  } else if (Object.keys(selected).length < 5) {
    const podcast = props.podcasts.find(p => p.id === id)
    if (podcast) {
      selected[id] = podcast
    }
  }
  props.onSelectPodcast(selected)
  console.log()
}

const getSelectedColour = (id: string): string => {
  const selectedIds = Object.keys(props.selectedPodcasts)
  const selectedIndex = selectedIds.indexOf(id)
  return props.colours[selectedIndex]
}

const onClickDetails = (podcast: SpotifyShow): void => {
  modalPodcast.value = podcast
  isShowModal.value = true
}

const onCloseModal = (): void => {
  modalPodcast.value = null
  isShowModal.value = false
}
</script>

<template>
  <PodcastModal :isShowModal="isShowModal" :podcast="modalPodcast" :onClose="onCloseModal"/>
  <v-card class="pa-4 podcastList" max-height="800">
    <div v-if="podcasts.length == 0">
      <p class="description" style="text-align: center;">No podcasts. Enter a search query.</p>
    </div>
    <div v-else v-for="podcast in podcasts" :key="podcast.id">
      <v-row
        class="my-3 pa-4 flex-nowrap clickable"
        style="min-height: 100px; cursor: pointer;"
        :style="{
          backgroundColor: podcast.id in selectedPodcasts
            ? getSelectedColour(podcast.id)
            : undefined
        }"
        no-gutters
        @click="toggleSelect(podcast.id)"
      >
        <v-col cols="auto">
          <v-img
            :src="podcast.images[0]?.url"
            width="56"
            cover 
            height="56"
            class="rounded"
          />
        </v-col>

        <v-col cols="10" class="px-4 pr-12">
          <div class="text-subtitle-1 title">
            {{ podcast.name }}
          </div>
          <div class="text-caption" style="color: var(--color-text)">
            {{ podcast.publisher }}
          </div>
          <div
            class="text-body-2 description"
          >
            {{ podcast.description }}
          </div>
        </v-col>
        <v-col cols="auto" class="ml-auto d-flex align-center">
          <v-btn
            style="background-color: var(--vt-c-accent-dark-1);"
            height="40"
             @click.stop="onClickDetails(podcast)"
          >
            Details
          </v-btn>
        </v-col>
      </v-row>
    </div>
  </v-card>
</template>

<style scoped>
.podcastList {
  overflow-y: auto;
  background-color: var(--color-background-soft);
}

.clickable:hover {
  background-color: var(--color-accent-2);
}

.title {
  color: var(--color-text);
  font-weight: bold;
}

.description {
  max-height: 40px; 
  overflow: hidden; 
  width: 100%;
  white-space: nowrap;
  text-overflow: ellipsis;
  color: var(--color-text);
}
</style>
