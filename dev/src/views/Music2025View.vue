<script setup>
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_2025.json';
</script>



<template>
<div class="root-div">    
    <div class="player-section" style="border: 2px solid #e6e6e6; border-radius: 2rem; padding: 15px; margin-bottom: 2rem;" >
        <h4 class="under inner-title">EGGMUNKEE MUSIC</h4>
        <vue-audio-player ref="audioPlayer"
            :audio-list="songList"
            theme-color="hsl(208, 75%, 80%)"
            :before-play="playNext"
            :progress-interval="500"
        ></vue-audio-player>
        <div class="song-label">
            <div class="song-title">{{currentSongTitle}}</div>
            <div class="song-artist">
                <span v-show="currentSongArtist">by {{currentSongArtist}}</span> <span v-show="currentSongAlbum">[{{currentSongAlbum}}]</span>
            </div>
        </div> <!-- :before-play="playNext" -->
    </div>
    
    <div class="playlist-section">
        <h2>
            Songs ({{songList.length}})
            <label class="small-label"><a href="#" @click.prevent="shuffleTracks">Shuffle</a></label>
        </h2>
        <div class="song-list" ref="songContainer">
            <div v-for="(song, songIndex) in songList" :key="song.src" :class="songContainerClass(songIndex)">
                <Song :url="song.src" :title="song.title" :album="song.album" />
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
        currentSongTitle: '',
        currentSongArtist: 'Eggmunkee',
        currentSongAlbum: '',
        // Configuration
        songList: initialSongList
    }
  },
  methods: {
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

<style scoped>
.under {
    text-decoration: underline;
}
.inner-title {margin-bottom: .5em; margin-top: .5em;}
.small-label {
    font-size: 85%;
}
.root-div {
    margin: 20px;
    text-align: center;
    font-size: 12pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
}
.player-section {
    color: hsl(208, 75%, 80%);
    border-radius: 2rem; padding: 15px; margin-bottom: 2rem;
    background: rgba(72, 156, 229,0.7);
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);
}
.song-label {
    color: hsl(208, 75%, 59%);
    color: hsl(208, 75%, 80%);
    font-weight: bold;
}
.song-title {
    color: hsl(208, 75%, 80%);
    font-weight: bold;
}
.song-artist {
    color: hsl(208, 75%, 80%);
    opacity: 75%;
    font-weight: bold;
}
.playlist-section {
    padding: 0.5em 0.5em 0.5em 0.5em;
    border-radius: 2rem; 
    background: rgba(72, 156, 229,0.5);
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);
}
.playlist-section .song-list {
    /* limit vertical height with scroll */
    max-height: 20em;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 5px;
    margin-bottom: 1em;
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
}

.song-selected {
    margin-top: -1.5px;
    margin-bottom: -1.5px;
    border: .15em dashed white;
    border-collapse: collapse;
    background: rgba(72, 156, 229, 0.25);
    border-radius: 0.75em;
}
</style>