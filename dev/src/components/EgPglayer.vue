<script setup>
defineProps({
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
    }
})
defineOptions({
    data() {
        return {
            playingSong: null,
            currentTime: (99 * 60) + 59.0,
            currentDuration: (99 * 60) + 59.0,
            playing: false,
            progTimer: -1
        }
    },
    methods: {
        previous() {
            this.$emit('previous-click');
        },
        next() {
            this.$emit('next-click');
        },
        playStream() {
            // const audioCtx = new AudioContext();
            // if (!this.actualSrc) return;
            // fetch(this.actualSrc)
            // .then(resp => resp.arrayBuffer())
            // .then(buf => audioCtx.decodeAudioData(buf))
            // .then(audioBuffer => {
            //     const source = audioCtx.createBufferSource();
            //     source.buffer = audioBuffer;
            //     source.playbackRate.value = 0.1;
            //     source.loop = true;
            //     source.start(0);
            //     const streamNode = audioCtx.createMediaStreamDestination();
            //     source.connect(streamNode);
            //     this.$refs.audio.controls = true;
            //     this.$refs.audio.srcObject = streamNode.stream;
            // })
            // .catch(console.error);
        },
        play() {
            if (!this.actualSrc) {
                this.$emit('play-click');
                return;
            }
            if (!this.playing) {
                this.$nextTick(function() {
                    this.$refs.audio.play();
                    //this.playStream();
                    this.playing = true;
                })
            }
            else {
                this.$nextTick(function() {
                    this.$refs.audio.pause();
                    this.playing = false;
                })
            }
        },
        update() {
            try {
                let currentTime = this.$refs.audio.currentTime;
                let duration = this.$refs.audio.duration;
                this.currentTime = currentTime;
                this.currentDuration = duration;
                this.$emit('status', {
                    time: currentTime,
                    duration: duration,
                    playing: this.playing
                });
            }
            catch(e) {}
        },
        timeToMinutes(timeAmt) {
            let minAmt = Math.floor(timeAmt / 60.0);
            let minAmtS = minAmt * 60;
            let secAmt = Math.round(timeAmt - minAmtS);
            return `${minAmt.toString().padStart(2, '0')}:${secAmt.toString().padStart(2, '0')}`;
        },
        playEnded(event) {
            this.playing = false;
            this.$emit('play-ended', {
                src: this.selectedSong.src,
                title: this.selectedSong.title,
                album: this.selectedSong.album,
                artist: this.selectedSong.artist
            });
        },
        progressClick(event) {
            try {
                console.log(event.layerX);
                console.log(this.$refs.progbar.clientWidth);
                let clickX = event.layerX;
                let clickMax = this.$refs.progbar.clientWidth;
                if (!clickMax) return;
                let clickRatio = clickX / clickMax;
                let currDur = this.$refs.audio.duration;
                if (!currDur || currDur <= 0.0) return;
                this.$refs.audio.currentTime = clickRatio * currDur;
            }
            catch (e) {}
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
            return this.timeToMinutes(this.currentTime);
        },
        displayDuration() {
            return this.timeToMinutes(this.currentDuration);
        },
        progressWidth() {
            if (this.currentDuration > 0.05) {
                let progCapped = Math.min(this.currentTime, this.currentDuration);
                return 100.0 * (progCapped / this.currentDuration);
            }
            return 0.0;
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
                }, 250);
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
        <h2 v-if="displayInfo">{{ displayAlbum }}</h2>
        <div class="controls-row" :style="{color:themeColor}">
            <span class="button-wrap">
                <span role="button" @click.prevent="previous" title="previous track" class="nav-arrow">
                    {
                </span>
            </span>
            <span class="button-wrap">
                <span role="button" @click.prevent="play" :title="playing?'pause':'play'" :class="{playing:playing,paused:!playing}">
                    &bullet;
                </span>
            </span>
            <span class="button-wrap">
                <span role="button" @click.prevent="next" title="next track" class="nav-arrow">
                    }
                </span>
            </span>
        </div>
        <div class="status-row">
            <div class="status-progress" @click="progressClick" ref="progbar">
                <div class="status-progress-on" :style="{width:progressWidth+'%',background:themeColor}"></div>
            </div>
            <span class="time-status" :style="{color:themeColor}">{{ displayTime }} <span class="minor-slash">/</span> {{ displayDuration }}</span>
        </div>
        <audio ref="audio" :src="actualSrc" @ended="playEnded" />
    </div>

</template>


<style scoped>
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
        height: .35em;
        border-radius: .15em;
    }
    .status-progress-on {
        position: relative;
        left: 0.05em;
        top: 0.05em;
        border-top: .2em dashed rgba(0,0,0,60%);
        /* background: rgba(255,255,255,75%); */
        height: .25em;
        border-radius: 0.15em;
        box-sizing: border-box;
        box-shadow: 0 0 1em rgba(255,255,255,0.7);
    }
    .time-status {
        font-size: 10pt;
        opacity: 80%;
        box-shadow: 0 0 .65em rgba(0,0,0,0.35);
        background: rgba(0,0,0,0.175);
        border-radius: 0.5em;
    }
    .night-mode .time-status {
        opacity: 65%;
    }
</style>