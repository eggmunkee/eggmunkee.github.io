<script setup>
import EgPglayer from '../components/EgPglayer.vue'

import Song from '../components/Song.vue'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_stash.json';

</script>

<template>
    <div class="root-div">
        

        <div class="player-section">
            <h1>
                <template v-if="currentSongTitle">
                    {{ currentSongTitle }}
                </template>
                <template v-else>
                    Stash
                </template>
            </h1>
            
            <eg-pglayer 
                theme-color="themeColor" 
                :selected-song="currentSong"
                :prev-restart-sec="3"
                @play-click="playClick"
                @previous-click="prevClick"
                @next-click="nextClick"
                @status="updateSongStatus"
                @play-start="updateSongStatus"
                @play-pause="updateSongStatus"
                @play-ended="playEnded"
                @mute-change="muteChanged"
                @loop-change="loopChanged"    
            ></eg-pglayer>

            <div class="playlist-section">
                <h1>
                    Songs
                </h1>
                <ul>
                    <li>
                        <a @click.prevent="shuffleTracks" href="#">Shuffle</a>
                    </li>
                    <li :style="{'border-bottom': '1px dashed ' + themeColor}">
                        <a @click.prevent="unshuffleTracks" href="#">Unshuffle</a>
                    </li>
                    <li v-for="(song, songIndex) in songList" :key="song.src">
                        <span @dblclick="playThisSong(songIndex)" style="cursor:pointer" :style="{color: currentSongIndex==songIndex ? '#66FF00' : ''}">   
                            {{ song.title }}
                        </span>
                    </li>
                </ul>
            </div>
            
        </div>
    </div>

</template>

<script>

export default {
    data() {
        return {
            themeColor: '#F02020',
            currentSongIndex: 0,
            currentSongTitle: '',
            currentSongArtist: '',
            currentSongAlbum: 'Scrap',
            currentSong: null,
            // Configuration
            songList: [
                {
                    title: 'none',
                    album: '',
                    artist: '',
                    src: ''
                }
            ],
            playerSongStatus: null,
            loopAll: true,
            loopOne: false,
            muted: false
        }
    },
    mounted() {
        this.unshuffleTracks();
    },
    unmounted() {
    },
    methods: {
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
        setSongIndex(songIndex) {
            if (songIndex >= 0 && songIndex < this.songList.length) {
                let song = this.songList[songIndex];
                this.currentSongIndex = songIndex;
                this.currentSong = song;
                this.currentSongArtist = song.artist;
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
            if (!this.loopOne) {
                if (this.loopAll || this.currentSongIndex < this.songList.length - 1)
                    this.nextClick();
            }
        },
        prevClick() {
            let currSongIndex = this.currentSongIndex - 1;
            if (currSongIndex < 0) {
                currSongIndex = this.songList.length - 1;
            }
            this.setSongIndex(currSongIndex);
        },
        nextClick() {
            let currSongIndex = this.currentSongIndex + 1;
            if (currSongIndex >= this.songList.length) {
                currSongIndex = 0;
            }
            this.setSongIndex(currSongIndex);
        },
        playClick() {
            this.setSongIndex(this.currentSongIndex);
        },
        updateSongStatus(status) {
            this.playerSongStatus = status;
        },
        muteChanged(muteState) {
            this.muted = muteState;
        },
        loopChanged(loopState) {
            let { loopAll, loopOne } = loopState;
            this.loopAll = loopAll;
            this.loopOne = loopOne;
            //console.log("Loop all", loopAll, "Loop One", loopOne);
        }
    }
}
</script>

<style scoped>
    .root-div {
        text-align: center;
        padding: 1em;
        color: #F02020;
    }
    .player-section {
        border-radius: 1em;
        border: 2px solid darkred;
        background: rgba(35,0,0,.7);
        padding: 1.5em;
    }
    .playlist-section {
        text-align:left;
        padding: 1em;
    }
    .playlist-section h1 {
        text-align: left;
        margin: 0 1em;
        padding: 0 0;
    }
</style>