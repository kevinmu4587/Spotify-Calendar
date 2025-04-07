<script setup lang="ts">
import type { SpotifyShow, SpotifyShowEpisode } from '@/api/spotify_interface'
import { onMounted, ref, watch } from 'vue'
import PodcastModal from './PodcastModal.vue'

const props = defineProps<{
  podcasts: SpotifyShow[]
  selectedPodcasts?: Record<string, SpotifyShow>
  colours: string[]
  onSelectPodcast?: (selectedPodcasts: Record<string, SpotifyShow>) => void
  expanded: boolean
}>()

const isShowModal = ref<boolean>(false)
const modalPodcastEpisode = ref<SpotifyShowEpisode | null>(null)
const hoveredIndex = ref<number>(-1)
const rowRefs = ref<{ $el: HTMLElement }[]>([])
const showErrorToast = ref<boolean>(false)
const toastMessage = ref<string>('')

const toggleSelect = (id: string): void => {
  const selected = { ...props.selectedPodcasts }

  if (id in selected) {
    delete selected[id]
  } else if (Object.keys(selected).length >= 5) {
    showErrorToast.value = true;
    toastMessage.value = "Cannot select more than 5 podcasts!"
  } else {
    const podcast = props.podcasts.find((p) => p.id === id)
    if (podcast) {
      selected[id] = podcast
    }
  }
  if (props.onSelectPodcast) props.onSelectPodcast(selected)
  console.log('selected podcasts is now', selected)
}

const scrollHoverUp = (): void => {
  console.log('hover index up')
  if (props.podcasts.length === 0) return
  if (hoveredIndex.value === -1) {
    hoveredIndex.value = 0
    return
  }
  hoveredIndex.value =
    hoveredIndex.value - 1 < 0 ? props.podcasts.length - 1 : hoveredIndex.value - 1
}

const scrollHoverDown = (): void => {
  console.log('hover index down')
  if (props.podcasts.length == 0) return
  if (hoveredIndex.value === -1) {
    hoveredIndex.value = 0
    return
  }

  hoveredIndex.value = hoveredIndex.value + 1 >= props.podcasts.length ? 0 : hoveredIndex.value + 1
}

const onClickDetails = (episode: SpotifyShowEpisode): void => {
  console.log('opening modals', episode)
  modalPodcastEpisode.value = episode
  isShowModal.value = true
}

const onCloseModal = (): void => {
  modalPodcastEpisode.value = null
  isShowModal.value = false
}

onMounted(() => {
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      if (hoveredIndex.value !== -1 && props.podcasts.length !== 0) {
        console.log('keyboard selected id: ', props.podcasts[hoveredIndex.value].id)
        toggleSelect(props.podcasts[hoveredIndex.value].id)
      }
    } else if (e.key == 'Escape') {
      onCloseModal()
    }
  })
})

defineExpose({ scrollHoverUp, scrollHoverDown })

watch(hoveredIndex, (newIndex) => {
  const row = rowRefs.value[newIndex]
  if (row && row.$el) {
    row.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    })
  }
})

const getBackgroundColor = (id: string, index: number): string => {
  if (props.selectedPodcasts && id in props.selectedPodcasts) {
    const selectedIds = Object.keys(props.selectedPodcasts)
    const selectedIndex = selectedIds.indexOf(id)
    return props.colours[selectedIndex]
  } else if (index === hoveredIndex.value) {
    // same colour as hovering with a mouse
    return getComputedStyle(document.documentElement).getPropertyValue('--color-accent-2').trim()
  }
  return ''
}
</script>

<template>
  <v-snackbar v-model="showErrorToast" color="warning" timeout="3000" location="top">
    {{ toastMessage }}
  </v-snackbar>
  <PodcastModal :isShowModal="isShowModal" :episode="modalPodcastEpisode" :onClose="onCloseModal" />
  <v-card class="pa-4 mx-4 podcastList" max-height="800">
    <div v-if="podcasts.length == 0">
      <p class="description" style="text-align: center;">No podcasts. Enter a search query.</p>
    </div>
    <div v-else v-for="(podcast, index) in podcasts" :key="podcast.id">
      <v-row
        class="my-3 pa-4 flex-nowrap clickable"
        style="min-height: 100px; cursor: pointer"
        :style="{
          backgroundColor: getBackgroundColor(podcast.id, index),
        }"
        ref="rowRefs"
        :ref_for="true"
        :ref_key="`${index}`"
        no-gutters
        @click="toggleSelect(podcast.id)"
      >
        <v-col cols="auto">
          <v-img :src="podcast.images[0]?.url" width="56" cover height="56" class="rounded" />
        </v-col>

        <v-col cols="auto" class="pl-4 pr-12">
          <div class="text-subtitle-1 title">
            {{ podcast.name }}
          </div>
          <div class="text-caption" style="color: var(--color-text)">
            {{ podcast.publisher }}
          </div>
          <div class="text-body-2 description">
            {{ podcast.description }}
          </div>
        </v-col>
      </v-row>
      <template v-if="expanded">
        <v-row
          class="py-2 px-4 flex-nowrap"
          v-for="episode in podcast?.latest_episodes"
          :key="episode.id"
          :style="{
            backgroundColor: getBackgroundColor(podcast.id, index),
          }"
          no-gutters
        >
          <v-col>
            <p class="pl-10" style="color: white">
              {{ episode.name }}
            </p>
            <p class="pl-10 description">
              {{ episode.release_date }}
            </p>
          </v-col>
          <v-col cols="auto" class="ml-auto">
            <v-btn
              style="background-color: var(--vt-c-accent-dark-1)"
              height="40"
              @click="onClickDetails(episode)"
              @keydown.enter="onClickDetails(episode)"
            >
              Details
            </v-btn>
          </v-col>
        </v-row>
      </template>
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
  color: white;
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
