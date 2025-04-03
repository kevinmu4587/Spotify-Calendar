<template>
  <header class="header-bar">
    <h1 class="site-title">Search for Podcasts</h1>
  </header>
</template>

<style scoped>
.header-bar {
  width: 100%;
  background-color: var(--vt-c-accent-dark-1);
  padding: 1rem 2rem;
  box-shadow: 0 2px 4px rgba(0, 0, 0, 0.05);
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: sticky;
  top: 0;
  z-index: 1000;
}

.site-title {
  margin: 0;
  font-size: 1.5rem;
  color: var(--vt-c-black);
}
</style>