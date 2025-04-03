<script setup lang="ts">
import {ref, watch} from 'vue';
const text = ref<string>('')
let isError = ref<boolean>(false)


const props = defineProps<{
  onClickSearch: (query: string) => void
}>()

const onSubmit = (text: string) => {
  if (text === '') {
    isError.value = true;
    return;
  }
  isError.value = false;
  props.onClickSearch(text)
}

watch(text, (val) => {
  if (val !== '') {
    isError.value = false
  }
})
</script>

<template>
  <v-row justify="center">
    <v-col cols="8">
      <v-text-field
        :error="isError"
        :error-messages="isError ? 'Search term is required' : ''"
        clearable
        prepend-icon="mdi-magnify"
        label="Search podcasts"
        v-model="text"
        density="compact"
      />
    </v-col>

    <v-col cols="1">
      <v-btn 
        style="background-color: var(--vt-c-accent-dark-1);"
        height="40"
        @click="onSubmit(text)"
      >
        Search
      </v-btn>
    </v-col>
  </v-row>
</template>


