<script setup>
import EgPglayer from '../components/EgPglayer.vue'

import Song from '../components/Song.vue'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_2025.json';
</script>

<template>
<div class="root-div">    
    <div class="player-section" style="" >
        <h4 class="inner-title">MUSIC COLLECTION <span class="minor-slash">/</span> OCT. 2025</h4>
        <eg-pglayer 
            play-content="&bullet;" pause-content="&bullet;"
            left-content="((" right-content="))"
            theme-color="hsl(208, 75%, 80%)" 
            :prev-restart-sec="3"
            :selected-song="currentSong"
            :artwork="'/assets/art/wavy-blue.jpg'"
            @play-click="playClick"
            @previous-click="prevClick"
            @next-click="nextClick"
            @status="updateSongStatus"
            @play-ended="playEnded"
            @mute-change="muteChanged"
            @loop-change="loopChanged"
        ></eg-pglayer>
        <div class="song-label">
            <span class="song-title">{{currentSongTitle}}</span>
            <span class="song-artist" v-if="currentSongArtist || currentSongAlbum">
                &bullet; <span v-if="currentSongArtist">by {{currentSongArtist}}</span> <span v-if="currentSongAlbum">{{currentSongAlbum}}</span>
            </span>
        </div>
    </div>
    
    <div class="playlist-section">
        <h3>
            <span class="icon-cont-shadow">
                <a href="#" class="small-label shadow order-icon" title="original song order" 
                 style="color: rgb(100, 156, 200)" @click.prevent="unshuffleTracks">
                </a>
            </span>
            <span class="box-shadow">
                <span class="playlist-title">Songs ({{songList.length}})</span>
            </span>
            <span class="icon-cont-shadow">
                <a href="#" class="small-label shadow shuffle-icon" title="shuffle song order" 
                 style="color: rgb(100, 156, 200)" @click.prevent="shuffleTracks">                    
                </a>
            </span>
        </h3>
        <div class="song-list" ref="songContainer">
            <div v-for="(song, songIndex) in songList" :key="song.src" :class="songContainerClass(songIndex)">
                <Song :url="song.src" :title="song.title" :album="song.album" @title-dblclick="playThisSong(songIndex)"
                    title-class="song-title-style" album-class="song-album-style" :show-player="false" :show-download="true" />
            </div>
        </div>
    </div>

    <div class="centered-div">
        <div class="instructions blue over-bg-shadow over-bg-area-shadow">
            double click to play a song <span class="minor-slash">/</span> click <span class="download-icon blue-dimmed-bg">&nbsp;</span> icon to download
        </div>
    </div>

</div>
</template>

<script>
export default {
  data() {
    return {
        // State        
        currentSongIndex: 0,
        currentSongTitle: 'Collection from October 2025',
        currentSongArtist: '',
        currentSongAlbum: 'Assorted Music',
        currentSong: null,
        // Configuration
        songList: [],
        // play next state
        loopAll: true,
        loopOne: false,
        queueSongByIndex: false,
        nextSongIndex: 0,
        bodyRefs: {
            appDiv:null, overlay1: null, overlay2: null, overlay3: null
        }
    }
  },
  mounted() {
    try {
        this.bodyRefs.appDiv = document.getElementById('app');
        this.bodyRefs.overlay1 = document.getElementsByClassName('overlay-z1')[0];
        this.bodyRefs.overlay2 = document.getElementsByClassName('overlay-z2')[0];
        this.bodyRefs.overlay3 = document.getElementsByClassName('overlay-z3')[0];
        const overlay1 = document.getElementsByClassName('overlay-z1')[0];
        const overlay2 = document.getElementsByClassName('overlay-z2')[0];
        const overlay3 = document.getElementsByClassName('overlay-z3')[0];
        overlay1.style.display = '';
        overlay1.style.background = '';
        overlay2.style.display = '';
        overlay2.style.background = '';
        overlay3.style.display = '';
        this.removeBgClasses(overlay3);
        this.removeBgClasses(overlay2);
        this.removeBgClasses(overlay1);
        let cl = overlay1.classList;
        cl.add('bg-wavy-blue-dark');

        setTimeout(function() { 
            overlay3.classList.add('overlay-z3-12');
        }, 100);

        this.unshuffleTracks();
    }
    catch (e) {}
  },
  methods: {
    removeBgClasses(elem) {
        let cl = elem.classList;
        cl.remove('overlay-hidden');
        cl.remove('overlay-z3-12');
        cl.remove('overlay-z3-25');
        cl.remove('overlay-z3-35');
        cl.remove('overlay-z3-tint-max');
        cl.remove('overlay-night-mode');
        for (let c = 0; c < cl.length; c++) {
            let className = cl[c];
            
            if (className.startsWith('bg-')) {
                cl.remove(className);
                c--;
            }
        }
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
    unshuffleTracks() {
        let songs = [];
        //console.log(initialSongList);
        for (let i = 0; i < initialSongList.length; i++) {
            songs.push(initialSongList[i]);
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

    setSongIndex(songIndex) {
        if (songIndex >= 0 && songIndex < this.songList.length) {
            let song = this.songList[songIndex];
            this.currentSongIndex = songIndex;
            this.currentSong = song;
            this.currentSongArtist = '';
            this.currentSongAlbum = song.album;
            this.currentSongTitle = song.title;

        }
    },
    playThisSong(songIndex) {
        try {
            this.setSongIndex(songIndex);
        }
        catch (e) {
            console.error(e);
        }
    },
    playStarted() {
    },
    playEnded() {
        // player will loop same track on its own, otherwise, see if we should continue
        if (!this.loopOne) {
            if (this.loopAll || this.currentSongIndex < this.songList.length - 1)
                this.nextClick();
        }
    },
    prevClick() {
        //console.log("Previous");
        let currSongIndex = this.currentSongIndex - 1;
        if (currSongIndex < 0) {
            currSongIndex = this.songList.length - 1;
        }
        this.setSongIndex(currSongIndex);
        this.scrollCurrentSongIntoView();
    },
    nextClick() {
        //console.log("Next");
        let currSongIndex = this.currentSongIndex + 1;
        if (currSongIndex >= this.songList.length) {
            currSongIndex = 0;
        }
        this.setSongIndex(currSongIndex);
        this.scrollCurrentSongIntoView();
    },
    playClick() {
        this.setSongIndex(this.currentSongIndex);
        this.scrollCurrentSongIntoView();
    },
    updateSongStatus(status) {
        //console.log(status);
    },
    muteChanged(muteState) {

    },
    loopChanged(loopState) {
        let { loopAll, loopOne } = loopState;
        this.loopAll = loopAll;
        this.loopOne = loopOne;
        console.log("Loop all", loopAll, "Loop One", loopOne);
    }
  }
}
</script>

<style>
.bg-wavy-blue-dark {
    background-size: 100% auto;
    background-position-y: 80%;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position-x: center;
    background-position-y: bottom;
    background-attachment: fixed; 
    background-image: url('/assets/art/wavy-blue-dark.jpg');
}
.song-title-style {
    color: hsl(208, 75%, 85%);
    font-size: 12pt;
    text-shadow: -0.05em 0.075em 0.5em rgba(0,0,0,.5);
}
.song-album-style {
    color: hsl(208, 55%, 75%);
    font-size: 10pt;
    margin-left: 0.5em;
    text-shadow: -0.05em 0.075em 0.5em rgba(0,0,0,.5);
}
</style>
<style scoped>
.under {
    text-decoration: underline;
}

.inner-title {
    margin-bottom: 1em; 
    margin-top: .5em;
}

.small-label {
    font-size: 85%;
}

.root-div {
    margin: 20px 0;
    text-align: center;
    font-size: 12pt;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.player-section {
    border: 1px solid #e6e6e6; 
    padding: 15px; 
    margin-bottom: 2rem;
    color: hsl(208, 75%, 80%);
    border-radius: 2rem; padding: 15px; margin-bottom: 2rem;

    text-shadow: -0.05em 0.05em 0.5em rgba(0,0,0,.5);
    
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);
    background-size: cover;
    background-position-y: bottom;
    background-attachment: fixed;    
    background-image: url('/assets/art/wavy-blue.jpg');
}

.song-label {
    color: hsl(208, 75%, 59%);
    color: hsl(208, 75%, 80%);
    font-weight: bold;
}

.song-title {
    color: hsl(208, 75%, 80%);
    font-weight: bolder;
}

.song-artist {
    color: hsl(208, 75%, 80%);
    opacity: 75%;
    font-weight: bold;
}

.playlist-section {
    border: 1px solid #e6e6e688; 
    padding: 0.15em 0.15em 0.15em 0.15em;
    border-radius: 2rem; 
    
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);
    background-size: cover;
    background-position-y: bottom;
    background-attachment: fixed;    
    background-image: url('/assets/art/wavy-blue.jpg');
}

.playlist-title {
    font-size: 12pt;
    padding: 0 1em 0 1em;
}

.playlist-section .song-list {
    /* limit vertical height with scroll */
    max-height: 28em;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 5px;
    /*margin: 0.1em 0.05em 0.5em 0.05em;*/
    margin: 0.1em 0.5em 0.5em 0.5em;
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

/* Song Container Classes */

.song-entry {
    border: .15em solid rgba(255,255,255,0);
    border-collapse: collapse;
    border-radius: 0.5em;
    margin-top: -.075em;
    margin-bottom: -.075em;
    padding: 0.25em 0 0.25em 0;
}

.song-selected {
    margin-top: 0;
    margin-bottom: 0;
    border: .15em dashed white;
    border-collapse: collapse;
    background: rgba(72, 156, 229, 0.25);
    border-radius: 0.75em;
}

/* Playlist outer UI */

.playlist-title {
    font-size: 12pt;
    padding: 0 1em 0 1em;
    opacity: 0.8;
}

/* Shadowing styles */

.shadow {
    text-shadow: -0.05em 0.05em 0.5em rgba(0,0,0,.5);
}


.box-shadow {
    background: rgba(60,90,130,0.2);
    border-radius: 0.5em;
    box-shadow: 0 0 .3em .3em rgba(60,90,130,0.2);
}


.icon-cont-shadow {
    background: rgba(60,90,130,0.3);
    border-radius: 0.5em;
    box-shadow: 0 0 .2em .3em rgba(60,90,130,0.3);
}

.shuffle-icon {
  /* Set dimensions */
  width: 0.8em;
  height: 0.8em;
  display: inline-block;
  vertical-align: baseline;
  
  /* Set the desired color */
  background-color: hsl(208, 75%, 80%); 
  
  /* Apply the image as a mask */
  -webkit-mask-image: url('/assets/icon-shuffle.png');
  mask-image: url('/assets/icon-shuffle.png');
  
  /* Ensure the mask covers the element */
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}

.letter-icon {
    font-size: 12pt;
    position: relative;
    top: 0.05em; 
    padding: 0.05em;
    color: rgb(100, 156, 200); 
    font-weight:bolder;
    line-height: 1;
    
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}

.order-icon {
  /* Set dimensions */
  width: 0.8em;
  height: 0.8em;
  display: inline-block;
  vertical-align: baseline;
  
  /* Set the desired color */
  background-color: hsl(208, 75%, 80%); 
  
  /* Apply the image as a mask */
  -webkit-mask-image: url('/assets/icon-order.png');
  mask-image: url('/assets/icon-order.png');
  
  /* Ensure the mask covers the element */
  -webkit-mask-size: contain;
  mask-size: contain;
  -webkit-mask-repeat: no-repeat;
  mask-repeat: no-repeat;
  -webkit-mask-position: center;
  mask-position: center;
}
</style>