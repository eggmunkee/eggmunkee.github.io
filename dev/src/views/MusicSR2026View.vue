<script setup>
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_stochastic_recovery_20x6.json';
</script>



<template>
<div class="root-div">
    <h1 class="under">EGGMUNKEE MUSIC</h1>
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
                <span v-show="currentSongArtist">by {{currentSongArtist}}</span> <span v-show="currentSongAlbum">[{{currentSongAlbum}}]</span>
            </div>
        </div>
    </div>
    
    <h2>
        Songs ({{songList.length}})
        <label class="small-label"><a href="#" @click.prevent="shuffleTracks">Shuffle</a></label>
    </h2>
    <div v-for="song in songList" :key="song.src">
        <Song :url="song.src" :title="song.title" :album="song.album" />
    </div>
</div>
</template>

<script>



export default {
  data() {
    return {
        // State        
        currentSongTitle: '',
        currentSongArtist: 'Eggmunkee',
        currentSongAlbum: 'STOCHASTIC RECOVERY 20x6',
        // Configuration
        songList: initialSongList
    }
  },
  methods: {
    playNext(next) {
        try {
            let songIdx = this.$refs['audioPlayer'].currentPlayIndex;
            let song = this.songList[songIdx];
            this.currentSongTitle = song.title || ' ';
            this.currentSongArtist = song.artist || ' ';
            this.currentSongAlbum = song.album || ' ';
        } catch (e) {
            this.currentSongTitle = 'Unknown';
            this.currentSongArtist = ' ';
            this.currentSongAlbum = ' ';
        }

        next() // Start play
    },
    shuffleTracks() {
        let songs = this.songList;
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
        this.songList = songs;
    }
  }
}
</script>

<style scoped>
.under {
    text-decoration: underline;
}
.small-label {
    font-size: 85%;
}
.root-div {
    margin: 20px;
    text-align: center;
    font-size: 12pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
    background-repeat: no-repeat;
    background-size: contain;
    /* 
    background-image: url('mp3/stochastic recovery 20x6/cover-art-stochastic-recovery-20x6-album.jpg');
    */
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