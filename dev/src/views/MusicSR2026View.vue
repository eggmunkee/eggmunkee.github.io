<script setup>
import VueAudioPlayer from '@liripeng/vue-audio-player'

import Song from '../components/Song.vue'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_stochastic_recovery_20x6.json';
</script>

<template>
<div class="root-div">
    <div class="player-section-outer">
        <div class="player-section" :class="playerBgVisible ? '' : 'no-bg'">
            <div class="player-heading">
                <span class="stick-top-left from-padded">
                    <span class="playlist-controls over-bg-area-shadow-dark">
                        <span class="twist-cont force-block set-d set-d-left reverse-motion centered-div" @click="togglePlayerBg" :class="playerBgVisible ? 'on' : ''" @dblclick.stop.prevent="" title="toggle player backdrop">
                            <span class="dark-text twist-slash">_</span>
                        </span>
                    </span>
                </span>
                <span class="stick-top-right from-padded">
                    <span class="playlist-controls over-bg-area-shadow-dark">
                        <span class="twist-cont force-block set-d reverse-motion centered-div" @click="togglePlayerBg" :class="playerBgVisible ? 'on' : ''" @dblclick.stop.prevent="" title="toggle player backdrop">
                            <span class="dark-text twist-slash">_</span>
                        </span>
                    </span>
                </span>
                <div class="album-label">
                    <span class="album-name" v-show="currentSongAlbum">
                        <template v-for="(letter,index) in albumNameChopped(currentSongAlbum)" :key="index">
                            <span :class="albumLetterStyled(letter,index)">{{ letter }}</span>
                        </template>
                    </span>
                </div>
            </div>
            <vue-audio-player ref="audioPlayer"
                :audio-list="songList"
                theme-color="hsl(208, 75%, 89%)"
                :before-play="playNext"
                :progress-interval="500"
                @pause="playEnded"
            ></vue-audio-player>
            <div class="song-label">
                <div class="song-title medium-dual-label" :class="songStyle(1, false)">
                    {{ currentSongTitle }}
                </div>
                <div class="song-artist medium-dual-label" :class="songStyle(5, false)">
                    <span v-if="false && currentSongArtist">by {{currentSongArtist}}</span>
                </div>
            </div>
        </div>
    </div>
    
    <div class="playlist-section-outer">
        <div class="playlist-section">
            <!-- corner ui -->
            <span class="stick-top-left">
                <span class="playlist-controls over-bg-area-shadow-dark">
                    <span class="twist-cont force-block set-d set-d-left centered-div" @click="togglePlaylist" :class="playlistVisible ? 'on' : ''" @dblclick.stop.prevent="" title="toggle playlist">
                        <span class="dark-text twist-slash">_</span>
                    </span>
                </span>
            </span>
            <span class="stick-top-right">
                <span class="playlist-controls over-bg-area-shadow-dark">
                    <span class="twist-cont force-block set-d centered-div" @click="togglePlaylist" :class="playlistVisible ? 'on' : ''" @dblclick.stop.prevent="" title="toggle playlist">
                        <span class="dark-text twist-slash">_</span>
                    </span>
                </span>
            </span>

            <h3 >
                <span class="box-shadow">
                    <span class="playlist-title medium-dual-label" :class="songStyle(3, false)" >Songs ({{songList.length}})</span>
                </span>
                
                <span class="icon-cont-shadow">
                    <a href="#" class="small-label shadow shuffle-icon" title="shuffle song order" :class="songStyle(5, false)" style="color: rgb(100, 156, 200)" @click.prevent="shuffleTracks">
                    </a>
                </span>
            </h3>
            <div class="song-list" ref="songContainer" :class="playlistVisible ? '' : 'collapsed'">
                <div v-for="(song, songIndex) in songList" :key="song.src" :class="songContainerClass(songIndex)">
                    <Song :url="song.src" :title="song.title" :title-class="songStyle(songIndex, true)" :muted="true" 
                    :show-player="false" :show-download="true" @title-dblclick="playThisSong(songIndex)" />
                </div>
            </div>            
        </div>
    </div>

    <div class="centered-div" v-show="playlistVisible">
        <div class="instructions blue over-bg-shadow over-bg-area-shadow">
            double click song to play <span class="minor-slash">/</span> click <span class="download-icon blue-dimmed-bg">&nbsp;</span> to download
        </div>
    </div>

    <div class="controls-row" :class="{'alone':!playlistVisible}">
        <div class="bg-controls centered-div">
            <span class="blue-dimmed over-bg-shadow over-bg-area-shadow text-faint">backdrop &amp; tint</span>
        </div>
        <div class="bg-controls centered-div">
            <div class="over-bg-area-shadow-dark centered-div">
                <span class="twist-cont set-b" @click="toggleBg" :class="bgOn ? 'on' : ''" @dblclick.stop.prevent="" title="toggle backdrop">
                    <span class="blue-dimmed twist-slash">_</span>
                </span>
                <span class="twist-cont" :class="minusClicked ? 'clicked clicked-left' : ''" @click="prevBg" @dblclick.stop.prevent="" title="previous">
                    <span class="blue-dimmed twist-slash">((</span>
                </span>
                <span class="twist-cont set-c" :class="(bgOn && bgAnimEnabled) ? (bgAnimEnFr ? 'on on-extra' : 'on') : ''" 
                    @click="toggleBgAnim" @dblclick.stop.prevent="" title="toggle advance">
                    <span class="blue-dimmed twist-slash">/</span>
                </span>
                <span class="twist-cont" :class="plusClicked ? 'clicked' : ''" @click="nextBg" @dblclick.stop.prevent="" title="next">
                    <span class="blue-dimmed twist-slash">))</span>
                </span>
                <span class="twist-cont set-a" @click="toggleTint" :class="tintOn ? 'on' : ''" @dblclick.stop.prevent="" title="toggle tint">
                    <span class="blue-dimmed twist-slash">_</span>
                </span>
            </div>
        </div>
    </div>

</div>
</template>

<script>
const FORWARD = false;
const REVERSE = true;
const FORCE_TRANSITION = true;
const BUTTON_TIMEOUT = 1500;
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
        songList: initialSongList,
        // play next state
        queueSongByIndex: false,
        nextSongIndex: 0,
        // visible toggles
        playerBgVisible: true,
        playlistVisible: true,
        // bg ui state
        currentBgIndex: 0,
        bgAnimFrame: 0,
        bgAnimIncrCount: 11,
        bgCount: 54,
        bgLayerToggle: 1, // 1 is layer 1, 2 is layer 2 last updated
        bgColorIdx: 0,
        bgColors: [
            'rgba(0,0,0,0.22)', 
            'rgba(255,30,10,.26)', 
            'rgba(90,120,180,.31)', 
            'rgba(50,30,220,.37', 
            'rgba(0,170,60,0.45)', 
            'rgba(0,0,0,0.46)', 
            'rgba(0,60,120,0.47)', 
            'rgba(50,30,220,.50)', 
            'rgba(190,170,240,0.49)',
            'rgba(255,255,255,0.46)',
            'rgba(255,255,80,0.40)', 
            'rgba(255,255,0,0.35)', 
            'rgba(0,120,255,0.31)', 
            'rgba(0,255,0,0.27)', 
            'rgba(255,60,0,.24)', 
            'rgba(220,255,0,0.21', 
            'rgba(190,255,255,0.17)',
            'rgba(125,255,255,0.19)'
        ],
        bgAnimEnabled: false,
        bgAnimEnFr: false,
        bgOn: true,
        tintOn: false,
        minusClicked: true,
        plusClicked: true,
        timeLeftClicked: -1,
        timeRightClicked: -1
    }
  },
  mounted() {
    this.animInterval = setTimeout(this.startAnim, 3000);
    try {
        const overlay1 = document.getElementsByClassName('overlay-z1')[0];
        const overlay2 = document.getElementsByClassName('overlay-z2')[0];
        const overlay3 = document.getElementsByClassName('overlay-z3')[0];
        overlay1.style.display = '';
        overlay2.style.display = '';
        overlay3.style.display = '';

        // read overlay 1 and 2 bg frame state to pick up if present
        const overlay1Frm = this.getFrameFromElem(overlay1);
        const overlay2Frm = this.getFrameFromElem(overlay2);
        const overlay2Transp = overlay2.classList.contains('bg-transp');

        let existingFrameIndex = 0; // default to first frame - 0
        if (overlay2Frm != -1 && !overlay2Transp) {
            existingFrameIndex = overlay2Frm;
        }
        else if (overlay1Frm != -1) {
            existingFrameIndex = overlay1Frm;
        }
        // set model bg index
        this.currentBgIndex = existingFrameIndex;
        let initialLayer1Bg = this.getBgCls(this.currentBgIndex);
        this.removeBgClasses(overlay1);
        let cl = overlay1.classList;
        cl.add('bg-base');
        cl.add(initialLayer1Bg);
        //c1.add('bg-dark-fade');
        cl = overlay2.classList;
        this.removeBgClasses(overlay2);
        cl.add('bg-base');
        cl.add('bg-transp');
        //cl.add('bg-dark-07');
        
        setTimeout(function() { 
            overlay3.classList.add('overlay-z3-25');
        }, 3000);
        //document.getElementsByTagName('body')[0].classList.add('bg-wavy-blue-verydark');
    }
    catch (e) {}
  },
  unmounted() {
    if (this.animInterval != -1) {
        if (this.animStarted) {
            clearInterval(this.animInterval);
        }
        else {
            clearTimeout(this.animInterval);
        }
        this.animInterval = -1;
    }
    if (this.timeLeftClicked != -1)
        clearTimeout(this.timeLeftClicked);
    if (this.timeRightClicked != -1)
        clearTimeout(this.timeRightClicked);
    this.timeLeftClicked = this.timeRightClicked = -1;
  },
  methods: {
    startAnim() {
        this.animInterval = setInterval(this.incrementAnim, 4000);
        this.animStarted = true;
        this.bgAnimEnabled = true;
        this.tintOn = true;
        this.clearBgClicked();
    },
    albumNameChopped(albumName) {
        let letters = [];
        for (let i=0; i< albumName.length; i++) {
            letters.push(albumName[i]);
        }
        return letters;
    },
    albumLetterStyled(albumLetter, index, isTitle) {
        if (albumLetter == ' ') return '';
        let choice = (index + this.animFrame) % this.maxFrames;
        let initialClasses = !isTitle ? 'album-letter ' : 'medium-dual-label ';
        let albumClasses = initialClasses + `dual-label-${choice}`;
        if (albumLetter == 'x') return albumClasses + ' muted-letter';
        return albumClasses;
    },
    /*albumNameChopped(albumName) {
        let albumChunk = '';
        let labNum = 1;
        for (let i=0; i< albumName.length; i++) {
            albumChunk += `<span class="album-letter dual-label-${labNum}">${albumName[i]}</span>`;
            labNum += 1;
            if (labNum > 10) labNum = 1;
        }
        return albumChunk;
    },*/
    clearBgClicked() {
        this.minusClicked = this.plusClicked = false;
    },
    clearBgPrev() {
        this.minusClicked = false;
        this.timeLeftClicked = -1;
    },
    setBgPrevClicked() {
        this.minusClicked = true;
        if (this.timeLeftClicked != -1)
            clearTimeout(this.timeLeftClicked);
        this.timeLeftClicked = setTimeout(this.clearBgPrev, BUTTON_TIMEOUT);
    },
    clearBgNext() {
        this.plusClicked = false;
        this.timeRightClicked = -1;
    },
    setBgNextClicked() {
        this.plusClicked = true;
        if (this.timeRightClicked != -1)
            clearTimeout(this.timeRightClicked);
        this.timeRightClicked = setTimeout(this.clearBgNext, BUTTON_TIMEOUT);
    },
    getBgCls(idx) {
        return 'bg-dark-' + (idx+1).toString().padStart(2,"0");
    },
    getFrameFromElem(elem) {
        let cl = elem.classList;
        for (let i=0; i < cl.length; i++) {
            let frameIndex = this.getFrameFromBgClass(cl[i]);
            if (frameIndex != -1)
                return frameIndex;
        }
        return -1;
    },
    getFrameFromBgClass(clsName) {
        if (!clsName.startsWith('bg-dark-')) return -1;
        let framePart = clsName.substring(8);
        let frameNum = Number.parseInt(framePart);
        if (!frameNum || isNaN(frameNum)) return -1;
        return frameNum - 1; // Turn bg-dark-01 into Frame 0
    },
    incrBgIndex(reverse) {
        this.currentBgIndex += reverse ? -1 : 1;
        if (this.currentBgIndex >= this.bgCount)
            this.currentBgIndex = 0;
        else if (reverse && this.currentBgIndex < 0)
            this.currentBgIndex = this.bgCount - 1;
    },
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
    setupBgClasses(elem, idx) {
        let nextClsName = this.getBgCls(idx);
        this.removeBgClasses(elem);
        elem.classList.add('bg-base');
        elem.classList.add(nextClsName);
    },
    removeBgSlowFade() {
        const overlay2 = document.getElementsByClassName('overlay-z2')[0];
        let o2cl = overlay2.classList;
        if (o2cl.contains('bg-transp')) {
            o2cl.remove('bg-transp');
            o2cl.add('bg-fast-transition');
        }
    },
    incrementBgAnim(reverse, forceTransition) {
        // get two overlay layers
        const overlay1 = document.getElementsByClassName('overlay-z1')[0];
        const overlay2 = document.getElementsByClassName('overlay-z2')[0];
        
        this.incrBgIndex(reverse || false);

        this.bgAnimEnFr = !this.bgAnimEnFr;

        if (forceTransition) {
            this.bgLayerToggle = 1;
            this.removeBgClasses(overlay1);
            this.removeBgClasses(overlay2);
        }

        // go from fading to changing images
        if (this.bgLayerToggle == 2) {
            this.bgLayerToggle = 1;
            // Set Fade out class anim on 2nd level Overlay
            overlay2.classList.add('bg-transp');
            // clear and rebuild bg styles
            this.setupBgClasses(overlay1, this.currentBgIndex);
        }
        // step into fading
        else {
            this.bgLayerToggle = 2;
            // clear and rebuild bg styles - clears transparant anim class also
            this.setupBgClasses(overlay2, this.currentBgIndex); // (this.currentBgIndex + 5) % this.bgCount);
        }
        
        if (forceTransition) {
            this.removeBgSlowFade();
        }
    },
    updateColorTint() {
        let color = this.bgColors[this.bgColorIdx];
        this.bgColorIdx += 1;
        if (this.bgColorIdx >= this.bgColors.length)
            this.bgColorIdx = 0;
        try {
            let overlay3 = document.getElementsByClassName('overlay-z3')[0];
            overlay3.style.backgroundColor = color;
        }
        catch (e) {}
    },
    incrementAnim() {
        this.animFrame += 1;
        if (this.animFrame >= this.maxFrames) {
            this.animFrame = 0;
        }
        if (this.bgAnimEnabled) {
            this.bgAnimFrame += 1;
            if (this.bgAnimFrame >= this.bgAnimIncrCount) {
                this.bgAnimFrame = 0;
                this.incrementBgAnim();
            }
        }
        if (this.tintOn)
            this.updateColorTint();
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
    playStarted() {
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
            this.currentSongArtist = song.artist || ' ';
            this.currentSongAlbum = song.album || ' ';
            this.scrollCurrentSongIntoView();
            
            
        } catch (e) {
            this.currentSongTitle = 'Unknown';
            this.currentSongArtist = ' ';
            this.currentSongAlbum = ' ';
            this.currentSongIndex = 0;
        }

        this.$nextTick(next(true));
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
    },
    togglePlayerBg() {
        this.playerBgVisible = !this.playerBgVisible;
        console.warn("New Player BG Visible = ", this.playerBgVisible);
    },
    togglePlaylist() {
        this.playlistVisible = !this.playlistVisible;
    },
    toggleBgAnim() {
        this.bgAnimEnabled = !this.bgAnimEnabled
        if (!this.bgAnimEnabled)
            this.bgAnimEnFr = false;
    },
    prevBg(event) {
        if (event.detail > 1) {
            event.preventDefault();
        }
        else {
            this.incrementBgAnim(REVERSE, FORCE_TRANSITION);
        }
        this.setBgPrevClicked();
    },
    nextBg(event) {
        if (event.detail > 1) {
            event.preventDefault();
        }
        else {
            //this.incrBgIndex();
            this.incrementBgAnim(FORWARD, FORCE_TRANSITION);
        }
        this.setBgNextClicked();
    },
    toggleTint() {
        try {
            let overlay3 = document.getElementsByClassName('overlay-z3')[0];
            let o3st = overlay3.style;
            if (o3st.display != 'none') { 
                o3st.display = 'none';
                this.tintOn = false;
            }
            else {
                o3st.display = '';
                this.tintOn = true;
            }
        }
        catch (e) {}
    },
    toggleBg() {
        try {
            const overlay1 = document.getElementsByClassName('overlay-z1')[0];
            const overlay2 = document.getElementsByClassName('overlay-z2')[0];
            this.bgOn = !this.bgOn;
            if (this.bgOn) {
                overlay1.style.display = '';
                overlay2.style.display = '';
            }
            else {
                overlay1.style.display = 'none';
                overlay2.style.display = 'none';
            }
        }
        catch (e) {}
    }
  }
}
</script>

<style>
.vue-audio-player__play-rate {
    visibility: hidden;
}


.bg-base {
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position-x: center;
    background-position-y: bottom;
    background-attachment: fixed; 
    opacity: 1;
    transition-property: opacity;
    transition-duration: 28s ; /* 25  30s; */
}

.bg-base.bg-fast-transition {
    transition-property: opacity;
    transition-duration: 2s ; /* 25  30s; */
}

.bg-wavy-blue-verydark {
    background-image: url('/assets/art/wavy-haze-verydark.jpg'); 
}


.bg-transp {
    opacity: 0.0;
}
.bg-dark-fade {
    background: rgba(0,0,0, 0.75);
}

/* haze */
.bg-dark-01 {
    background-image: url('/assets/art/wavy-haze-verydark.jpg');
}
/* monoliths and light with electric currents */
.bg-dark-02 {
    background-image: url('/assets/art/stochast/image-vAE8r.jpg');
}

/* energy wave front in space */
.bg-dark-03 {
    background-image: url('/assets/art/stochast/image-i4u5hxybtk7g0vob36fsviqnn.jpg');
}
/* album cover */
.bg-dark-04 {
    background-image: url('/assets/art/stochast/cover-art-stochastic-recovery-20x6-album.jpg');
}
/* haze */
.bg-dark-05 {
    background-image: url('/assets/art/wavy-haze-verydark.jpg');
}

/* base energy chasms */
.bg-dark-06 {
    background-image: url('/assets/art/stochast/image-bg-cosmic-chasm-02.jpg');
}
.bg-dark-07 {
    background-image: url('/assets/art/stochast/image-bg-cosmic-chasm-03.jpg');
}
.bg-dark-08 {
    background-image: url('/assets/art/stochast/image-bg-cosmic-chasm-07.jpg');
}
.bg-dark-09 {
    background-image: url('/assets/art/stochast/image-bg-cosmic-chasm-01.jpg');
}
.bg-dark-10 {
    background-image: url('/assets/art/stochast/image-bg-cosmic-chasm-05.jpg');
}
.bg-dark-11 {
    background-image: url('/assets/art/stochast/image-bg-cosmic-chasm-08.jpg');
}
.bg-dark-12 {
    background-image: url('/assets/art/stochast/image-bg-cosmic-chasm-04.jpg');
}


/* lava set */
.bg-dark-13 {
    background-image: url('/assets/art/stochast/image-e1ovn41unr5c5pal3410r6cif.jpg');
}
.bg-dark-14 {
    background-image: url('/assets/art/stochast/image-j900r29yhc9aac5yut1uui03o.jpg');
}

/* irregular plamsa flow chasms */
.bg-dark-15 {
    background-image: url('/assets/art/stochast/image-3ijp4d9f0ia96j5rjjeaspmu6.jpg');
}
.bg-dark-16 {
    background-image: url('/assets/art/stochast/image-nxqzngt7aqw0ngy8ry7lzqjzy.jpg');
}
.bg-dark-17 {
    background-image: url('/assets/art/stochast/image-0jbxjc5nzrh0rfxrisy1fvhch.jpg');
}
.bg-dark-18 {
    background-image: url('/assets/art/stochast/image-q8hmm6uzr0ll10wshv3jtlycg.jpg');
}
.bg-dark-19 {
    background-image: url('/assets/art/stochast/image-akjl93i1i8foz2pkyoipkvu3s.jpg');
}
.bg-dark-20 {
    background-image: url('/assets/art/stochast/image-jvtzt5hubnfc3ua1ejt12mh7k.jpg');
}
.bg-dark-21 {
    background-image: url('/assets/art/stochast/image-tvy6t9gmbe03lwah2p51vj8ip.jpg');
}
.bg-dark-22 {
    background-image: url('/assets/art/stochast/image-3ijp4d9f0ia96j5rjjeaspmu6.jpg');
}
.bg-dark-23 {
    background-image: url('/assets/art/stochast/image-n8qq0pv8k08vem880s5y5hd59.jpg');
}
.bg-dark-24 {
    background-image: url('/assets/art/stochast/image-n8qq0pv8k08vem880s5y5hd59.jpg');
}

/* round chasm plasma - constellations/portals */
.bg-dark-25 {
    background-image: url('/assets/art/stochast/image-jj5cnzozc5j1aasrr5iwf8sfs.jpg');
}

.bg-dark-26 {
    background-image: url('/assets/art/stochast/image-u65yjrw2hqp1wrwjwlb9p4d3i.jpg');
}
.bg-dark-27 {
    background-image: url('/assets/art/stochast/image-guzjs8h3e95tgjga2xmkz8swr.jpg');
}
.bg-dark-28 {
    background-image: url('/assets/art/stochast/image-0qvp9do65gnxjnd1966tndc74.jpg');
}
.bg-dark-29 {
    background-image: url('/assets/art/stochast/image-4nxe77jlryt86s2gwcrtrq4s7.jpg');
}

/* crystals in chasm */
.bg-dark-30 {
    background-image: url('/assets/art/stochast/image-a9n0o5dlqlqd4rc8478xwjpgw.jpg');
}
.bg-dark-31 {
    background-image: url('/assets/art/stochast/image-s9haeucixywznzdrpnll0usoy.jpg');
}
.bg-dark-32 {
    background-image: url('/assets/art/stochast/image-df0voxaf6st0rh8uhjqzrakcp.jpg');
}
.bg-dark-33 {
    background-image: url('/assets/art/stochast/image-5je899tihhk2tz10kfuvsrsaa.jpg');
}


/* icy crystals - jagged chasms */
.bg-dark-34 {
    background-image: url('/assets/art/stochast/image-bz4tlm1dgtr6yeo8o0bt9rafo.jpg');
}
.bg-dark-35 {
    background-image: url('/assets/art/stochast/image-doeki8a4cy1n65ul2spvu6s4u.jpg');
}
.bg-dark-36 {
    background-image: url('/assets/art/stochast/image-1oxuqyamn6ai78phmz1je5she.jpg');
}
.bg-dark-37 {
    background-image: url('/assets/art/stochast/image-g3kbilr4jxajspbhx2y1ienhg.jpg');
}

/* barren jagged chasms and canyons in space */

.bg-dark-38 {
    background-image: url('/assets/art/stochast/image-ff2zdw93bls8bhun5752ksm4p.jpg');
}
.bg-dark-39 {
    background-image: url('/assets/art/stochast/image-s3ku9uavbjasuhvnlska1w6a1.jpg');
}
.bg-dark-40 {
    background-image: url('/assets/art/stochast/image-lu1fekpob8xv1o776kghfwaq4.jpg');
}
.bg-dark-41 {
    background-image: url('/assets/art/stochast/image-rj2i3twvfk5z1017aabqpd4ja.jpg');
}
.bg-dark-42 {
    background-image: url('/assets/art/stochast/image-4q4rkz8ugb6rq24uxlhflysls.jpg');
}
.bg-dark-43 {
    background-image: url('/assets/art/stochast/image-cgz3lwrfddhdc7hziyeymduxm.jpg');
}
.bg-dark-44 {
    background-image: url('/assets/art/stochast/image-h33p566qlz4chisc5jtdudkmo.jpg');
}

/* pillar witness space eruptio */
.bg-dark-45 {
    background-image: url('/assets/art/stochast/image-ve675eyt7rgsv5lo24xl57hyk.jpg');
}
.bg-dark-46 {
    background-image: url('/assets/art/stochast/image-vmsihc7bgq23c4gxwz83lc2nn.jpg');
}

/* energy astroids */
.bg-dark-47 {
    background-image: url('/assets/art/stochast/image-elw8a7yne7n8nmf9yvu49kmv1.jpg');
}

/* sound waves forms */
.bg-dark-48 {
    background-image: url('/assets/art/stochast/image-trwi89muff1j4k0fso08tg4sp.jpg');
}

/* pillars */
.bg-dark-49 {
    background-image: url('/assets/art/stochast/image-r2aljv4yp0lrvqhcihs8ui3vv.jpg');
}
.bg-dark-50 {
    background-image: url('/assets/art/stochast/image-t6v4he54c90cu8uonjccs8a8f.jpg');
}
.bg-dark-51 {
    background-image: url('/assets/art/stochast/image-jP1Z1.jpg');
}
.bg-dark-52 {
    background-image: url('/assets/art/stochast/image-x40gN.jpg');
}
.bg-dark-53 {
    background-image: url('/assets/art/stochast/image-txqlyrhb7u6skn1bjp1707s2v.jpg');
}

/* energy wave front in space */
.bg-dark-54 {
    background-image: url('/assets/art/stochast/image-i4u5hxybtk7g0vob36fsviqnn.jpg');
}

.small-dual-label {
    font-size: 13pt;
    font-weight: bolder;
    transition-property: text-shadow, color;
    transition-duration: 3s;
}

h2.medium-dual-label {
    padding: .5em 0 .25em 0;
}
.medium-dual-label {
    font-size: 14pt;
    font-weight: bolder;
    line-height: 1.1;
    transition-property: text-shadow, color;
    transition-duration: 3s;
}

.dual-label-1 {
    color: hsl(209, 70%, 85%);    
    text-shadow: -0.05em -0.17em 0.01em hsl(208, 35%, 8%);
}
.dual-label-2 {
    color: hsl(219, 70%, 85%);
    text-shadow: -0.1em 0.16em 0.01em hsl(208, 35%, 8%);
}
.dual-label-3 {
    color: hsl(190, 75%, 90%);    
    text-shadow: 0.15em 0.16em 0.01em hsl(208, 35%, 8%);
}
.dual-label-4 {
    color: hsl(120, 60%, 90%);    
    text-shadow: -0.15em 0.13em 0.01em hsl(208, 35%, 8%);
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

.root-div {
    font-size: 14pt;
    margin: 1.5rem 0;
    text-align: center;
    position: relative;
    font-family: 'Gill Sans', 'Gill Sans MT', Calibri, 'Trebuchet MS', sans-serif;
}

.player-section-outer {
    /* border-top:  2px dashed rgba(0,0,0,0.22); */
    border-left:   .15em dashed rgba(255,255,255,0.32);
    border-right:    .15em dashed rgba(255,255,255,0.32);    
    /* border-bottom: 2px dashed rgba(0,0,0,0.22); */
    box-shadow: 0 -0.05rem 2.5rem -0.5rem rgba(0,0,0,.22);
    border-radius: 2rem;
}
.player-section {
    border-radius: 2rem; 
    padding: 1rem; 
    margin-bottom: 2rem;
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);

    background-color: rgba(190,200,255,0.35);
    background-size: cover;
    background-position-x: center;
    background-position-y: 80%;
    background-attachment: fixed;    
    background-image: url('/assets/art/stochast/cover-art-stochastic-recovery-20x6-album.jpg');

    /*border-right:   2px dashed rgba(0,0,0,0.82);
    border-left:  2px dashed rgba(255,255,255,0.92);
    border-bottom:    2px dashed rgba(255,255,255,0.92);    
    border-top: 2px dashed rgba(0,0,0,0.82);*/
}

.player-section.no-bg {
    background: rgba(0,0,0,0.05);
    background-color: rgba(0,0,0,0.05);
    background-image: none;
    transition-property: background-color, background-image, box-shadow;
    transition-duration: 2.5s;
    transition-timing-function: ease;
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.15);
}

.small-label {
    font-size: 85%;
}

.player-heading {
    position: relative;
}

.album-label {
    padding: 0.5em;
    border-radius: 0.5em;
}

.album-label > .album-name {
    position: relative;
    top: -0.35em;
    opacity: 85%;
    font-size: 200%;  
    color: hsl(209, 35%, 95%);
    text-shadow: 0.15em 0.58em 0.01em rgba(31, 41, 116, 0.8);
    font-weight: bolder;
    line-height: 0.85;
}

.album-name .album-letter {
    transition-property: text-shadow, color;
    transition-duration: 3s;
}
.album-name .album-letter.muted-letter {
    opacity: 0.4;
}

.medium-dual-label.muted-letter {
    opacity: 0.35;
}

.album-letter.dual-label-1 {
    text-shadow: 0.13em 0.63em 0.01em rgba(31, 41, 116, 0.8);
}
.album-letter.dual-label-2 {
    text-shadow: 0.14em 0.60em 0.01em rgba(28, 35, 100, 0.8);
}
.album-letter.dual-label-3 {
    text-shadow: 0.16em 0.54em 0.01em rgba(22, 30, 92, 0.8);
}
.album-letter.dual-label-4 {
    text-shadow: 0.17em 0.51em 0.01em rgba(19, 25, 86, 0.8);
}
.album-letter.dual-label-5 {
    text-shadow: 0.16em 0.54em 0.01em rgba(15, 15, 80, 0.8);
}
.album-letter.dual-label-6 {
    text-shadow: 0.14em 0.60em 0.01em rgba(20, 25, 86, 0.8);
}


.song-label {
    font-size: 17pt;
    font-weight: bolder;
}

.song-title {
    font-size: 17pt;
    font-weight: bolder;
    line-height: 1.1;
}

.song-artist {
    opacity: 75%;
    font-size: 14pt;
    font-weight: bolder;
}

.playlist-section-outer {
    /* border-top:  2px dashed rgba(0,0,0,0.22); */
    border-left:   .15em dashed rgba(255,255,255,0.32);
    border-right:    .15em dashed rgba(255,255,255,0.32);    
    /* border-bottom: 2px dashed rgba(0,0,0,0.22); */
    box-shadow: 0 0.05rem 2.5rem -0.5rem rgba(0,0,0,.22);
    border-radius: 2rem;
    padding: 0;
    border-collapse: collapse;
}
.playlist-section {
    margin: 0;
    border-collapse: collapse;
    padding: 0.5em 0 0.5em 0.5em;
    border-radius: 2rem; 
    position: relative;
    
    box-shadow: inset 0 .1rem 1.5rem 0.3rem rgba(0,0,0,0.5);
    background-size: 100% auto;
    background-repeat: no-repeat;
    background-attachment: fixed;
    background-size: cover;
    background-position-x: center;
    background-position-y: 80%;
    background-attachment: fixed; 
    background-image: url('/assets/art/stochast/cover-art-stochastic-recovery-20x6-album.jpg');    
}
.stick-top-right, .stick-top-left {
    position: absolute;
    padding: 0;
    font-size: 12pt;
    display: inline-block;
}
.stick-top-right {
    top: 1.3em;
    right: 1.3em;
}
.stick-top-right.from-padded {
    top: 0.3em;
    right: 0.3em;
}
.stick-top-left {
    top: 1.3em;
    left: 1.3em;
}
.stick-top-left.from-padded {
    top: 0.3em;
    left: 0.3em;
}
.playlist-controls {
    font-weight: 12pt;
}

.playlist-section .song-list.collapsed {
    height: 0;
    max-height: 0;
    overflow-y: hidden;
    
}

.playlist-section .song-list {
    /* limit vertical height with scroll */
    height: 19.3em;
    max-height: 19.3em;
    overflow-x: hidden;
    overflow-y: auto;
    padding: 5px 5px 0 5px;


    transition-property: height, max-height;
    transition-duration: 1s;
    transition-timing-function: ease;

}

.playlist-section .song-list::-webkit-scrollbar {
    height: 12px;
    width: 12px;
    background: rgba(20, 50, 80, 0.233);
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
    border-right-width: 0;
    border-left-width: 0;
    border-top:    .15em dashed rgba(240,240,255,0.7);
    border-bottom: .15em dashed rgba(240,240,255,0.7);
    border-collapse: collapse;
    box-shadow: inset 0 0 3em -1em rgba(59, 127, 187, 0.75);
    background: rgba(100, 156, 200, 0.25);
    border-radius: 0.75em;
}

.shadow {
    text-shadow: -0.05em 0.075em 0.5em rgba(133, 3, 3, 0.767);
}

.playlist-title {
    font-size: 12pt;
    padding: 0 1em 0 1em;
    opacity: 0.8;
}

.box-shadow {
    background: rgba(60,90,130,0.2);
    border-radius: 0.5em;
    box-shadow: 0 0 .3em .3em rgba(60,90,130,0.2);
}


.icon-cont-shadow {
    background: rgba(60,90,130,0.3);
    border-radius: 0.5em;
    box-shadow: 0 0 .3em .3em rgba(60,90,130,0.3);
}

.shuffle-icon {
  /* Set dimensions */
  width: .8em;
  height: .8em;
  display: inline-block; 
  vertical-align:-0.3vh;
  
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

.playlist-controls {
    font-size: 12pt;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.bg-controls {
    font-size: 9pt;
}

</style>