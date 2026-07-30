<script setup>
const NULL_TIME = (99 * 60) + 59.0;
defineProps({
    leftContent: {
        type: String,
        default: '{'
    },
    playContent: {
        type: String,
        default: '&bullet;'
    },
    pauseContent: {
        type: String,
        default: '&bullet;'
    },
    rightContent: {
        type: String,
        default: '}'
    },
    themeColor: {
        type: String,
        default: 'blue'
    },
    selectedSong: {
        type: Object,
        default() { 
            return {
                src: '',
                title: '',
                album: '',
                artist: ''
            }
        }
    },
    artwork: {
        type: String,
        default() {
            return '';
        }
    },
    artworkSize: {
        type: String,
        default: "1184x864"
    },
    defaultAlbum: {
        type: String,
        default() {
            return '';
        }
    },
    displayInfo: {
        type: Boolean,
        default() {
            return false
        }
    },
    prevRestartRatio: {
        type: Number,
        default: -1.0
    },
    prevRestartSec: {
        type: Number,
        default: -1.0
    }
})
defineOptions({
    data() {
        return {
            playingSong: null,
            currentTime: NULL_TIME,
            currentDuration: NULL_TIME,
            starting: false,
            playError: false,
            playing: false,
            progTimer: -1,
            lastError: null
        }
    },
    methods: {
        previous() {
            if (!this.audioValid()) {
                this.$emit('previous-click');
                return;
            }
            const playPos = this.getAudioPosition(); // in sec
            const underRestartSec = (this.prevRestartSec > 0.0 && playPos <= this.prevRestartSec)
            const playLength = this.$refs.audio.duration || 0.0;
            const underRestartRatio = playLength <= 0.0 || (this.prevRestartRatio > 0.0 && (playPos / playLength <= this.prevRestartRatio));
            if (underRestartSec || underRestartRatio) {
                this.$emit('previous-click');
            }
            else {
                this.setPlayTime(0.0); // Set play to song beginning
            }
        },
        next() {
            this.$emit('next-click');
        },
        audioSelected() {
            if (!this.actualSrc) return false;
            return true;
        },
        audioValid() {
            if (!this.actualSrc || this.$refs.audio.duration <= 0) return false; // !this.$refs.audio || 
            return true;
        },
        getAudioPosition() {
            if (!this.audioValid()) return 0.0;
            return this.$refs.audio.currentTime;            
        },
        getPlayStatus() {
            return {
                src: this.selectedSong.src ?? '',
                title: this.selectedSong.title ?? '',
                album: this.selectedSong.album ?? '',
                artist: this.selectedSong.artist ?? '',
                time: this.currentTime,
                duration: this.currentDuration,
                playing: this.playing
            }
        },
        play() {
            // play before audio selection - just emit
            if (!this.audioSelected()) {
                this.$emit('play-click');
                return;
            }
            // play while not playing and audio selected - start play
            if (!this.playing) {
                this.playError = false;
                this.starting = true;
                this.$nextTick(function() {
                    if (!this.$refs.audio) return;
                    this.$refs.audio.play()
                    .then(() => {
                        this.playing = true;
                        this.starting = false;
                        this.playError = false;
                        let playStatus = this.getPlayStatus()
                        this.$emit('play-start', playStatus);
                        this.setDeviceMediaMetadata(playStatus);
                    })
                    .catch((e) => {
                        this.playing = false;
                        this.playError = true;
                        this.starting = false;
                        this.lastError = e.toString();
                    });
                    
                })
            }
            // play while playing - start pause
            else {
                this.$nextTick(function() {
                    if (!this.$refs.audio) return;
                    this.$refs.audio.pause();
                    this.playing = false;
                    let playStatus = this.getPlayStatus();
                    this.$emit('play-pause', playStatus);
                    this.setDeviceMediaMetadata(playStatus);
                })
            }
        },
        setDeviceMediaMetadata(playStatus) {
            if ("mediaSession" in navigator) {
                if (!playStatus) {
                    playStatus = this.getPlayStatus();
                }
                let artArray = [];
                let artSrc = this.artwork;
                if (artSrc) {
                    artArray.push({
                        src: artSrc,
                        type: 'image/png',
                        sizes: this.artworkSize
                    });
                }
                navigator.mediaSession.metadata = new MediaMetadata({
                    title: playStatus.title,
                    artist: playStatus.artist,
                    album: playStatus.album,
                    artwork: artArray
                });
                /*{
                    src: "https://dummyimage.com/96x96",
                    sizes: "96x96",
                    type: "image/png",
                },
                {
                    src: "https://dummyimage.com/128x128",
                    sizes: "128x128",
                    type: "image/png",
                },*/
            }
        },
        update() {
            try {
                let currentTime = this.$refs.audio.currentTime;
                let duration = this.$refs.audio.duration;
                this.currentTime = currentTime;
                this.currentDuration = duration;
                this.$emit('status', this.getPlayStatus());
            }
            catch(e) {}
        },
        timeToMinutes(timeAmt) {
            let minAmt = Math.floor(timeAmt / 60.0);
            let minAmtS = minAmt * 60;
            let secAmt = Math.floor(timeAmt - minAmtS);
            return `${minAmt.toString().padStart(2, '0')}:${secAmt.toString().padStart(2, '0')}`;
        },
        playStarted(event) {
            this.playing = true;
            this.starting = this.playError = false;
            this.$emit('play-start', this.getPlayStatus());
        },
        playPaused(event) {
            this.playing = false;
            this.starting = this.playError = false;
            this.$emit('play-pause', this.getPlayStatus());
        },
        playEnd(event) {
            this.playing = false;
            this.starting = this.playError = false;
            this.$emit('play-ended', this.getPlayStatus());
        },
        setPlayTime(timeValue) {
            try {
                // Have Audio with duration?
                if (!this.audioValid()) return;
                // update time to show desired placement before audio updates itself
                this.currentTime = timeValue;
                this.$refs.audio.currentTime = timeValue;
                this.$emit('play-seek', {
                    src: this.selectedSong.src,
                    title: this.selectedSong.title,
                    album: this.selectedSong.album,
                    artist: this.selectedSong.artist,
                    time: this.currentTime,
                    duration: this.currentDuration,
                    playing: this.playing,
                    seekTime: timeValue
                });
            }
            catch (e) {
                this.lastError = e;
            }
        },
        progressClick(event) {
            try {
                // console.log(event.layerX);
                // console.log(this.$refs.progbar.clientWidth);
                let clickX = event.layerX;
                let clickMax = this.$refs.progbar.clientWidth;
                
                let canCalc = true, canSet = true;
                
                if (!clickMax) canCalc = false;
                // can't calc without width of click horizontal
                if (canCalc) {
                    let clickRatio = clickX / clickMax;
                    let currDur = this.currentDuration;
                    // Have Audio with duration?
                    if (!this.audioValid()) {
                        canSet = false;
                    }
                    else {
                        currDur = this.$refs.audio.duration;
                    }
                    // Have duration?
                    if (!currDur || currDur <= 0.0) canCalc = false;
                    if (canCalc) {
                        let clickTime = clickRatio * currDur;
                        if (canSet) {
                            this.setPlayTime(clickTime);
                        }
                        
                        this.$emit('progress-click', {
                            src: this.selectedSong.src,
                            title: this.selectedSong.title,
                            album: this.selectedSong.album,
                            artist: this.selectedSong.artist,
                            time: this.currentTime,
                            duration: currDur,
                            playing: this.playing,
                            seekTime: clickTime
                        });
                    }   
                }
            }
            catch (e) {
                this.lastError = e;
            }
        },
        nullGateTime(timeVal, includeNegativeOrZero) {
            if (timeVal === undefined
                || timeVal === null 
                || isNaN(timeVal)
                || (includeNegativeOrZero && timeVal <= 0.0))
                return NULL_TIME;
            else
                return timeVal;
        }
        
    },
    computed: {
        actualSrc() {
            if (this.playingSong && this.playingSong.src)
                return this.playingSong.src;
            return '';
        },
        displaySrc() {
            if (this.playingSong && this.playingSong.src) 
                return this.playingSong.src;
            return ''
        },
        displayArtist() {
            if (this.playingSong && this.playingSong.artist) 
                return this.playingSong.artist;
            return ''
        },
        displayAlbum() {
            if (this.playingSong && this.playingSong.album) 
                return this.playingSong.album;
            return this.defaultAlbum || '';
        },
        displaySong() {
            if (this.playingSong && this.playingSong.title) 
                return this.playingSong.title;
            return ''
        },
        displayTime() {
            return this.timeToMinutes(this.nullGateTime(this.currentTime, false));
        },
        displayDuration() {
            return this.timeToMinutes(this.nullGateTime(this.currentDuration, true));
        },
        progressWidth() {
            if (this.currentDuration > 0.05) {
                let progCapped = Math.min(this.currentTime, this.currentDuration);
                return 100.0 * (progCapped / this.currentDuration);
            }
            return 0.0;
        },
        currentProgressBarBg() {
            if (!this.playError)
                return this.themeColor;
            return '';
        }
    },
    watch: {
        selectedSong(newSong) {
            if (newSong) {
                this.playingSong = newSong;
                this.playing = false;
                this.$nextTick(function() {
                    this.play()
                });
            }
        },
        playing(on) {
            let vm = this;
            if (on && this.progTimer == -1) {
                this.progTimer = setInterval(function() {
                    vm.update();
                }, 500);
            }
            else if (!on && this.progTimer != -1) {
                clearInterval(this.progTimer);
                this.progTimer = -1;
            }
        }
    },
    mounted() {
        
    },
    unmounted() {
        if (this.progTimer != -1) {
            clearInterval(this.progTimer);
        }
    }
})
</script>

<template>
    <div>
        <h2 v-if="displayInfo">{{ displaySong }}</h2>
        <h2 v-if="displayInfo">{{ displayArtist }}</h2>
        <div class="controls-row" :style="{color:themeColor}">
            <span class="button-wrap">
                <span role="button" @click.prevent="previous" title="previous track" class="nav-arrow" v-html="leftContent"></span>
            </span>
            <span class="button-wrap">
                <span role="button" @click.prevent="play" :title="playing?'pause':'play'" :class="{playing:playing,paused:!playing}" v-html="playing?pauseContent:playContent"></span>
            </span>
            <span class="button-wrap">
                <span role="button" @click.prevent="next" title="next track" class="nav-arrow" v-html="rightContent"></span>
            </span>
        </div>
        <div class="status-row">
            <div class="status-progress" @click="progressClick" ref="progbar">
                <div class="status-progress-on" 
                :class="{'status-progress-starting':starting,'status-progress-error':playError}"
                :style="{width:progressWidth+'%',background:currentProgressBarBg}"></div>
            </div>
            <span class="time-status" :style="{color:themeColor}">{{ displayTime }} <span class="minor-slash">/</span> {{ displayDuration }}</span>
        </div>
        <audio ref="audio" 
            :src="actualSrc" 
            @pause="playPaused"
            @play="playStarted"
            @ended="playEnd" />
    </div>

</template>


<style scoped>
    .controls-row {
        transition: color 2s;
    }
    .button-wrap {
        display: inline-block; 
        position: relative;
        overflow: hidden;
        width: 1.5em;
        font-size: 24pt;
        font-weight: bolder;
        background-color: rgba(47, 155, 255, 0.25);
        box-shadow: 0 0 .5em .2em rgba(47, 155, 255, 0.4);
        border-radius: .75em;
        padding: 0;
        margin: 0 .5em;
        line-height: 1.2;
    }
    .button-wrap > span[role=button] {
        display: inline-block;
        width: 1.5em;
        font-weight: bolder;
        text-shadow: 0 0.05em 0.4em rgba(0, 0, 0, 85%);
        border-radius: .75em;
        cursor: pointer;
        transition: opacity 0.5s, background-color .5s, box-shadow .5s;
        opacity: 65%;
        user-select: none;
        -webkit-user-select: none;
        -moz-user-select: none;
        -ms-user-select: none;
    }
    .button-wrap > span[role=button].nav-arrow:hover {
        opacity: 90%;
        background-color: rgba(138, 138, 138, 0.35);
        box-shadow: 0 0 .5em .2em rgb(179, 179, 179);
    }
    .button-wrap > span[role=button].paused {
        opacity: 55%;
        
    }
    .button-wrap > span[role=button].paused:hover {
        opacity: 90%;
        background-color: rgba(138, 138, 138, 0.35);
        box-shadow: 0 0 .5em .2em rgb(179, 179, 179);
    }
    .button-wrap > span[role=button].playing {
        opacity: 80%;
        background-color: rgba(185, 185, 185, 0.35);
        box-shadow: 0 0 .5em .2em rgb(179, 149, 149);
    }
    .button-wrap > span[role=button].playing:hover {
        opacity: 100%;
    }

    .status-progress {
        position: relative;
        background: rgba(0,0,0,28%);
        height: .45em;
        border-radius: .15em;
    }
    .status-progress-on {
        position: relative;
        left: 0.05em;
        top: 0.05em;
        border-top: .3em dashed rgba(0,0,0,60%);
        /* background: rgba(255,255,255,75%); */
        height: .35em;
        border-radius: 0.15em;
        box-sizing: border-box;
        box-shadow: 0 0 1em rgba(255,255,255,0.7);
        transition: background 2s, width .25s;
    }
    
    .status-progress.status-progress-on.status-progress-starting {
        border-top: .3em dashed rgba(34, 182, 34, 0.74) !important;
        box-shadow: 0 0 1em rgba(121, 224, 255, 0.7) !important;
        width: 50% !important;
    }
    .status-progress.status-progress-on.status-progress-error {
        border-top: .3em dashed rgba(88, 0, 0, 0.884);
        box-shadow: 0 0 1em rgba(255, 22, 22, 0.7);
        width: 100% !important;
    }
    .time-status {
        font-size: 10pt;
        opacity: 80%;
        box-shadow: 0 0 .65em rgba(0,0,0,0.35);
        background: rgba(0,0,0,0.175);
        border-radius: 0.5em;
        transition: color 2s;
    }
    .night-mode .time-status {
        opacity: 65%;
    }
</style>