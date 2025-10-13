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
                title: 'Lost Cause Caravan',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Lost Cause Caravan.mp3'
            },
            {
                title: 'Lemons',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Lemons.mp3'
            },
            {
                title: 'Hometown Streets',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Hometown Streets.mp3'
            },
            {
                title: 'Oddest Of Us',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Oddest Of Us.mp3'
            },
            {
                title: 'All I Got',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/All I Got.mp3'
            },
            {
                title: 'Sand Dollar Algorithms (311-Muse mashup)',
                artist: 'eggmunkee',
                album: 'Assorted Remixes',
                src: '/mp3/SandDollarAlgorithms_311_Muse_wip.mp3'
            },
            {
                title: 'Indied Down B',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Indied Down B.mp3'
            }
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
    <div style="border: 5px solid white; padding: 15px">
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
    <hr/>
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