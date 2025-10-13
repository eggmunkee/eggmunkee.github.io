<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
</script>

<script>
export default {
  data() {
    return {
        // State        
        currentSongTitle: 'Click To Play',
        currentSongArtist: '',
        currentSongAlbum: 'Assorted Eggmunkee Songs',
        // Configuration
        songList: [
            
            {
                title: 'Radicalized',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Radicalized.mp3'
            },

            {
                title: 'Everything It Captures',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Everything It Captures.mp3'
            },
            
            {
                title: 'There we all go',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/There we all go.mp3'
            },
            
            {
                title: 'Fractured Armies',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Fractured Armies.mp3'
            },
            
            {
                title: 'Good Afternoon, X',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Good Afternoon X.mp3'
            },

            {
                title: 'Lost Cause Caravan',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Lost Cause Caravan.mp3'
            },

            {
                title: 'Hometown Streets',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Hometown Streets.mp3'
            },

            {
                title: 'Lemons',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Lemons.mp3'
            },

            {
                title: 'This must be a Test',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/This must be a Test.mp3'
            },
            
            {
                title: 'All I Got',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/All I Got.mp3'
            },

            {
                title: 'Oddest Of Us',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Oddest Of Us.mp3'
            },

            {
                title: 'Dust on the rug',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Dust on the rug.mp3'
            },

            {
                title: 'Skasynthic Covahed',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Skasynthic Covahed.mp3'
            },

            {
                title: 'Shoegaze Synthwave 2 mk I',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Shoegaze Synthwave 2 mk I.mp3'
            },

            {
                title: 'Ska Dormant Rock v2 #NoCredMix',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/ska_dormant_rock_v2_E4R__NoCredMix_E8_RE2.mp3'
            },
            
            {
                title: 'Indied Down B',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Indied Down B.mp3'
            },

            {
                title: 'Sand Dollar Algorithms (311-Muse mashup)',
                artist: 'eggmunkee',
                album: 'Assorted Remixes',
                src: '/mp3/SandDollarAlgorithms_311_Muse_wip.mp3'
            },

        ]
    }
  },
  methods: {
    playNext(next) {
        try {
            var songIdx = this.$refs['audioPlayer'].currentPlayIndex;
            var song = this.songList[songIdx];
            this.currentSongTitle = song.title || ' ';
            this.currentSongArtist = song.artist || ' ';
            this.currentSongAlbum = song.album || ' ';
        } catch (e) {
            this.currentSongTitle = 'Unknown';
            this.currentSongArtist = ' ';
            this.currentSongAlbum = ' ';
        }

        next() // Start play
    }
  }
}
</script>

<template>
<div class="root-div">
    <h1 class="blue">EGGMUNKEE MUSIC</h1>
    <div style="border: 2px solid #e6e6e6; border-radius: 2rem; padding: 15px; margin-bottom: 2rem;" >
        <vue-audio-player ref="audioPlayer"
            :audio-list="songList"
            theme-color="hsl(208, 75%, 59%)"
            :before-play="playNext"
            :progress-interval="500"
        ></vue-audio-player>
        <div class="song-label">
            <div class="song-title">{{currentSongTitle}}</div>
            <div class="song-artist">
                <span v-show="currentSongArtist">by {{currentSongArtist}}</span> 
                <span v-show="currentSongAlbum">[{{currentSongAlbum}}]</span>
            </div>
        </div>
    </div>
    
    <h2>Songs</h2>
    <div v-for="song in songList">
        <Song :url="song.src" :title="song.title + ' - ' + song.album" />
    </div>
</div>
</template>

<style scoped>
.root-div {
    margin: 20px;
    text-align: center;
    font-size: 12pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
}
.song-label {
    color: hsl(208, 75%, 59%);
    font-weight: bold;
}
.song-title {
    font-weight: bold;
}
.song-artist {
    opacity: 75%;
    font-weight: bold;
}
</style>