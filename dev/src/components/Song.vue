<script setup>
defineProps({
  title: {
    type: String,
    required: true
  },
  url: {
    type: String,
    required: true
  }
})
</script>

<template>
<div class="song-cont">
    <div class="song-title blue">{{title}}</div>
    <div class="song-player">
        <audio controls :title="title">
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