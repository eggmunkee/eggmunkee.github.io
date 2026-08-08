<script setup>
import EgPglayer from '../components/EgPglayer.vue'
import SongList from '../data/song-list.js'
import BgShift from '../data/bg-shift.js'
import DisplaySound from '../data/display-sound.js'

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
        <div v-if="bgStat" class="corner-ui corner-ui-left-slot" @click.prevent="toggUiStat">
            <a>_</a>
        </div>
        <div v-if="bgStat" class="corner-ui corner-ui-bottom-slot" @click.prevent="toggleAnimPaused">
            <a>=</a>
        </div>
        
        <div class="player-section">
            <h1>
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

            <div style="z-index: 10">
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
                    @audio-freq-analysis="audioFreqSnapshot"
                    @audio-time-analysis="audioTimeSnapshot"
                ></eg-pglayer>
            </div>

            <div style="position: relative; height: 1em; z-index: -1;">
                <div v-if="audioFreqData" style="" class="audio-freq-data-cont">
                    <div v-for="(i) in (audioFreqData.length-1)" :key="i" style="" class="audio-freq-data-slice">
                        <div :style="{
                            height: 
                                Math.max(0.0, 
                                    audioFreqData[
                                        middleCoalateIndex(i,audioFreqData.length)
                                    ] + 100.0
                                )+'%'
                            }" 
                            class="audio-freq-bar-freq" />
                        
                        <div v-if="i < audioTimeData.length" :style="{
                            height: (
                                (
                                    
                                    (0.0, 
                                        (1.0 - 
                                            Math.abs(
                                                (i - (audioTimeData.length/2.0))
                                                /
                                                (audioTimeData.length/2.0)
                                            )
                                        ) * 0.5)
                                    + Math.max(0.0,audioTimeData[i])
                                ) 
                                * 100.0) + '%'}" 
                            class="audio-freq-bar-time" />  <!-- 'calc(' + (Math.max(0.0, (0.5+audioTimeData[i]) * 100.0))+'% - 2em)' -->
                    </div>
                </div>
            </div>

            <div class="playlist-section" :class="{'ui-hidden': !uiStat}">
                <h1>
                    Songs <sub>{{ songList.length }}</sub>
                </h1>
                <ul class="para-song">
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
                <ul class="para-song">
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
                    <li>
                        <a @click.prevent="showBgMulti" href="#">- Drop the back</a>
                    </li>
                </ul>
            </div>
            
        </div>
    </div>

</template>

<script>
const STASH_ANIM_TIMER = 3750; // half of 7500
export default {
    mixins: [
        SongList,
        BgShift,
        DisplaySound
    ],
    data() {
        return {
            imgUrls: [],
            themeColor: '#F02020',
            baseBgImg: '/assets/art/combined_art_wide.jpg',
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
            animPaused: false,
            currSrc: '',
            currSrc2: '',
            srcIdx: 0,
            bgPlus: 0,
            bgMinus: 0,
            bgStat: false,
            uiStat: true,
            audioFreqData: null,
            audioTimeData: null
        }
    },
    mounted() {
        

        this.unshuffleTracks('stash');
        this.loadImgs();
        
        let o1 = document.getElementsByClassName('overlay-z1')[0];
        let o2 = document.getElementsByClassName('overlay-z2')[0];
        let o3 = document.getElementsByClassName('overlay-z2')[0];
        this.removeBgClasses(o1);
        this.removeBgClasses(o2);
        this.removeBgClasses(o3);
        // o1.classList.remove('bg-base')
        // o2.classList.remove('bg-base')
        // o3.classList.remove('bg-base')
        // if (!o1.classList.contains('bg-base-stash')) o1.classList.add('bg-base-stash');
        // if (!o2.classList.contains('bg-base-stash')) {
        //     o2.classList.add('bg-base-stash');
        //     o2.classList.add('bg-transp-stash');
        // }
        // if (!o3.classList.contains('bg-base-stash')) {
        //     o3.classList.add('bg-base-stash');
        //     o3.classList.add('bg-transp-stash');
        // }
        // o1.style.display = 'none';
        o2.style.display = 'none';
        o3.style.display = 'none';
        o1.style.backgroundImage = 'url(' + this.baseBgImg + ')';
        o1.classList.add('bg-base-stash-0');
        
    },
    unmounted() {
        if (this.animTimer != -1) {
            clearInterval(this.animTimer);
        }
    },
    methods: {
        
        showBgSetupLayers() {
            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            o1.style.display = '';
            o2.style.display = '';
            o3.style.display = '';
            o1.classList.remove('bg-base-stash-0')
            o1.style.backgroundImage = '';
            o1.classList.add('bg-base-stash')
            o1.classList.add('bg-transp-stash')
            o2.classList.add('bg-base-stash')
            o2.classList.add('bg-transp-stash')
            o3.classList.add('bg-base-stash')
            o3.classList.add('bg-transp-stash')
        },
        hideBgSetupLayers() {
            let o1 = document.getElementsByClassName('overlay-z1')[0];
            let o2 = document.getElementsByClassName('overlay-z2')[0];
            let o3 = document.getElementsByClassName('overlay-z3')[0];
            //o1.style.display = 'none';
            o2.style.display = 'none';
            o3.style.display = 'none';
            o1.classList.remove('bg-base-stash')
            o1.classList.remove('bg-transp-stash')
            o1.classList.remove('high')
            o1.classList.remove('extra')
            o1.classList.add('bg-base-stash-0')
            o1.style.backgroundImage = 'url(' + this.baseBgImg + ')';
            o2.classList.remove('bg-base-stash')
            o2.classList.remove('bg-transp-stash')
            o2.classList.remove('high')
            o2.classList.remove('extra')
            o3.classList.remove('bg-base-stash')
            o3.classList.remove('bg-transp-stash')
            o3.classList.remove('high')
            o3.classList.remove('extra')
        },
        // showBg() {
        //     let vm = this;
        //     if (this.animTimer != -1) {
        //         clearInterval(this.animTimer);
        //         this.animTimer = -1;
        //     }
        //     this.animTimer = setInterval(function() {
        //         vm.anim();
        //     }, STASH_ANIM_TIMER);
        //     this.$nextTick(function() {
        //         this.anim();
        //     });

        //     this.showBgSetupLayers();
        //     this.bgStat = true;
        // },
        // hideBg() {
        //     if (this.animTimer != -1) {
        //         clearInterval(this.animTimer);
        //         this.animTimer = -1;
        //     }
        //     this.hideBgSetupLayers();
        //     this.bgStat = false;
        // },
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
                
                this.incrementBgAnimMulti(src);
            }
            catch (e) {
                console.error(e);
            }
            
        },

        audioFreqSnapshot(freqData) {
            const freqLen = freqData.length;
            //console.log(`Received ${freqLen} in audio frequency analysis data`, freqData);
            this.audioFreqData = freqData.slice(); // store snapshot copy in view component
        },

        audioTimeSnapshot(timeData) {
            const timeLen = timeData.length;
            //console.log(`Received ${timeLen} in audio time analysis data`, timeData);
            this.audioTimeData = timeData.slice(); // store snapshot copy in view component
        },

        // incrementBgAnim(src) {
        //     let overlay = null;
        //     let o1 = document.getElementsByClassName('overlay-z1')[0];
        //     let o2 = document.getElementsByClassName('overlay-z2')[0];
        //     let o3 = document.getElementsByClassName('overlay-z3')[0];
            
        //     // bg overlay to set - null of none this frame
        //     var i = this.srcIdx;
        //     if (i == 0)
        //         overlay = o1;
        //     else if (i == 2)
        //         overlay = o2;
        //     else if (i == 4)
        //         overlay = o3;

        //     if (i == 0) {
                
        //         o1.classList.remove('bg-transp-stash');
        //         o2.classList.add('bg-transp-stash');

        //         o3.classList.remove('xtra');
        //         o3.classList.add('high');
                
                
        //     }
        //     else if (i == 1) {
        //         o1.classList.add('xtra');
                
                
        //         o3.classList.remove('high');
                
        //     }
        //     else if (i == 2) {
        //         o3.classList.add('bg-transp-stash');
                
        //         o2.classList.remove('bg-transp-stash');

        //         o1.classList.add('high');
        //         o1.classList.remove('xtra');
        //     }
        //     else if (i == 3) {
                
        //         o2.classList.add('xtra');
        //         o1.classList.remove('high');
                
        //     }
        //     else if (i == 4) {
        //         o1.classList.add('bg-transp-stash');
        //         o3.classList.remove('bg-transp-stash');
        //         o2.classList.add('high');
        //         o2.classList.remove('xtra');
                
        //     }
        //     else if (i == 5) {
                
                
        //         o3.classList.add('xtra');
        //         o2.classList.remove('high');
                
                
        //     }
            
        //     if (overlay) {
        //         overlay.style.backgroundImage = 'url(' + src + ')';
        //     }
        // },
        // loadImgs() {
        //     let imgAssets = import.meta.glob('../../../docs/assets/art/extra2/*.{png,jpg,jpeg}');
        //     for (const path in imgAssets) {
        //         this.imgUrls.push(path);
        //     }
        //     let imgAssets2 = import.meta.glob('../../../docs/assets/art/extra/*.{png,jpg,jpeg}');
        //     for (const path in imgAssets2) {
        //         this.imgUrls.push(path);
        //     }
        // },
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
        toggUiStat() {
            this.uiStat = !this.uiStat;
        },
        toggleAnimPaused() {
            this.animPaused = !this.animPaused;
        },
        bg_() {
            this.bgMinus = this.bgPlus = 0;
        },
        bgp() {
            this.bgMinus = 0;
            this.bgPlus += 1;
            if (this.bgPlus >= 5) {
                this.bgPlus = 0;
                this.showBgMulti();
            }
        },
        bgm(s) {
            this.bgPlus = 0;
            this.bgMinus += s || 1;
            if (this.bgMinus >= 3) {
                this.bgMinus = 0;
                this.hideBgMulti();
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
        opacity: 30%;
    
        background-size: cover;
    }
    .overlay-z2.bg-base-stash {
        opacity: 25%;

        /*mask-image: radial-gradient(35% 35% ellipse at 35% 35%, black, 70%, transparent 100%);
        -webkit-mask-image: radial-gradient(35% 35% ellipse at 35% 35%, black, 70%, transparent 100%);
        background-color: radial-gradient(30% 30% ellipse at 45% 45%, black, 90%, transparent 100%);*/
    }
    .overlay-z3.bg-base-stash {
        opacity: 20%;

        /*mask-image: radial-gradient(35% 35% ellipse at 35% 35%, black, 70%, transparent 100%);
        -webkit-mask-image: radial-gradient(35% 35% ellipse at 35% 35%, black, 70%, transparent 100%);
        background-color: radial-gradient(30% 30% ellipse at 45% 45%, black, 90%, transparent 100%);*/
    }
    .overlay-z1.bg-base-stash.high {
        opacity: 42%;
    }
    .overlay-z2.bg-base-stash.high {
        opacity: 38%;
    }
    .overlay-z3.bg-base-stash.high {
        opacity: 32%;
    }
    .overlay-z1.bg-base-stash.xtra {
        opacity: 80% !important;
    }
    .overlay-z2.bg-base-stash.xtra {
        opacity: 77% !important;
    }
    .overlay-z3.bg-base-stash.xtra {
        opacity: 70% !important;
    }
    .bg-base-stash {
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: contain;
        background-position-x: left;
        background-position-y: top;
        
        
        transition: opacity 3.75s ease-out, background-position-x .5s cubic-bezier(0,0,.6,1), background-position-y .5s cubic-bezier(0,0,.6,1), /* 25  30s; */
            mask-image 3.75s cubic-bezier(0,0,.6,1), -webkit-mask-image 3.75s cubic-bezier(0,0,.6,1), background-color 3.75s cubic-bezier(0,0,.6,1);

    }
    .bg-base-stash.high {
        transition: opacity 3.75s linear, background-position-x 3.75s cubic-bezier(0, 0, .5, 1), background-position-y 3.75s cubic-bezier(0, 0, .5, 1), /* 7s */
            mask-image 3.75s cubic-bezier(0,0,.5,1), -webkit-mask-image 3.75s cubic-bezier(0,0,.5,1), background-color 3.75s cubic-bezier(0,0,.5,1);
        background-position-x: right;
        background-position-y: bottom;

    }
    /*
    .overlay-z2.bg-base-stash.high,
    .overlay-z3.bg-base-stash.high {
        mask-image: radial-gradient(42% 42% ellipse at 56% 56%, black, 80%, transparent 100%);
        -webkit-mask-image: radial-gradient(42% 42% ellipse at 56% 56%, black, 80%, transparent 100%);
    }*/
    .bg-base-stash.xtra,
    .bg-base-stash.high.xtra {
        transition: opacity 2.75s ease-in, background-position-x 3.75s cubic-bezier(.5,0,1,1), background-position-y 3.75s cubic-bezier(.5,0,1,1), /* 3s */
            mask-image 3.75s cubic-bezier(.5,0,1,1), -webkit-mask-image 3.75s cubic-bezier(.5,0,1,1), background-color 3.75s cubic-bezier(.5,0,1,1);
        background-position-x: center;
        background-position-y: center;

    }
    /*
    .overlay-z2.bg-base-stash.xtra,
    .overlay-z2.bg-base-stash.high.xtra,
    .overlay-z3.bg-base-stash.xtra,
    .overlay-z3.bg-base-stash.high.xtra {
        mask-image: radial-gradient(42% 42% ellipse at 44% 44%, black, 80%, transparent 100%);
        -webkit-mask-image: radial-gradient(42% 42% ellipse at 44% 44%, black, 80%, transparent 100%);
    }*/

    .bg-base-stash-0 {
        background-repeat: no-repeat;
        background-attachment: fixed;
        background-size: cover;
        background-position-x: center;
        background-position-y: center;
    }

    .overlay-z1.bg-base-stash.bg-transp-stash,
    .overlay-z1.bg-base-stash.bg-transp-stash.high,
    .overlay-z2.bg-base-stash.bg-transp-stash,
    .overlay-z2.bg-base-stash.bg-transp-stash.high,
    .overlay-z3.bg-base-stash.bg-transp-stash,
    .overlay-z3.bg-base-stash.bg-transp-stash.high {
        opacity: 0.0;
        transition: opacity 3.75s ease-in, background-position-x 3.75s cubic-bezier(0, 0, .6, 1), background-position-y 3.75s cubic-bezier(0, 0, .6, 1), /* 7.5s */
            mask-image 3.75s cubic-bezier(0,0,.6,1), -webkit-mask-image 3.75s cubic-bezier(0,0,.6,1), background-color 3.75s cubic-bezier(0,0,.6,1);
        background-position-x: right;
        background-position-y: bottom;
    }
    /*
    .overlay-z2.bg-base-stash.bg-transp-stash,
    .overlay-z3.bg-base-stash.bg-transp-stash {
        mask-image: radial-gradient(35% 35% ellipse at 65% 65%, black, 70%, transparent 100%);
        -webkit-mask-image: radial-gradient(35% 35% ellipse at 65% 65%, black, 70%, transparent 100%);
    }*/
</style>

<style scoped>
    .root-div {
        text-align: center;
        margin: 1.5rem 0;
        color: #F02020;

        font-size: 12pt;
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
        opacity: 80%;
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
    }
    .root-div.hid .playlist-section {
        opacity: 75%;
    }
    .song-list {
        overflow-x: visible;
        overflow-y: auto; 
        height: 300px;
        max-height: 300px;
        transition: height 2s ease;
    }
    .playlist-section ul.song-list {
        padding-inline-start: 1em;
        margin-inline-start: -.5em;
        margin-inline-end: -.5em;
    }
    .root-div.hid .song-list {
        opacity: 75%;
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

    .player-section h1 {
        margin: 0 .25em;
        padding: 0;
        line-height: 1.2;
    }

    .playlist-section h1 {
        text-align: left;
        margin: 0 .25em;
        padding: 0;
        line-height: 1.2;
    }
    
    h1 sub {
        font-size: 50%;
        line-height: 0.5;
    }

    .playlist-section ul.para-song {
        padding-inline-start: 0.5em;
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

    .corner-ui.corner-ui-left-slot {
        right: 3em;
    }

    .corner-ui.corner-ui-bottom-slot {
        top: 3em;
    }

    .root-div.hid .corner-ui {
        opacity: 60%;
    }
    
    .ui-hidden {
        display:none;
    }
    
    .audio-freq-data-cont {
        font-size: 7pt; margin: 0 calc(max(25%,5rem)); display:flex; flex-direction: row;  
        justify-content: space-evently; position: relative; top: -9.5em; opacity: 75%;
    }

    .audio-freq-data-slice {
        position: relative; flex-basis: .5em; flex-grow: 1; height: 6em;
    }

    .audio-freq-bar-freq {
        /*border: .15em solid #ee0000; */
        border-right-width: 0; 
        border-top-width: 0; 
        position:absolute; 
        left: 0; top:0; 
        width: 50%; 
        border-bottom-right-radius: 35%;
        border-bottom-left-radius: 35%;
        
        background: linear-gradient(to bottom, transparent, 25%, rgba(180,0,180,.5), 75%, rgba(225,0,0,0.85)); 
        box-sizing: border-box;
    }

    .audio-freq-bar-time {
        /*border: .15em solid #00bb00; */
        border-left-width: 0; 
        border-top-width: 0; 
        border-top-left-radius: 35%;
        border-top-right-radius: 35%;

        position:absolute; 
        right: 0; bottom:0; 
        width: 50%; 
        background: linear-gradient(to top, transparent, 25%, rgba(180, 166, 0, 0.5), 75%, rgba(0,225,0,0.85)); 
        box-sizing: border-box;
    }

</style>