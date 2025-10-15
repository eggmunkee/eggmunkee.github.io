<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  album: {
    type: String,
    required: false
  },
  url: {
    type: String,
    required: true
  }
})
</script>

<template>
<div class="song-cont">
    <div class="song-title">
      <span class="blue">{{title}}</span>
      <span v-if="album">
        [{{album}}]
      </span>
    </div>
    <div class="song-player">
        <audio controls :title="title" preload="metadata">
            <source :src="url" />
        </audio>
    </div>
</div>
</template>

<style scoped>
    .song-cont {
        font-family: sans-serif;
        /* color: #88aaee; */
    }
</style>