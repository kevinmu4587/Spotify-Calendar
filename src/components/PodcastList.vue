<script setup lang="ts">
import type { SpotifyShow } from '@/api/spotify_interface';
import { onMounted, ref, watch } from 'vue';
import PodcastModal from './PodcastModal.vue';

const props = defineProps<{
  podcasts: SpotifyShow[],
  selectedPodcasts?: Record<string, SpotifyShow>,
  colours: string[],
  onSelectPodcast?: (selectedPodcasts: Record<string, SpotifyShow>) => {},
  readonly: boolean
}>()

const isShowModal = ref<boolean>(false)
const modalPodcast = ref<SpotifyShow | null>(null)
const hoveredIndex = ref<number>(-1)
const rowRefs = ref<{ $el: HTMLElement }[]>([]);

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
  if (props.onSelectPodcast) props.onSelectPodcast(selected)
  console.log('selected podcasts is now', selected)
}

const onClickDetails = (podcast: SpotifyShow): void => {
  modalPodcast.value = podcast
  isShowModal.value = true
}

const onCloseModal = (): void => {
  modalPodcast.value = null
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
    } else if (e.key === 'd') {
      isShowModal.value = true;
      modalPodcast.value = props.podcasts[hoveredIndex.value]
    } else if (e.key == 'Escape') {
      onCloseModal()
    }
  })
})


function scrollHoverUp(): void {
  console.log('hover index up')
  if (props.podcasts.length === 0) return 
  if (hoveredIndex.value === -1) {
    hoveredIndex.value = 0
    return
  }
  hoveredIndex.value = 
    hoveredIndex.value - 1 < 0 
      ? props.podcasts.length - 1 
      : hoveredIndex.value - 1
  }

function scrollHoverDown(): void {
  console.log('hover index down')
  if (props.podcasts.length == 0) return
  if (hoveredIndex.value === -1) {
    hoveredIndex.value = 0
    return
  }

  hoveredIndex.value = 
    hoveredIndex.value + 1 >= props.podcasts.length 
      ? 0 
      : hoveredIndex.value + 1
  }

defineExpose({ scrollHoverUp, scrollHoverDown })

watch(hoveredIndex, (newIndex) => {
  const row = rowRefs.value[newIndex];
  if (row && row.$el) {
    row.$el.scrollIntoView({
      behavior: 'smooth',
      block: 'nearest',
    });
  }
});

function getBackgroundColor(id: string, index: number) {
  if (props.selectedPodcasts && id in props.selectedPodcasts) {
    const selectedIds = Object.keys(props.selectedPodcasts)
    const selectedIndex = selectedIds.indexOf(id)
    return props.colours[selectedIndex]
  } else if (index === hoveredIndex.value) {
    // same colour as hovering with a mouse
    return getComputedStyle(document.documentElement)
    .getPropertyValue('--color-accent-2')
    .trim()
  }
}
</script>

<template>
  <PodcastModal :isShowModal="isShowModal" :podcast="modalPodcast" :onClose="onCloseModal"/>
  <v-card class="pa-4 mx-4 podcastList" max-height="800"
  >
    <div v-if="podcasts.length == 0">
      <p class="description" style="text-align: center;">No podcasts. Enter a search query.</p>
    </div>
    <div v-else v-for="(podcast, index) in podcasts" :key="podcast.id">
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
      </v-row>
      <v-row 
        class="ml-4 pa-1 flex-nowrap"
        v-if="readonly"
        v-for="episode in podcast?.latest_episodes"
        :style="{
          backgroundColor: getBackgroundColor(podcast.id, index)
        }"
        no-gutters
      >
        <v-col>
          <p class="pl-10" style="color: white">
            {{  episode.name }}
          </p>
          <p class="pl-10" style="color: white">
            {{  episode.release_date }}
          </p>
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
