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
  albumClass: {
    type: String,
    required: false,
    default: ""
  },
  muted: {
    type: Boolean,
    required: false,
    default() { return false }
  },
  showPlayer: {
    type: Boolean,
    required: false,
    default: true
  },
  showDownload: {
    type: Boolean,
    required: false,
    default() { return false }
  }
})

const emit = defineEmits(['title-dblclick']);

const titleDblClick = () => {
  // Emit event with payload
  emit('title-dblclick');
};
const antiSelectHandler = (event) => {
  if (event.detail > 1) {
    event.preventDefault();
  }
};
</script>

<template>
<div class="song-cont">
    <div class="song-title" @dblclick="titleDblClick" @mousedown="antiSelectHandler">
      <span class="song-text">
        <span :class="titleClass">{{title}}</span>
        <span v-if="album" :class="albumClass">
          [{{album}}]
        </span>
      </span>
      <span v-if="showDownload" class="song-download-cont">
        <a :href="url" rel="noopener noreferrer" download>
            <span class="small-dual-label dual-label-1 download-icon">&nbsp;</span>
        </a>
      </span>
    </div>
    <div v-if="showPlayer" class="song-player" :class="muted?'muted':''">
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
        /* no player styling */
        display: flex;
        flex-direction: row;
        justify-content: center;
        align-items: center;   
        padding: .25em .125em .25em .125em;   
        margin-left: 1.0em;
        margin-right: 0.5em;
    }
    .song-text {
      
      padding: 0;
    }

    .song-player > audio::-webkit-media-controls-panel {
      color: rgba(30, 50, 200, 0.6);
    }
    .song-download-cont {
      padding-left: 0.5em;
    }
    .song-download-cont > a {
      padding: 0.1em;
      background: rgba(0,0,80,0.1);
      border-radius: 0.45em;
      box-shadow: 0 0 0.4em 0.4em rgba(245,245,255,0.1);
    }
    .song-download-cont .order-icon {
      background: hsl(208, 75%, 80%); /* rgba(50,50,50,0.45)*/;
      padding: 0;
      vertical-align: bottom;
      line-height: 20px;
      display: inline-block;
      height: 20px;
      
    }
    .download-icon {
      /* Set dimensions */
      width: 1em;
      height: 1em;
      display: inline-block;
      vertical-align: baseline;
      
      /* Set the desired color */
      background-color: hsl(208, 75%, 80%); 
      
      /* Apply the image as a mask */
      -webkit-mask-image: url('/assets/icon-download.png');
      mask-image: url('/assets/icon-download.png');
      
      /* Ensure the mask covers the element */
      -webkit-mask-size: contain;
      mask-size: contain;
      -webkit-mask-repeat: no-repeat;
      mask-repeat: no-repeat;
      -webkit-mask-position: center;
      mask-position: center;
    }
</style>