<script setup>
import EgPglayer from '../components/EgPglayer.vue'
import SongList from '../data/song-list.js'

// Import the song list JSON file
import stashSongList from '../data/musicPlaylist_stash.json';
import stochastSongList from '../data/musicPlaylist_stochastic_recovery_20x6.json';
import earlierSongList from '../data/musicPlaylist_2025.json';

</script>

<template>
    <div class="root-div" :class="{hid:bgStat}">
        <div v-if="bgStat" class="corner-ui" @click.prevent="bgm(100)">
            <a>X</a>
        </div>
        <div class="player-section">
            <h1 style="line-height:1.2">
                <template v-if="currentSongTitle">
                    {{ currentSongTitle }}
                </template>
                <template v-else>
                    Stash
                </template>

                <template v-if="currentSongAlbum && currentSongAlbum != 'stash'">
                    <sub style="margin-left: 1.5em">{{ currentSongAlbum }}</sub>
                </template>
            </h1>
            
            <eg-pglayer 
                :theme-color="themeColor" 
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
                    Songs <sub>{{ songList.length }}</sub>
                </h1>
                <ul>
                    <li :style="{'border-bottom': currentSongIndex != 0 ? ('1px dashed ' + themeColor) : ''}">
                        <a @click.prevent="shuffleTracks" href="#">Shuffle</a>
                    </li>
                </ul>
                <ul class="song-list" ref="songContainer" :class="{empty:songList.length == 0}">
                    <li v-for="(song, songIndex) in songList" :key="song.src"
                        :style="{
                            'border-top': currentSongIndex==songIndex ? ('1px dashed ' + themeColor) : '',
                            'border-bottom': currentSongIndex==songIndex ? ('1px dashed ' + themeColor) : ''
                        }">
                        <span style="float:right; cursor:pointer; padding: 0 .5em" @click="removeThisSong(songIndex)">&bullet;</span>
                        <span @dblclick="playThisSong(songIndex)" style="cursor:pointer" :style="{color: currentSongIndex==songIndex ? '#66FF00' : ''}"
                            v-html="decoTitle(song.title, songIndex)">
                        </span>
                    </li>
                </ul>
                <ul>
                    <li :style="{'border-top': currentSongIndex != songList.length - 1 ? ('1px dashed ' + themeColor) : ''}">
                        <a @click.prevent="addEarlier" href="#">+ 2025</a>
                    </li>
                    <li>
                        <a @click.prevent="addStochast" href="#">+ Stochastic Recovery 20x6</a>
                    </li>
                    <li>
                        <a @click.prevent="addStash" href="#">+ Stash</a>
                    </li>
                    <li :style="{'border-top': '1px dashed ' + themeColor }">
                        <a @click.prevent="clearPlaylist" href="#">Clear Playlist</a>
                    </li>
                    <li>
                        <a @click.prevent="filterMegagongTracks(true)" href="#">- Filter Megagong</a>
                    </li>
                </ul>
            </div>
            
        </div>
    </div>

</template>

<script>

export default {
    mixins: [
        SongList
    ],
    data() {
        return {
            imgUrls: [],
            themeColor: '#F02020',
            currentSongIndex: 0,
            currentSongTitle: '',
            currentSongArtist: '',
            currentSongAlbum: 'stash',
            currentSong: null,
            // Configuration
            songList: [],
            stochastSongList: stochastSongList,
            earlierSongList: earlierSongList,
            stashSongList: stashSongList,
            playerSongStatus: null,
            loopAll: true,
            loopOne: false,
            muted: false,
            animTimer: -1,
            currSrc: '',
            currSrc2: '',
            srcIdx: 0,
            bgPlus: 0,
            bgMinus: 0,
            bgStat: false
        }
    },
    mounted() {
        this.unshuffleTracks('stash');
        this.loadImgs();
        
        let o1 = document.getElementsByClassName('overlay-z1')[0];
        let o2 = document.getElementsByClassName('overlay-z2')[0];
        let o3 = document.getElementsByClassName('overlay-z2')[0];
        o1.classList.remove('bg-base')
        o2.classList.remove('bg-base')
        o3.classList.remove('bg-base')
        if (!o1.classList.contains('bg-base-stash')) o1.classList.add('bg-base-stash');
        if (!o2.classList.contains('bg-base-stash')) {
            o2.classList.add('bg-base-stash');
            o2.classList.add('bg-transp-stash');
        }
        if (!o3.classList.contains('bg-base-stash')) {
            o3.classList.add('bg-base-stash');
            o3.classList.add('bg-transp-stash');
        }
        o1.style.display = 'none';
        o2.style.display = 'none';
        o3.style.display = 'none';
        
    },
    unmounted() {
        if (this.animTimer != -1) {
            clearInterval(this.animTimer);
        }
    },
    methods: {
        showBg() {
            let vm = this;
            if (this.animTimer != -1) {
                clearInterval(this.animTimer);
                this.animTimer = -1;
            }
            this.animTimer = setInterval(function() {
                vm.anim();
            }, 7500);
            this.$nextTick(function() {
                this.anim();
            });

            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            o1.style.display = '';
            o2.style.display = '';
            o3.style.display = '';
            o1.classList.add('bg-base-stash')
            o1.classList.add('bg-transp-stash')
            o2.classList.add('bg-base-stash')
            o2.classList.add('bg-transp-stash')
            o3.classList.add('bg-base-stash')
            o3.classList.add('bg-transp-stash')
            this.bgStat = true;
        },
        hideBg() {
            if (this.animTimer != -1) {
                clearInterval(this.animTimer);
                this.animTimer = -1;
            }
            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            o1.style.display = 'none';
            o2.style.display = 'none';
            o3.style.display = 'none';
            o1.classList.remove('bg-base-stash')
            o1.classList.remove('bg-transp-stash')
            o1.classList.remove('high')
            o2.classList.remove('bg-base-stash')
            o2.classList.remove('bg-transp-stash')
            o2.classList.remove('high')
            o3.classList.remove('bg-base-stash')
            o3.classList.remove('bg-transp-stash')
            o3.classList.remove('high')
            this.bgStat = false;
        },
        anim() {
            try {
                this.srcIdx += 1;
                if (this.srcIdx >= 6) // 3)
                    this.srcIdx = 0;

                let imgIdx = Math.floor(Math.random() * this.imgUrls.length);
                let src = this.imgUrls[imgIdx];
                let prefix = '../../../docs';
                if (src.indexOf(prefix) == 0) {
                    src = src.substring(prefix.length);                    
                }
                
                this.incrementBgAnim(src);
            }
            catch (e) {
                console.error(e);
            }
            
        },
        incrementBgAnim(src) {
            let overlay = null;
            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            
            // bg overlay to set - null of none this frame
            var i = this.srcIdx;
            if (i == 0)
                overlay = o1;
            else if (i == 2)
                overlay = o2;
            else if (i == 4)
                overlay = o3;

            if (i == 0) {
                
                o1.classList.remove('bg-transp-stash');
                o2.classList.add('bg-transp-stash');
                
            }
            else if (i == 1) {
                o1.classList.add('high');
                
                
                o3.classList.remove('high');
                
            }
            else if (i == 2) {
                o3.classList.add('bg-transp-stash');
                
                o2.classList.remove('bg-transp-stash');

                
            }
            else if (i == 3) {
                
                o2.classList.add('high');
                o1.classList.remove('high');
                
            }
            else if (i == 4) {
                o1.classList.add('bg-transp-stash');
                o3.classList.remove('bg-transp-stash');
                
            }
            else if (i == 5) {
                
                
                o3.classList.add('high');
                o2.classList.remove('high');
                
            }
            
            if (overlay) {
                overlay.style.backgroundImage = 'url(' + src + ')';
            }
        },
        loadImgs() {
            let imgAssets = import.meta.glob('../../../docs/assets/art/extra2/*.{png,jpg,jpeg}');
            for (const path in imgAssets) {
                this.imgUrls.push(path);
            }
            let imgAssets2 = import.meta.glob('../../../docs/assets/art/extra/*.{png,jpg,jpeg}');
            for (const path in imgAssets2) {
                this.imgUrls.push(path);
            }
        },
        decoFn(title, repl, enc) {
            enc = enc || 's'
            const replLen = repl.length;
            let a = title.indexOf(repl);
            if (a >= 0) {
                return (a > 0 ? title.substring(0,a) + ' ' : '') + `<${enc}>${repl}</${enc}> ` + title.substring(a + replLen);
            }
            else {
                return title;
            }
        },
        decoTitle(title, index) {
            title = this.decoFn(title, 'Concrete Blog');
            title = this.decoFn(title, 'Archetypic');
            title = this.decoFn(title, 'megagong', 'u');
            title = this.decoFn(title, 'haze roar', 'u');
            title = this.decoFn(title, 'Stadium', 'i');
            title = this.decoFn(title, 'Static');
            title = this.decoFn(title, 'Rewound');
            title = this.decoFn(title, 'Rewind');
            title = this.decoFn(title, 'Shaken');
            title = this.decoFn(title, 'Serene');
            title = this.decoFn(title, 'Disruptive', 'u');
            title = this.decoFn(title, 'Detrimental');
            title = this.decoFn(title, 'Calculation', 'u');
            title = this.decoFn(title, 'Machine Envy');

            let numPrefix = '';
            if (this.songList) {
                let pad = this.songList.length.toString().length;
                numPrefix = (index + 1).toString().padStart(pad, "0");
            }

            return numPrefix + (numPrefix ? ' - ' : '') + title;
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
        
        // shuffleTracks() {
        //     let songs = this.songList;
        //     for (let i = songs.length - 1; i > 0; i--) {
        //         const j = Math.floor(Math.random() * (i + 1));
        //         [songs[i], songs[j]] = [songs[j], songs[i]];
        //     }
        //     this.songList = songs;
        // },
        // unshuffleTracks() {
        //     let songs = [];
        //     //console.log(this.stashSongList);
        //     for (let i = 0; i < this.stashSongList.length; i++) {
        //         songs.push(this.stashSongList[i]);
        //     }
        //     this.songList = songs;
        // },
        // getExisting() {
        //     let existing = {};
        //     for (let e = 0; e < this.songList.length; e++) {
        //         if (this.songList[e]) {
        //             existing[this.songList[e].src] = this.songList[e];
        //         }
        //     }
        //     return existing;
        // },
        // addStocast() {
        //     let existing = this.getExisting();
        //     for (let i = 0; i < stochastSongList.length; i++) {
        //         if (stochastSongList[i].src && !(stochastSongList[i].src in existing))
        //             this.songList.push(stochastSongList[i]);
        //     }

        // },
        // addEarlier() {
        //     let existing = this.getExisting();
        //     for (let i = 0; i < earlierSongList.length; i++) {
        //         if (earlierSongList[i].src && !(earlierSongList[i].src in existing))
        //             this.songList.push(earlierSongList[i]);
        //     }
        // },
        // addStash() {
        //     let existing = this.getExisting();
        //     for (let i = 0; i < this.stashSongList.length; i++) {
        //         if (this.stashSongList[i].src && !(this.stashSongList[i].src in existing))
        //             this.songList.push(this.stashSongList[i]);
        //     }
        // },
        // clearPlaylist() {
        //     this.songList = [];

            
        // },  
        bg_() {
            this.bgMinus = this.bgPlus = 0;
        },
        bgp() {
            this.bgMinus = 0;
            this.bgPlus += 1;
            if (this.bgPlus >= 5) {
                this.bgPlus = 0;
                this.showBg();
            }
        },
        bgm(s) {
            this.bgPlus = 0;
            this.bgMinus += s || 1;
            if (this.bgMinus >= 3) {
                this.bgMinus = 0;
                this.hideBg();
            }
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
            if (songIndex == 7) this.bgp();
            else if (songIndex == 0) this.bgm();
            else this.bg_();
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
            this.scrollCurrentSongIntoView();
        },
        nextClick() {
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

<style>
    .overlay-z1.bg-base-stash {
        opacity: 70%;
    }
    .overlay-z2.bg-base-stash {
        opacity: 45%;
    }
    .overlay-z3.bg-base-stash {
        opacity: 30%;
    }
    .overlay-z1.bg-base-stash.high {
        opacity: 90%;
    }
    .overlay-z2.bg-base-stash.high {
        opacity: 80%;
    }
    .overlay-z3.bg-base-stash.high {
        opacity: 50%;
    }
    .bg-base-stash {
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        background-position-x: center;
        background-position-y: bottom;
        background-attachment: fixed; 
        
        transition: opacity 15s ease; /* 25  30s; */
    }
    .bg-base-stash.high {
        transition: opacity 15s ease;
    }

    .overlay-z1.bg-base-stash.bg-transp-stash,
    .overlay-z2.bg-base-stash.bg-transp-stash,
    .overlay-z3.bg-base-stash.bg-transp-stash {
        opacity: 0.0;
        transition: opacity 15s ease;
    }
</style>

<style scoped>
    .root-div {
        text-align: center;
        padding: 1em;
        color: #F02020;
    }
    .player-section {
        border-radius: 1em;
        border: 2px solid darkred;
        background: /*rgba(35,0,0,.7);*/
            linear-gradient(to right, rgba(60,0,0,1), rgba(120,0,0,.5), 20%, rgba(200,0,0,.05), 80%, rgba(120,0,0,.5), rgba(60,0,0,1)),
            /*linear-gradient(to bottom, rgba(255,255,255,.12), 20%, rgba(60,255,60,0.08), 80%, rgba(255,255,255,.12))*/
            radial-gradient(circle, rgba(60,255,60,0.25), 3%, rgba(30,215,30,0.1), 20%, transparent, 60%, rgba(255, 12, 12, 0.1));
        padding: 1.5em;
    }
    .root-div.hid .player-section {
        opacity: 75%;
        /*background: linear-gradient(to right, rgba(60,0,0,.25), 15%, transparent, 85%, rgba(60,0,0,.25));*/
        background: /*rgba(35,0,0,.7);*/
            linear-gradient(to right, rgba(60,0,0,.5), rgba(120,0,0,.15), 20%, rgba(200,0,0,.05), 80%, rgba(120,0,0,.15), rgba(60,0,0,.5)),
            radial-gradient(circle, rgba(60,255,60,0.15), 3%, rgba(30,215,30,0.03), 20%, transparent, 60%, rgba(255, 13, 13, 0.05));
    }
    .player-section a {
        color: #66FF00;
    }
    .playlist-section {
        text-align:left;
        padding: 1em;
        font-size: 12pt;
    }
    .root-div.hid .playlist-section {
        opacity: 55%;
    }
    .song-list {
        overflow-y: auto; 
        height: 600px;
        max-height: 600px;
        transition: height 2s ease;
    }
    .root-div.hid .song-list {
        opacity: 55%;
    }
    .song-list.empty {
        height: 10px;
    }

    .playlist-section .song-list::-webkit-scrollbar {
        height: 12px;
        width: 12px;
        background: rgba(255, 0, 0, 0.664); /* rgba(41, 0, 0, 0.233); */
        box-shadow: inset 0 .25em 1em rgba(31, 0, 0, 0.75);
        -webkit-box-shadow: inset 0 .25em 1em rgba(31, 0, 0, 0.75);
    }

    .playlist-section .song-list::-webkit-scrollbar-thumb {
        background: rgba(81, 255, 0, 0.664);
        -webkit-border-radius: 1ex;
        -webkit-box-shadow: 0px .5em .5em rgba(31, 0, 0, 0.75);
    }

    .playlist-section .song-list::-webkit-scrollbar-corner {
        background: rgba(148, 0, 0, 0.5);
    }

    .playlist-section h1 {
        text-align: left;
        margin: 0 1em;
        padding: 0 0;
    }

    .player-section h1 sub {
        color: #66FF00;
    }

    .root-div.hid {
        
    }

    .corner-ui {
        position: fixed;
        
        padding: .5em;
        margin: 1.5em 1.5em;
        top: 0;
        right: 0;
        color: white;
        font-size: 11pt;
        background-color: black;
        border-radius: .75em;
        font-weight: bolder;
        cursor: pointer;
        z-index: 100;
    }

    .root-div.hid .corner-ui {
        opacity: 60%;
    }

</style>