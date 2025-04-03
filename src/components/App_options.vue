<script>
export default {
  data() {
    return {
      name: 'John Doe',
      status: 'active',
      tasks: ['Task 1', 'Task 2', 'Task 3'],
      link: 'https://www.google.com'
    }
  },
  methods: {
    cycleStatus() {
      if (this.status === 'active') {
        this.status = 'pending'
      } else if (this.status === 'pending') {
        this.status = 'inactive'
      } else {
        this.status = 'active'
      }
    }
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

  <a :href="link">External link</a>

  <br/>

  <button v-on:click="cycleStatus">Cycle status 1</button>
  <button @click="cycleStatus">Cycle status 2</button>
</template>