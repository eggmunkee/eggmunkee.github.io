<script setup>
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
</script>

<script>
export default {
  data() {
    return {
        // State        
        currentSongTitle: '',
        currentSongArtist: '',
        currentSongAlbum: 'Assorted Eggmunkee Songs',
        // Configuration
        // TODO: Load these from the file /dev/src/data/musicPlaylist.json instead of hard-coding them
        songList: [
        
            {
                title: 'There we all go',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/There we all go.mp3'
            },

            {
                title: 'Good Afternoon, X',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Good Afternoon X.mp3'
            },

            /* Song Data Template: 
            {
                title: '',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/.mp3'
            },
            */
        ]
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
    }
  }
}
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
    <div>
        
    </div>
    <div v-for="song in songList" :key="song.src">
        <Song :url="song.src" :title="song.title" :album="song.album" />
    </div>
</div>
</template>

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