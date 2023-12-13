<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  content: {
    type: String,
    required: false
  }
})
</script>

<template>
  <div class="highlight">
    <h1 class="blue">{{ title }}</h1>
    <slot>
      <p>{{ content }}</p>
    </slot>
  </div>
</template>

<style scoped>
.highlight {
  background-color: var(--color-highlight);
  padding: 1rem;
  border-radius: 5px;
  margin-bottom: 2rem;
}
.highlight h1 {
  /* color: var(--color-text-light); */
}
</style>
