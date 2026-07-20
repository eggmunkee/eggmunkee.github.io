<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
/* import AMLogo from './components/AMLogo.vue' */
const currentYear = ref(new Date().getFullYear())
</script>

<template>
  <header>
    <div class="wrapper">
      <nav>
        <RouterLink to="/home">EGGMUNKEE <span class="major-slash">/</span></RouterLink>
        <RouterLink to="/">LATEST MUSIC</RouterLink>
        <RouterLink to="/2025">LEGACY MUSIC</RouterLink>
      </nav>
    </div>
  </header>

  <RouterView />

  <footer class="blue-dimmed over-bg-shadow">&copy; {{ currentYear }} @eggmunkee</footer>
</template>

<style scoped>
header {
  line-height: 1.5;
  max-height: 100vh;
  z-index: 2;
}

.logo {
  display: block;
  margin: 0 auto 2rem;
}

footer {
  display: flex;
  flex-direction: row;
  justify-content: center;
  z-index: 2;
}

@media (min-width: 1024px) {
  header {
    display: flex;
    place-items: center;
    text-shadow: 0 0.05em 0.5em #000000;
    padding-right: calc(var(--section-gap) / 2);
  }

  .logo {
    margin: 0 2rem 0 0;
  }

  header .wrapper {
    display: flex;
    place-items: flex-start;
    flex-wrap: wrap;
  }

  nav {
    text-align: left;
    margin-left: -1rem;
    font-size: 1rem;

    padding: 1rem 0;
    margin-top: 1rem;
    text-shadow: 0 0.05em 0.5em #000000;
  }

  footer {
    display: block;
  }

}
</style>
