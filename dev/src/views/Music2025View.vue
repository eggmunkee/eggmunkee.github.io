<script setup>
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_2025.json';
</script>

<template>
<div class="root-div">    
    <div class="player-section" style="" >
        <h4 class="inner-title">EGGMUNKEE MUSIC OCT 2025</h4>
        <vue-audio-player ref="audioPlayer"
            :audio-list="songList"
            theme-color="hsl(208, 75%, 80%)"
            :before-play="playNext"
            :progress-interval="500"
            @pause="playEnded"
        ></vue-audio-player>
        <div class="song-label">
            <div class="song-title">{{currentSongTitle}}</div>
            <div class="song-artist">
                <span v-show="currentSongArtist">by {{currentSongArtist}}</span> <span v-show="currentSongAlbum">[{{currentSongAlbum}}]</span>
            </div>
        </div> <!-- :before-play="playNext" -->
    </div>
    
    <div class="playlist-section">
        <h3>
            <span class="box-shadow">
                <span class="playlist-title">Songs ({{songList.length}})</span>
            </span>
            <span class="icon-cont-shadow">
                <a href="#" class="small-label shadow shuffle-icon" 
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
        currentSongAlbum: 'Assorted',
        // Configuration
        songList: initialSongList,
        initialSongs: initialSongList,
        // play next state
        queueSongByIndex: false,
        nextSongIndex: 0
    }
  },
  mounted() {
    try {
        document.getElementsByTagName('body')[0].classList.remove('bg-wavy-blue-verydark');
        document.getElementsByTagName('body')[0].classList.add('bg-wavy-blue-dark');

        const overlay1 = document.getElementsByClassName('overlay-z1')[0];
        const overlay2 = document.getElementsByClassName('overlay-z2')[0];
        const overlay3 = document.getElementsByClassName('overlay-z3')[0];
        this.removeBgClasses(overlay3);
        this.removeBgClasses(overlay2);
        this.removeBgClasses(overlay1);
        let cl = overlay1.classList;
        cl.add('bg-base');
        cl.add('bg-wavy-blue-dark');

        setTimeout(function() { 
            overlay3.classList.add('overlay-z3-12');
        }, 100);
    }
    catch (e) {}
  },
  methods: {
    removeBgClasses(elem) {
        let cl = elem.classList;
        for (let c = 0; c < cl.length; c++) {
            let className = cl[c];
            if (className.startsWith('bg-')) {
                cl.remove(className);
                c--;
            }
        }
    },
    playThisSong(songIndex) {
        console.log("Play song", songIndex);
        try {
            let player = this.$refs['audioPlayer'];
            if (player.currentPlayIndex != songIndex) {
                this.queueSongByIndex = true;
                this.nextSongIndex = songIndex;
                player.pause();
                //this.playEnded();
            }
            else {
                player.play();
            }
        }
        catch (e) {
            console.error(e);
        }
    },
    playEnded() {
        if (this.queueSongByIndex) {
            this.$nextTick(function() {
            try
            {
                let player = this.$refs['audioPlayer'];
                if (player) {
                    player.currentPlayIndex = this.nextSongIndex - 1;
                    player.playNext();
                }
                this.queueSongByIndex = false;
                this.nextSongIndex = 0;
            }
            catch (e) { console.error(e); }
            });
        }
    },
    playNext(next) {
        try {
            let songIdx = this.$refs['audioPlayer'].currentPlayIndex;
            let song = this.songList[songIdx];
            this.currentSongIndex = songIdx;
            this.currentSongTitle = song.title || ' ';
            // this.currentSongArtist = song.artist || ' ';
            this.currentSongAlbum = song.album || ' ';
            this.scrollCurrentSongIntoView();
        } catch (e) {
            this.currentSongTitle = 'Unknown';
            this.currentSongArtist = ' ';
            this.currentSongAlbum = e.message;
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
    originalOrderTracks() {
        console.warn("ordering...");
        // let songs = this.initialSongs;
        // while( this.songList.length > 1) {
        //     this.songList.pop();
        // };
        // this.$nextTick(function() {
        // for (let i = 0; i < songs.length; i++) {
        //     this.songList.push(songs[i]);
        // }
        // });
        //this.songList = this.initialSongs; //.splice(0, this.initialSongs.length, [...this.initialSongs]);
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
    }
  }
}
</script>

<style>
.vue-audio-player__play-rate {
    visibility: hidden;
}
body.bg-wavy-blue-dark {
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