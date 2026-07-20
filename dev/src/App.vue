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

nav {
  width: 100%;
  font-size: 12px;
  text-align: center;
  margin-top: 2rem;
}

header .wrapper {
  /*background-color: rgba(100,100,100,0.5);
  border-radius: 1em;
  box-shadow: 0 0 1em 2em rgba(100,100,100,0.5);*/
}

nav a.router-link-exact-active {
  color: var(--color-text);
  background-color: rgba(0,0,0,0.05);
  box-shadow: 0 0 1em 0.5em rgba(0,0,0,0.05);
  border: 0 solid transparent;
}

nav a.router-link-exact-active:hover {
  background-color: rgba(255,255,255,0.0);
  box-shadow: 0 0 1em 0.5em rgba(255,255,255,0.0);
  border: 0 solid transparent;
}

nav a {
  display: inline-block;
  padding: .5em 1em;
  border-radius: 0.5em;
  font-weight: bolder;
  font-family:'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
  text-shadow: -0.01em 0.01em 0.45em rgb(0 0 0);
  background-color: rgba(0,0,0,0.15);
  box-shadow: 0 0 1em 0.5em rgba(0,0,0,0.15);
  border: 0 solid transparent;
}

nav a:hover {
  background-color: rgba(230,230,230,0.15);
  box-shadow: 0 0 1em 0.5em rgba(230,230,230,0.15);
  border: 0.15em dashed white;
}

nav a:last-of-type {
  
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
