<script setup lang="ts">
import type { SpotifyShow } from '@/api/spotify_interface';

const props = defineProps<{
  podcast: SpotifyShow,
  index: number,
  colours: string[],
  onSelectPodcast: (selectedPodcasts: Record<string, SpotifyShow>) => {}
}>()
</script>

<template>
  <v-row
  class="my-3 pa-4 flex-nowrap clickable"
  style="min-height: 100px; cursor: pointer;"
  :style="{
    backgroundColor: getBackgroundColor(podcast.id, index)
  }"
  ref="rowRefs"
  :ref_for="true"
  :ref_key="`${index}`"
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
      Details (d)
    </v-btn>
  </v-col>
  </v-row>
</template>