<script setup>
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_stochastic_recovery_20x6.json';
</script>



<template>
<div class="root-div">
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
            <div class="song-title medium-dual-label" :class="songStyle(1, false)">{{currentSongTitle}}</div>
            <div class="song-artist medium-dual-label" :class="songStyle(5, false)">
                <span v-show="currentSongArtist">by {{currentSongArtist}}</span>
            </div>
        </div>
    </div>
    
    <div class="playlist-section">
        <h2 class="medium-dual-label" :class="songStyle(0, false)">
            Songs ({{songList.length}})
            <label class="small-dual-label" :class="songStyle(4, false)"><a href="#" @click.prevent="shuffleTracks">Shuffle</a></label>
        </h2>
        <div class="song-list" ref="songContainer">
            <div v-for="(song, songIndex) in songList" :key="song.src" :class="songContainerClass(songIndex)">
                <Song :url="song.src" :title="song.title" :title-class="songStyle(songIndex, true)" :muted="true" />
            </div>
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
        currentSongArtist: 'eggmunkee',
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
            this.scrollCurrentSongIntoView();
        } catch (e) {
            this.currentSongTitle = 'Unknown';
            this.currentSongArtist = ' ';
            this.currentSongAlbum = ' ';
            this.currentSongIndex = 0;
        }

        next() // Start play
    },
    scrollCurrentSongIntoView() {
        try {
            const viewportHeight = window.innerHeight;
            if (viewportHeight < 600) return;
            let songIdx = this.currentSongIndex;
            let sc = this.$refs["songContainer"] || null;
            if (sc && sc.children && sc.children.length > 0) {
                if (songIdx < 0) songIdx = 0;
                if (songIdx >= sc.children.length) songIdx = sc.children.length - 1;
                let scItem = sc.children[songIdx] || null;
                if (scItem) {
                    scItem.scrollIntoView({block: "nearest", inline: "nearest", behavior: "smooth"});
                }
            }
        }
        catch {}
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
                return 'song-entry song-selected';
            else
                return 'song-entry';
        }
        catch {
            return 'song-entry';
        }
    },
    songStyle(index, addBaseClass) {
        try {
            let choice = (index + this.animFrame) % this.maxFrames;
            return (addBaseClass ? 'small-dual-label ' : '') + `dual-label-${choice+1}`;
        }
        catch {
            return (addBaseClass ? 'small-dual-label ' : '') + 'dual-label-1';
        }
    }
  }
}
</script>

<style>
.root-div {
    font-size: 14pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
}
.small-dual-label {
    font-size: 12pt;
    font-weight: bolder;
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}

.medium-dual-label {
    font-size: 14pt;
    font-weight: bolder;
    line-height: 1.1;
    transition-property: 'text-shadow', 'color';
    transition-duration: 3s;
}

.dual-label-1 {
    color: hsl(209, 70%, 85%);    
    text-shadow: -0.05em -0.2em 0.01em hsl(208, 35%, 8%);
}
.dual-label-2 {
    color: hsl(219, 70%, 85%);
    text-shadow: -0.1em 0.2em 0.01em hsl(208, 35%, 8%);
}
.dual-label-3 {
    color: hsl(190, 75%, 90%);    
    text-shadow: 0.15em 0.2em 0.01em hsl(208, 35%, 8%);
}
.dual-label-4 {
    color: hsl(120, 60%, 90%);    
    text-shadow: -0.15em 0.15em 0.01em hsl(208, 35%, 8%);
}
.dual-label-5 {
    color: hsl(170, 70%, 85%);
    text-shadow: -0.1em -0.15em 0.01em hsl(208, 35%, 8%);
}
.dual-label-6 {
    color: hsl(245, 40%, 90%);
    text-shadow: -0.2em -0.1em 0.01em hsl(208, 35%, 8%);
}
</style>

<style scoped>
.under {
    text-decoration: underline;
}
.player-section {
    /* border: 2px solid #e6e6e6; */
    
    border-radius: 2rem; padding: 15px; margin-bottom: 2rem;
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);

    background-size: cover;
    background-position-y: bottom;
    background-attachment: fixed;    
    background-image: url('/mp3/stochastic recovery 20x6/cover-art-stochastic-recovery-20x6-album.jpg');
}
.small-label {
    font-size: 85%;
}
.root-div {
    margin: 20px;
    text-align: center;
    position: relative;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
    
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
    top: -0.35em;
    opacity: 60%;

    font-size: 200%;
    
    color: hsl(209, 35%, 95%);
    text-shadow: 0.15em 0.58em 0.01em rgba(15, 15, 80, 0.8);
    font-weight: bolder;
    line-height: 0.85;
}
.song-label {
    font-size: 17pt;
    /* color: hsl(208, 65%, 65%);
    text-shadow: 0.2em 0.2em 0.01em hsl(208, 35%, 8%); */
    font-weight: bolder;
}
.song-title {
    font-size: 17pt;
    /* color: hsl(208, 65%, 65%);
    text-shadow: 0.2em 0.2em 0.01em hsl(208, 35%, 8%); */
    font-weight: bolder;
    line-height: 1.1;
}
.song-artist {
    opacity: 75%;
    font-size: 14pt;
    /* color: hsl(208, 65%, 65%);
    text-shadow: 0.2em 0.2em 0.01em hsl(208, 35%, 8%); */
    font-weight: bolder;
}

.playlist-section {
    padding: 0.5em 0.5em 0.5em 0.5em;
    border-radius: 2rem; 
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);
    background-size: 100% auto;
    background-position-y: 80%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position-x: center;
    background-position-y: bottom;
    background-attachment: fixed; 
    background-image: url('/mp3/stochastic recovery 20x6/cover-art-stochastic-recovery-20x6-album.jpg');    
}

.playlist-section .song-list {
    /* limit vertical height with scroll */
    max-height: 20em;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 5px;
    margin-bottom: 1em;

    /* scrollbar-width: 0.5; /* Hides scrollbar in Firefox and modern Chrome/Edge */
    /* scrollbar-color: rgba(255,255,255,0.5); /* Mutes colors in Firefox */
}
.playlist-section .song-list::-webkit-scrollbar {
  /* width: 1em; /* Hides vertical scrollbar width */
  /* height: 0;  Hides horizontal scrollbar height */
}

.playlist-section .song-list::-webkit-scrollbar {
    height: 12px;
    width: 12px;
    background: rgba(30,30,30,.3);
}

.playlist-section .song-list::-webkit-scrollbar-thumb {
    background: rgba(206, 228, 248, 0.664);
    -webkit-border-radius: 1ex;
    -webkit-box-shadow: 0px 1px 2px rgba(20, 20, 80, 0.75);
}

.playlist-section .song-list::-webkit-scrollbar-corner {
    background: rgba(30,30,30,.5);
}


.song-entry {
    border: .15em solid rgba(255,255,255,0);
    border-collapse: collapse;
    border-radius: 0.5em;
    margin-top: -.075em;
    margin-bottom: -0.075em;
}

.song-selected {
    margin-top: 0;
    margin-bottom: 0;
    border: .15em dashed white;
    border-collapse: collapse;
    background: rgba(72, 156, 229, 0.25);
    border-radius: 0.75em;
}

</style>