<script setup lang="ts">
import type { SpotifyShow } from '@/api/spotify_interface'
import SearchBar from './SearchBar.vue';
import { ref } from 'vue';

const props = defineProps<{
  podcast: SpotifyShow | null,
  onClose: () => void,
  isShowModal: boolean,
}>()

</script>

<template>
  <v-dialog
    v-model="props.isShowModal"
    max-width="600px"
  >
    <v-card>
      <v-card-title class="text-h6">
        {{ props.podcast?.name }}
      </v-card-title>

      <v-card-text>
        <p><strong>Publisher:</strong> {{ props.podcast?.publisher }}</p>
        <p><strong>Description:</strong> {{ props.podcast?.description }}</p>
        <p><strong>Number of episodes:</strong> {{ props.podcast?.total_episodes }}</p>
        <strong>Url: </strong> 
          <a :href="props.podcast?.external_urls.spotify" target="_blank">
            {{ props.podcast?.external_urls.spotify }}
          </a>

        <v-img
          v-if="props.podcast?.images?.[0]"
          :src="props.podcast?.images[0].url"
          width="100%"
          class="mt-4 rounded"
          cover
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="props.onClose">Close</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
