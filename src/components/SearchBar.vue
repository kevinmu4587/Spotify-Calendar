<script setup lang="ts">
import {ref, watch} from 'vue';
const text = ref<string>('')
let isError = ref<boolean>(false)

const inputRef = ref()

const props = defineProps<{
  onClickSearch: (query: string) => void
}>()

const onSubmit = () => {
  if (text.value === '') {
    isError.value = true;
    return;
  }
  isError.value = false;
  props.onClickSearch(text.value)
}

const handleKeyPress = (e: KeyboardEvent) => {
  if (e.key === 'Enter') {
    onSubmit()
    unfocusInput()
  }
}

watch(text, (val) => {
  if (val.trim() !== '') {
    isError.value = false
  }
})

function focusInput() {
  console.log('SearchBar.vue: Focusing to search bar')
  inputRef.value.focus()
  isError.value = false
}

function unfocusInput() {
  inputRef.value.$el.querySelector('input').blur()
}

defineExpose({ focusInput, unfocusInput })
</script>

<template>
  <v-row justify="center" class="px-5">
    <v-col cols="8">
      <v-text-field
        :error="isError"
        :error-messages="isError ? 'Search term is required' : ''"
        clearable
        prepend-icon="mdi-magnify"
        label="Search podcasts"
        v-model="text"
        density="compact"
        @keyup="handleKeyPress"
        ref="inputRef"
      />
    </v-col>

    <v-col cols="1">
      <v-btn 
        style="background-color: var(--vt-c-accent-dark-1);"
        height="40"
        @click="onSubmit"
      >
        Search
      </v-btn>
    </v-col>
  </v-row>
</template>


