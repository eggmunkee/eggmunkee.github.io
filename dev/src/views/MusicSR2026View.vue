<script setup>
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_stochastic_recovery_20x6.json';
</script>



<template>
<div class="root-div">
    <h3 class="under">EGGMUNKEE MUSIC</h3>
    <div class="player-section">
        <div class="album-label">
            <span class="album-name" v-show="currentSongAlbum">{{currentSongAlbum}}</span>
        </div>
        <vue-audio-player ref="audioPlayer"
            :audio-list="songList"
            theme-color="hsl(208, 75%, 89%)"
            :before-play="playNext"
            :progress-interval="500"
        ></vue-audio-player>
        <div class="song-label">
            <div class="song-title">{{currentSongTitle}}</div>
            <div class="song-artist">
                <span v-show="currentSongArtist">by {{currentSongArtist}}</span>
            </div>
        </div>
    </div>
    
    <div class="playlist-section">
        <h2>
            Songs ({{songList.length}})
            <label class="small-dual-label"><a href="#" @click.prevent="shuffleTracks">Shuffle</a></label>
        </h2>
        <div v-for="(song, songIndex) in songList" :key="song.src" :class="songContainerClass(songIndex)">
            <Song :url="song.src" :title="song.title" :title-class="songStyle(songIndex)" />
        </div>
    </div>
</div>
</template>

<script>



export default {
  data() {
    return {
        // State
        animFrame: 0,
        maxFrames: 6,
        animInterval: -1,
        animStarted: false,
        currentSongIndex: 0,
        currentSongTitle: 'STOCHASTIC RECOVERY 20x6',
        currentSongArtist: 'Eggmunkee',
        currentSongAlbum: 'STOCHASTIC RECOVERY 20x6',
        // Configuration
        songList: initialSongList
    }
  },
  mounted() {
    this.animInterval = setTimeout(this.startAnim, 5000);
  },
  umounted() {
    if (this.animInterval != -1) {
        if (this.animStarted) {
            clearInterval(this.animInterval);
        }
        else {
            clearTimeout(this.animInterval);
        }
        this.animInterval = -1;
    }
  },
  methods: {
    startAnim() {
        this.animInterval = setInterval(this.incrementAnim, 4000);
        this.animStarted = true;
    },
    incrementAnim() {
        this.animFrame += 1;
        if (this.animFrame >= this.maxFrames)
            this.animFrame = 0;
    },
    playNext(next) {
        try {
            let songIdx = this.$refs['audioPlayer'].currentPlayIndex;
            let song = this.songList[songIdx];
            this.currentSongIndex = songIdx;
            this.currentSongTitle = song.title || ' ';
            this.currentSongArtist = song.artist || ' ';
            this.currentSongAlbum = song.album || ' ';
        } catch (e) {
            this.currentSongTitle = 'Unknown';
            this.currentSongArtist = ' ';
            this.currentSongAlbum = ' ';
            this.currentSongIndex = 0;
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
    },
    songContainerClass(index) {
        try {
            if (index === this.currentSongIndex)
                return 'song-selected';
        }
        catch {}
        return '';
    },
    songStyle(index) {
        try {
            let choice = (index - this.animFrame) % this.maxFrames;
            return `small-dual-label-${choice+1}`;
        }
        catch {
            return 'small-dual-label-1';
        }
    }
  }
}
</script>

<style>
.root-div {
    font-size: 12pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
}
.small-dual-label-1 {
    font-size: 11pt;
    font-weight: bold;
    color: hsl(209, 70%, 85%);    
    text-shadow: -0.05em -0.2em 0.01em hsl(208, 35%, 8%);
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}
.small-dual-label-2 {
    font-size: 11pt;
    font-weight: bold;
    color: hsl(219, 70%, 85%);
    text-shadow: -0.1em 0.2em 0.01em hsl(208, 35%, 8%);
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}
.small-dual-label-3 {
    font-size: 11pt;
    font-weight: bold;
    color: hsl(190, 75%, 90%);    
    text-shadow: 0.15em 0.2em 0.01em hsl(208, 35%, 8%);
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}
.small-dual-label-4 {
    font-size: 11pt;
    font-weight: bold;
    color: hsl(120, 60%, 90%);    
    text-shadow: -0.15em 0.15em 0.01em hsl(208, 35%, 8%);
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}
.small-dual-label-5 {
    font-size: 11pt;
    font-weight: bold;
    color: hsl(170, 70%, 85%);
    text-shadow: -0.1em -0.15em 0.01em hsl(208, 35%, 8%);
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}
.small-dual-label-6 {
    font-size: 11pt;
    font-weight: bold;
    color: hsl(245, 40%, 90%);
    text-shadow: -0.2em -0.1em 0.01em hsl(208, 35%, 8%);
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}
</style>

<style scoped>
.under {
    text-decoration: underline;
}
.player-section {
    /* border: 2px solid #e6e6e6; */
    
    border-radius: 2rem; padding: 15px; margin-bottom: 2rem;

    background-size: cover;
    background-position-y: bottom;
    background-attachment: fixed;    
    background-image: url('mp3/stochastic recovery 20x6/cover-art-stochastic-recovery-20x6-album.jpg');
}
.small-label {
    font-size: 85%;
}
.root-div {
    margin: 20px;
    text-align: center;
    position: relative;
    
    
    /* 
    background-image: url('mp3/stochastic recovery 20x6/cover-art-stochastic-recovery-20x6-album.jpg');
    */
}
.album-label {
    
    
    

    position: relative;
    
    padding: 0.5em;
    border-radius: 0.5em;
    
}
.album-label > span {
    position: relative;
    top: -0.6em;
    opacity: 60%;

    font-size: 200%;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    color: hsl(209, 35%, 95%);
    text-shadow: 0.15em 0.58em 0.01em rgba(15, 15, 80, 0.8);
    font-weight: bolder;
}
.song-label {
    color: hsl(208, 65%, 65%);
    text-shadow: 0.2em 0.2em 0.01em hsl(208, 35%, 8%);
    font-weight: bold;
}
.song-title {
    
}
.song-artist {
    opacity: 75%;
}

.playlist-section {
    padding: 0.5em 0.5em 5em 0.5em;
    border-radius: 0.5em;
    box-shadow: inset 0px 50px 50px 20px black;
    background-size: 100% auto;
    background-position-y: 80%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position-x: center;
    background-position-y: bottom;
    background-attachment: fixed; 
    background-image: url('mp3/stochastic recovery 20x6/cover-art-stochastic-recovery-20x6-album.jpg');
}
.song-selected {
    margin-top: -1.5px;
    margin-bottom: -1.5px;
    border: .15em dashed white;
    border-collapse: collapse;
    background: rgba(72, 156, 229, 0.25);
    border-radius: 0.5em;
}

</style>