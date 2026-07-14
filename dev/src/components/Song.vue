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
  },
  titleClass: {
    type: String,
    required: false,
    default: ""
  },
  muted: {
    type: Boolean,
    required: false,
    default() { return false; }
  }
})
</script>

<template>
<div class="song-cont">
    <div class="song-title">
      <span :class="titleClass">{{title}}</span>
      <span v-if="album">
        [{{album}}]
      </span>
    </div>
    <div class="song-player" :class="muted?'muted':''">
        <audio controls :title="title" loading="lazy" preload="metadata">
            <source :src="url" />
        </audio>
    </div>
</div>
</template>

<style scoped>
    .song-cont {
        /* font-family: sans-serif;*/
        /* color: #88aaee; */
    }

    .song-player > audio {
      height: 1.5em; max-width: 100%;
    }

    .song-cont > .song-player.muted {
        opacity: 0.75;
    }
    .song-cont > .song-player {
        opacity: 1;
    }
    .song-title {
        line-height: 1.2;
    }

    .song-player > audio::-webkit-media-controls-panel {
      color: rgba(30, 50, 200, 0.6);
    }
</style>