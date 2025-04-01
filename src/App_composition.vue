<script setup lang="ts">
import { ref } from 'vue';

type Status = 'active' | 'pending' | 'inactive'

const name = ref<string>('John Doe');
const status = ref<Status>('active');
const tasks = ref<string[]>(['Task 1', 'Task 2', 'Task 3']);

const cycleStatus = () => {
  if (status.value === 'active') {
    status.value = 'pending'
  } else if (status.value === 'pending') {
    status.value = 'inactive'
  } else {
    status.value = 'active'
  }
}
</script>

<template>
  <h1>
    {{ name }}
  </h1>
  <p v-if="status === 'active'">User is active</p>
  <p v-else-if="status === 'pending'">User is pending</p>
  <p v-else>User is a mystery</p>

  <h3>Tasks</h3>
  <ul>
    <li v-for="task in tasks" :id="task">
      {{ task }}
    </li>
  </ul>
  <button v-on:click="cycleStatus">Cycle status 1</button>
  <button @click="cycleStatus">Cycle status 2</button>
</template>