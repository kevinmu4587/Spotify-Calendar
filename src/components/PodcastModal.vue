<script setup lang="ts">
import type { SpotifyShowEpisode } from '@/api/spotify_interface'
import { ref, watch } from 'vue'

const props = defineProps<{
  episode: SpotifyShowEpisode | null
  onClose: () => void
  isShowModal: boolean
}>()

const dialogVisible = ref<boolean>(props.isShowModal)

watch(
  () => props.isShowModal,
  (val) => {
    dialogVisible.value = val
  },
)

watch(dialogVisible, (val) => {
  if (!val) props.onClose()
})
</script>

<template>
  <v-dialog v-model="dialogVisible" max-width="600px">
    <v-card>
      <v-card-title class="text-h6">
        {{ props.episode?.name }}
      </v-card-title>

      <v-card-text style="white-space: normal">
        <p><strong>Description:</strong> {{ props.episode?.description }}</p>
        <strong>Url: </strong>
        <a :href="props.episode?.external_urls.spotify" target="_blank">
          {{ props.episode?.external_urls.spotify }}
        </a>
        <v-img
          v-if="props.episode?.images?.[0]"
          :src="props.episode?.images[0].url"
          width="100%"
          class="mt-4 rounded"
          cover
        />
      </v-card-text>

      <v-card-actions>
        <v-spacer />
        <v-btn color="primary" @click="props.onClose">Close (Escape)</v-btn>
      </v-card-actions>
    </v-card>
  </v-dialog>
</template>
