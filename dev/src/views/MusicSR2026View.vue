<script setup>
import EgPglayer from '../components/EgPglayer.vue'

import Song from '../components/Song.vue'
// Import the song list JSON file
import initialSongList from '../data/musicPlaylist_stochastic_recovery_20x6.json';
</script>

<template>
<div class="root-div">
    <div class="player-section-outer" :class="tintMode == TINT_NIGHT ? 'night-mode' : tintMode == TINT_MAX ? 'tint-max' : ''"
        :style="{borderLeft:styledBorderVal,borderRight:styledBorderVal}">
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
                        <template v-for="(info,index) in titleLetterStyles" :key="index">
                            <span :class="info.style">{{ info.letter }}</span>
                        </template>
                    </span>
                </div>
            </div>
            <eg-pglayer 
                :theme-color="playerThemeColor" 
                :selected-song="currentSong"
                :prev-restart-sec="3"
                :artwork="currentArtworkUrl"
                @play-click="playClick"
                @previous-click="prevClick"
                @next-click="nextClick"
                @status="updateSongStatus"
                @play-start="updateSongStatus"
                @play-pause="updateSongStatus"
                @play-ended="playEnded"
            ></eg-pglayer>
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
    
    <div class="playlist-section-outer" :class="tintMode == TINT_NIGHT ? 'night-mode' : tintMode == TINT_MAX ? 'tint-max' : ''"
        :style="{borderLeft:styledBorderVal,borderRight:styledBorderVal}">
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

            <h3 style="display:flex; flex-direction: row; justify-content: space-evenly; align-items: center; margin: 0 1em 0 0.5em">
                <span style="flex-basis: .5em; flex-grow:1"></span>
                <span class="icon-cont-shadow" >
                    <a href="#" class="small-label shadow order-icon" title="original song order" :class="songStyle(2, false)" :style="{backgroundColor: playerThemeColor}" @click.prevent="unshuffleTracks">
                    </a>
                </span>
                <span class="icon-cont-shadow" >
                    <a href="#" class="small-label shadow shuffle-icon" title="shuffle song order" :class="songStyle(5, false)" :style="{backgroundColor: playerThemeColor}" @click.prevent="shuffleTracks">
                    </a>
                </span>                
                <span class="box-shadow" style="flex-basis: 7em">
                    <span class="playlist-title medium-dual-label" :class="songStyle(3, false)" >Songs ({{songList.length}})</span>
                </span>
                <span class="icon-cont-shadow" title="megagong songs" @click.prevent="filterMegagongTracks">
                    <a id="megagong-filter" href="#" class="small-label shadow megagong-icon" :class="songStyle(4, false)" :style="{backgroundColor: playerThemeColor}">
                    </a>
                </span>
                <span class="icon-cont-shadow" title="non-megagong songs" @click.prevent="filterNonMegagongTracks">
                    <a href="#" class="small-label shadow anti-megagong-icon" :class="songStyle(1, false)" :style="{backgroundColor: playerThemeColor}">
                    </a>
                </span>
                <span style="flex-basis: .5em; flex-grow:1"></span>
            </h3>
            <div class="song-list" ref="songContainer" :class="playlistVisible ? '' : 'collapsed'">
                <div class="song-list-note">
                    released july 2026
                </div>
                <div v-for="(song, songIndex) in songList" :key="song.src" class="song-entry" :class="{'song-selected':songIndex==currentSongIndex}"
                    :style="{borderTop:songIndex==currentSongIndex?styledBorderVal:'',borderBottom:songIndex==currentSongIndex?styledBorderVal:''}">
                    <Song :url="song.src" :title="song.title" :title-class="songStyle(songIndex, true)" :muted="true" 
                    :show-player="false" :show-download="true" @title-dblclick="playThisSong(songIndex)" />
                </div>
            </div>            
        </div>
    </div>

    <div class="instructions-row centered-div" v-show="playlistVisible" :class="{'night-mode': tintMode == TINT_NIGHT, 'tint-max': tintMode == TINT_MAX}">
        <div class="instructions blue over-bg-shadow over-bg-area-shadow">
            double click song to play <span class="minor-slash">/</span> click <span class="download-icon blue-dimmed-bg">&nbsp;</span> to download
        </div>
    </div>

    <div class="controls-row" :class="{'alone':!playlistVisible, 'night-mode': tintMode == TINT_NIGHT, 'tint-max': tintMode == TINT_MAX}">
        <div class="bg-controls centered-div">
            <span class="blue-dimmed over-bg-shadow over-bg-area-shadow text-faint">backdrop &amp; tint</span>
        </div>
        <div class="bg-controls centered-div">
            <div class="over-bg-area-shadow-dark centered-div">
                <span class="bg-controls-label bg-controls-label-left">
                    <template v-if="!bgOn">
                        <span class="bg-controls-label-off">
                            off
                        </span>
                    </template>
                    <template v-else>
                        <span class="blue-dimmed bg-controls-label-bullet">
                            &bullet;
                        </span>
                    </template>
                    <span v-if="bgOn" class="bg-controls-guage-base-left">
                        &nbsp;
                    </span>
                    <span v-if="bgOn" class="white-dimmed bg-controls-guage-filled-left" 
                        :style="{'height': `${bgIndexProgress * 1.75}em` }">
                        &nbsp;
                    </span>
                    <span v-if="bgOn" class="bg-controls-guage-progress-left"
                        :style="{'top': `${((2.2 + 0.75) - (bgAdvanceProgress * 0.7))}em`, 'height': `${bgAdvanceProgress * 1.4}em` }">
                        &nbsp;
                    </span>
                </span>
                <span class="twist-cont set-b" @click="toggleBg" :class="bgOn ? 'on' : ''" @dblclick.stop.prevent="" title="toggle backdrop">
                    <span class="blue-dimmed twist-slash">_</span>
                    <span class="white-dimmed" style="cursor: pointer; position:absolute; left: 0.5em; "><em>b</em></span>
                    
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
                <span class="twist-cont set-a" @click="upgradeTint" :class="tintToggleStateStyle" title="toggle tint"
                    >
                    <span class="blue-dimmed twist-slash">_</span>
                    <span class="white-dimmed" style="cursor: pointer; position:absolute; left: 0.5em;"><em>t</em></span>
                </span>
                <span class="bg-controls-label bg-controls-label-right">
                    <template v-if="tintMode == TINT_MAX">
                        <span class="bg-ctrl-label-base bg-ctrl-label-max">
                            MAX
                        </span>
                    </template>
                    <template v-else-if="tintMode == TINT_LIGHT">
                        <span class="bg-ctrl-label-base bg-ctrl-label-light">
                            light
                        </span>
                    </template>
                    <template v-else-if="tintMode == TINT_NIGHT">
                        <span class="bg-ctrl-label-base bg-ctrl-label-night">
                            night
                        </span>
                    </template>
                    <template v-else-if="tintMode == TINT_OFF">
                        <span class="bg-controls-label-off label-right">
                            off
                        </span>
                    </template>
                    <template v-else>
                        <span style="" class="blue-dimmed bg-controls-label-bullet label-right">
                            &bullet;
                        </span>
                    </template>
                    <span v-if="tintMode != TINT_OFF" style="" class="bg-controls-guage-base-right">
                        &nbsp;
                    </span>
                    <span v-if="tintMode != TINT_OFF" class="white-dimmed bg-controls-guage-filled-right"
                        :style="{'height': `${tintIndexProgress * 1.7}em` }">
                        &nbsp;
                    </span>
                    <span v-if="tintMode != TINT_OFF" class="bg-controls-guage-progress-right"
                        :style="{'top': `${((2.2 + 0.75) - (tintAdvanceProgress * 0.7))}em`, 'height': `${tintAdvanceProgress * 1.4}em` }">
                        &nbsp;
                    </span>
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
const ALBUM_NAME = 'STOCHASTIC RECOVERY 20x6';
const ALBUM_ARTIST = 'eggmunkee';
const TINT_OFF = 0;
const TINT_ON = 1;
const TINT_MAX = 2;
const TINT_LIGHT = 3;
const TINT_NIGHT = 4;


export default {
  data() {
    return {
        // State
        animFr0: 0,
        animFrame: 0,
        titleAnimFrame: 0,
        titleAnimRateMult: 3,
        titleLetterAnimRateMult: 7,
        titleAnimSetPos: [14, 22, 24, 14],
        titleAnimSetFr: [0, 3, 1, 5],
        tintFrame: 0,
        maxFrames: 6,
        animInterval: -1,
        animStarted: false,
        currentSongIndex: 0,
        currentSongTitle: ALBUM_NAME,
        currentSongArtist: ALBUM_ARTIST,
        currentSongAlbum: ALBUM_NAME,
        currentSong: null,
        // Configuration
        songList: [],
        // play next state
        queueSongByIndex: false,
        nextSongIndex: 0,
        playerSongStatus: null,
        // visible toggles
        playerBgVisible: true,
        playlistVisible: true,
        // bg ui state
        currentBgIndex: 0,
        bgAnimFrame: 0,
        bgAnimIncrCount: 16,
        albumArtworkUrl: '/assets/art/stochast/cover-art-stochastic-recovery-20x6-album.jpg',
        bgImages: [
            '/assets/art/wavy-haze-verydark.jpg', // bg-dark-01 (and 05)
            '/assets/art/stochast/image-vAE8r.jpg',  // bg-dark-02
            '/assets/art/stochast/image-i4u5hxybtk7g0vob36fsviqnn.jpg', // bg-dark-03 (and 54)
            '/assets/art/stochast/cover-art-stochastic-recovery-20x6-album.jpg', // bg-dark-04
            '/assets/art/wavy-haze-verydark.jpg', // bg-dark-05
            '/assets/art/stochast/image-bg-cosmic-chasm-02.jpg', // bg-dark-06
            '/assets/art/stochast/image-bg-cosmic-chasm-03.jpg', // bg-dark-07
            '/assets/art/stochast/image-bg-cosmic-chasm-07.jpg', // bg-dark-08
            '/assets/art/stochast/image-bg-cosmic-chasm-01.jpg', // bg-dark-09
            '/assets/art/stochast/image-bg-cosmic-chasm-05.jpg', // bg-dark-10
            '/assets/art/stochast/image-bg-cosmic-chasm-08.jpg', // bg-dark-11
            '/assets/art/stochast/image-bg-cosmic-chasm-04.jpg', // bg-dark-12
            '/assets/art/stochast/image-e1ovn41unr5c5pal3410r6cif.jpg', // bg-dark-13 (lava set)
            '/assets/art/stochast/image-j900r29yhc9aac5yut1uui03o.jpg', // bg-dark-14
            '/assets/art/stochast/image-3ijp4d9f0ia96j5rjjeaspmu6.jpg', // bg-dark-15 (and 22)
            '/assets/art/stochast/image-nxqzngt7aqw0ngy8ry7lzqjzy.jpg', // bg-dark-16
            '/assets/art/stochast/image-0jbxjc5nzrh0rfxrisy1fvhch.jpg',// bg-dark-17
            '/assets/art/stochast/image-q8hmm6uzr0ll10wshv3jtlycg.jpg',// bg-dark-18
            '/assets/art/stochast/image-akjl93i1i8foz2pkyoipkvu3s.jpg',// bg-dark-19
            '/assets/art/stochast/image-jvtzt5hubnfc3ua1ejt12mh7k.jpg', // bg-dark-20
            '/assets/art/stochast/image-tvy6t9gmbe03lwah2p51vj8ip.jpg',// bg-dark-21
            '/assets/art/stochast/image-3ijp4d9f0ia96j5rjjeaspmu6.jpg', // bg-dark-22 (Duplicate URL, but keeping index integrity)
            '/assets/art/stochast/image-n8qq0pv8k08vem880s5y5hd59.jpg',// bg-dark-23 (and 24)
            '/assets/art/stochast/image-n8qq0pv8k08vem880s5y5hd59.jpg', // bg-dark-24
            '/assets/art/stochast/image-jj5cnzozc5j1aasrr5iwf8sfs.jpg',// bg-dark-25 (round chasm)
            '/assets/art/stochast/image-u65yjrw2hqp1wrwjwlb9p4d3i.jpg', // bg-dark-26
            '/assets/art/stochast/image-guzjs8h3e95tgjga2xmkz8swr.jpg',// bg-dark-27
            '/assets/art/stochast/image-0qvp9do65gnxjnd1966tndc74.jpg',// bg-dark-28
            '/assets/art/stochast/image-4nxe77jlryt86s2gwcrtrq4s7.jpg',// bg-dark-29
            '/assets/art/stochast/image-a9n0o5dlqlqd4rc8478xwjpgw.jpg',// bg-dark-30 (crystals)
            '/assets/art/stochast/image-s9haeucixywznzdrpnll0usoy.jpg', // bg-dark-31
            '/assets/art/stochast/image-df0voxaf6st0rh8uhjqzrakcp.jpg',// bg-dark-32
            '/assets/art/stochast/image-5je899tihhk2tz10kfuvsrsaa.jpg', // bg-dark-33
            '/assets/art/stochast/image-bz4tlm1dgtr6yeo8o0bt9rafo.jpg',// bg-dark-34 (icy crystals)
            '/assets/art/stochast/image-doeki8a4cy1n65ul2spvu6s4u.jpg', // bg-dark-35
            '/assets/art/stochast/image-1oxuqyamn6ai78phmz1je5she.jpg',// bg-dark-36
            '/assets/art/stochast/image-g3kbilr4jxajspbhx2y1ienhg.jpg',// bg-dark-37
            '/assets/art/stochast/image-ff2zdw93bls8bhun5752ksm4p.jpg',// bg-dark-38 (barren)
            '/assets/art/stochast/image-s3ku9uavbjasuhvnlska1w6a1.jpg',// bg-dark-39
            '/assets/art/stochast/image-lu1fekpob8xv1o776kghfwaq4.jpg',// bg-dark-40
            '/assets/art/stochast/image-rj2i3twvfk5z1017aabqpd4ja.jpg',// bg-dark-41
            '/assets/art/stochast/image-4q4rkz8ugb6rq24uxlhflysls.jpg',// bg-dark-42
            '/assets/art/stochast/image-cgz3lwrfddhdc7hziyeymduxm.jpg',// bg-dark-43
            '/assets/art/stochast/image-h33p566qlz4chisc5jtdudkmo.jpg',// bg-dark-44
            '/assets/art/stochast/image-ve675eyt7rgsv5lo24xl57hyk.jpg',// bg-dark-45 (pillar witness)
            '/assets/art/stochast/image-vmsihc7bgq23c4gxwz83lc2nn.jpg',// bg-dark-46
            '/assets/art/stochast/image-elw8a7yne7n8nmf9yvu49kmv1.jpg', // bg-dark-47 (energy astroids)
            '/assets/art/stochast/image-trwi89muff1j4k0fso08tg4sp.jpg',// bg-dark-48 (sound waves forms)
            '/assets/art/stochast/image-r2aljv4yp0lrvqhcihs8ui3vv.jpg', // bg-dark-49 (pillars)
            '/assets/art/stochast/image-t6v4he54c90cu8uonjccs8a8f.jpg', // bg-dark-50
            '/assets/art/stochast/image-jP1Z1.jpg',// bg-dark-51
            '/assets/art/stochast/image-x40gN.jpg',// bg-dark-52
            '/assets/art/stochast/image-txqlyrhb7u6skn1bjp1707s2v.jpg', // bg-dark-53
            '/assets/art/stochast/image-i4u5hxybtk7g0vob36fsviqnn.jpg'  // bg-dark-54 (Duplicate URL)
        ],
        bgLayerToggle: 1, // 1 is layer 1, 2 is layer 2 last updated
        bgColorIdx: 0,
        bgColors: [
            'rgba(0,0,0,.32)', 
            'rgba(90,30,21,.34)', 
            'rgba(180,10,5,.36)', 
            'rgba(255,70,30,.36)', 
            'rgba(90,120,180,.41)', 
            'rgba(150,30,220,.47', 
            'rgba(0,70,122,.55)', 
            'rgba(0,170,60,.52)', 
            'rgba(0,0,0,.48)', 
            'rgba(30,30,90,.48)', 
            'rgba(0,60,120,.43)', 
            'rgba(50,30,220,.4)', 
            'rgba(190,170,240,.35)',
            'rgba(255,255,255,.3)',
            'rgba(255,255,30,.32)', 
            'rgba(210,180,0,.33)', 
            'rgba(120,70,0,.35)', 
            'rgba(60,10,10,.36)', 
            'rgba(0,120,255,.38)', 
            'rgba(0,220,120,.4)', 
            'rgba(0,255,0,.37)', 
            'rgba(255,60,0,.34)', 
            'rgba(220,255,0,.31', 
            'rgba(190,255,255,.27)',
            'rgba(125,255,255,.29)'
        ],
        bgColorsNight: [
            'rgba(0,0,0,.7)', 
            'rgba(15,5,0,.69)', 
            'rgba(25,10,0,.67)', 
            'rgba(45,5,0,.69)', 
            'rgba(56,15,5,.7)', 
            'rgba(30,15,5,.66)', 
            'rgba(15,25,5,.64)',
            'rgba(25,15,5,.63)',  
            'rgba(0,0,0,.62)', 
            'rgba(20,0,10,.64)', 
            'rgba(20,20,5,.65)', 
            'rgba(10,25,10,.67)', 
            'rgba(4,30,25,.68)',
            'rgba(5,15,20,.69)',
            'rgba(5,10,10,.7)',
        ],
        bgAnimEnabled: false,
        bgAnimEnFr: false,
        bgOn: true,
        tintMode: TINT_ON,
        minusClicked: true,
        plusClicked: true,
        timeLeftClicked: -1,
        timeRightClicked: -1,
        bodyRefs: {
            appDiv:null, overlay1: null, overlay2: null, overlay3: null
        },
        songStyles: [],
        titleLetterStyles: []
    }
  },
  mounted() {
    this.animInterval = setTimeout(this.startAnim, 3000);
    try {
        this.bodyRefs.appDiv = document.getElementById('app');
        this.bodyRefs.overlay1 = document.getElementsByClassName('overlay-z1')[0];
        this.bodyRefs.overlay2 = document.getElementsByClassName('overlay-z2')[0];
        this.bodyRefs.overlay3 = document.getElementsByClassName('overlay-z3')[0];
        this.bodyRefs.overlay1.style.display = '';
        this.bodyRefs.overlay2.style.display = '';
        this.bodyRefs.overlay3.style.display = '';

        // read night mode from app
        if (this.bodyRefs.appDiv.classList.contains('night-mode')) {
            this.tintMode = TINT_NIGHT;
        }

        // read overlay 1 and 2 bg frame state to pick up if present
        // const overlay1Frm = this.getFrameFromElem(this.bodyRefs.overlay1);
        // const overlay2Frm = this.getFrameFromElem(this.bodyRefs.overlay2);
        //const overlay2Transp = this.bodyRefs.overlay2.classList.contains('bg-transp');

        let existingFrameIndex = 0; // default to first frame - 0
        // if (overlay2Frm != -1 && !overlay2Transp) {
        //     existingFrameIndex = overlay2Frm;
        // }
        // else if (overlay1Frm != -1) {
        //     existingFrameIndex = overlay1Frm;
        // }
        // set model bg index
        this.currentBgIndex = existingFrameIndex;
        //let initialLayer1Bg = this.getBgCls(this.currentBgIndex);
        this.removeBgClasses(this.bodyRefs.overlay1);
        // let cl = this.bodyRefs.overlay1.classList;
        // cl.add('bg-base');
        // cl.add(initialLayer1Bg);
        this.setupBgClasses(this.bodyRefs.overlay1, this.currentBgIndex);
        
        let cl = this.bodyRefs.overlay2.classList;
        this.removeBgClasses(this.bodyRefs.overlay2);
        cl.add('bg-base');
        cl.add('bg-transp');
        this.recalcTitleLetterStyles();

        this.unshuffleTracks();
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
    this.bodyRefs.overlay1 = null;
    this.bodyRefs.overlay2 = null;
    this.bodyRefs.overlay3 = null;

  },
  methods: {
    startAnim() {
        this.animInterval = setInterval(this.incrementAnim, 4000);
        this.animStarted = true;
        this.bgAnimEnabled = true;
        if (this.tintMode == TINT_OFF) {
            this.tintMode = TINT_ON;
        }
        this.clearBgClicked();
        this.renderTintMode();
    },
    incrementAnim() {
        if (!this.playerSongStatus || !this.playerSongStatus.playing) return;

        // General text style anim
        this.animFr0 += 1;
        let animFrameChange = false;
        if (this.animFr0 >= 3) {
            this.animFrame += 1;
            this.animFr0 = 0;
            if (this.animFrame >= this.maxFrames) {
                this.animFrame = 0;
            }
            animFrameChange = true;
        }
        // Title anim
        const titleAnimFrameChange = true;
        this.titleAnimFrame += 1;
        if (this.titleAnimFrame >= this.maxFrames * this.titleAnimRateMult) {
            this.titleAnimFrame = 0;
        }
        // Roving title char anim
        const currTitleLength = this.currentSongAlbum.length;
        function capPos(p) {
            if (p < 0) {
                // wrap delta around to end
                p += currTitleLength;
            }
            else if (p >= currTitleLength) {
                // wrap dealt around to beginning
                p -= currTitleLength;
            }
            return p;
        }
        for (let ts = 0; ts < this.titleAnimSetFr.length; ts++) {
            this.titleAnimSetFr[ts] += 1;
            let currPos = this.titleAnimSetPos[ts];
            currPos = capPos(currPos);
            let posDelta = (1 + Math.floor(ts / 2.0)) * ((ts % 2 == 0) ? 1 : -1);
            if (this.titleAnimSetFr[ts] >= this.titleLetterAnimRateMult) {
                this.titleAnimSetFr[ts] = 0;
                currPos += posDelta;
            
                currPos = capPos(currPos);
                if (currPos < 0 || currPos >= currTitleLength) {
                    currPos = -1;
                }
                this.titleAnimSetPos[ts] = currPos;
            }
        }
        // Did album title change?
        if (this.titleLetterStyles.length != this.currentSongTitle.length || titleAnimFrameChange) {
            this.recalcTitleLetterStyles();
        }
        // Backdrop anim
        if (this.bgAnimEnabled) {
            this.bgAnimFrame += 1;
            if (this.bgAnimFrame >= this.bgAnimIncrCount) {
                this.bgAnimFrame = 0;
                this.incrementBgAnim();
            }
        }
        // Tint Anim
        if (this.tintMode != TINT_OFF) {
            this.tintFrame += 1;
            if ((this.tintMode == TINT_MAX && this.tintFrame >= 2)
                || (this.tintMode == TINT_LIGHT && this.tintFrame >= 7)
                || ((this.tintMode == TINT_ON || this.tintMode == TINT_NIGHT) && this.tintFrame >= 4)) {
                this.tintFrame = 0;
                this.updateColorTint();
            }
        }
    },
    recalcTitleLetterStyles() {
        let albumLetters = this.albumNameChopped(this.currentSongAlbum);
        let letterStyles = [];
        for (let l=0; l < albumLetters.length; l++) {
            let albumLetter = albumLetters[l];
            let albumStyleCalc = this.albumLetterStyled(albumLetter, l);
            let letterStyle = this.albumLetterStyle(albumStyleCalc.animMatchCt, l, albumStyleCalc.mutlTitleAnimFrame, albumStyleCalc.mutedLetter);
            letterStyles.push({
                letter: albumLetter,
                style: letterStyle
            });
        }
        this.titleLetterStyles = letterStyles;
    },
    albumNameChopped(albumName) {
        let letters = [];
        for (let i=0; i< albumName.length; i++) {
            letters.push(albumName[i]);
        }
        return letters;
    },
    albumLetterStyled(albumLetter, index) {
        if (albumLetter == ' ') return '';
        let mutlTitleAnimFrame = Math.round(1.0 * this.titleAnimFrame / this.titleAnimRateMult);
        let animMatchCt = 0;
        for (let p=0; p < this.titleAnimSetPos.length; p++) {
            if (index == this.titleAnimSetPos[p])
                animMatchCt += 1;
        }
        let mutedLetter = albumLetter == 'x';
        return {
            mutlTitleAnimFrame,
            animMatchCt,
            mutedLetter
        };
    },
    albumLetterStyle(animMatchCt, index, mutlTitleAnimFrame, mutedLetter) {
        let animSetMatch = animMatchCt % 2 == 1;
        let revIndex = this.maxFrames - (index % this.maxFrames);
        let choice = (revIndex + mutlTitleAnimFrame) % this.maxFrames;
        let albumClasses = `album-letter dual-label-${choice+1}` 
            + (animSetMatch ? ' alt' : '');
            + (mutedLetter ? ' muted-letter' : '');
        return albumClasses;
    },
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
        if (this.currentBgIndex >= this.bgImages.length - 1)
            this.currentBgIndex = 0;
        else if (reverse && this.currentBgIndex < 0)
            this.currentBgIndex = this.bgImages.length - 1;
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
        //let nextClsName = this.getBgCls(idx);
        this.removeBgClasses(elem);
        elem.classList.add('bg-base');
        //elem.classList.add(nextClsName);
        elem.style.backgroundImage = `url(${this.bgImages[idx]})`;
    },
    removeBgSlowFade() {
        // const overlay2 = document.getElementsByClassName('overlay-z2')[0];
        let o2cl = this.bodyRefs.overlay2.classList;
        if (o2cl.contains('bg-transp')) {
            o2cl.remove('bg-transp');
            o2cl.add('bg-fast-transition');
        }
    },
    incrementBgAnim(reverse, forceTransition) {
        // get two overlay layers
        // const overlay1 = document.getElementsByClassName('overlay-z1')[0];
        // const overlay2 = document.getElementsByClassName('overlay-z2')[0];
        
        this.incrBgIndex(reverse || false);

        this.bgAnimEnFr = !this.bgAnimEnFr;

        if (forceTransition) {
            this.bgLayerToggle = 1;
            // this.removeBgClasses(this.bodyRefs.overlay1);
            // this.removeBgClasses(this.bodyRefs.overlay2);
        }

        // go from fading to changing images
        if (this.bgLayerToggle == 2) {
            this.bgLayerToggle = 1;
            // Set Fade out class anim on 2nd level Overlay
            this.bodyRefs.overlay2.classList.add('bg-transp');
            // clear and rebuild bg styles
            this.setupBgClasses(this.bodyRefs.overlay1, this.currentBgIndex);
        }
        // step into fading
        else {
            this.bgLayerToggle = 2;
            // clear and rebuild bg styles - clears transparant anim class also
            this.setupBgClasses(this.bodyRefs.overlay2, this.currentBgIndex);
        }
        
        if (forceTransition) {
            this.removeBgSlowFade();
        }
    },
    updateColorTint() {
        let colorSet = this.tintMode != TINT_NIGHT ? this.bgColors : this.bgColorsNight;
        if (!colorSet) return;
        if (this.bgColorIdx >= colorSet.length)
            this.bgColorIdx = this.bgColorIdx % colorSet.length;
        let color = colorSet[this.bgColorIdx];
        this.bgColorIdx += 1;
        if (this.bgColorIdx >= colorSet.length)
            this.bgColorIdx = 0;
        
        this.$nextTick(function() {
            this.bodyRefs.overlay3.style.backgroundColor = color;
        });
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
    filterSongMegagong(song, reverse) {
        if (
            song.title.toLowerCase().indexOf("megagong") != -1 ||
            song.title.toLowerCase().indexOf("static") != -1 ||
            song.title.toLowerCase().indexOf("synthwave") != -1 ||
            song.title.toLowerCase().indexOf("haze") != -1 ||
            song.title.toLowerCase().indexOf("rewound") != -1 ||
            song.title.toLowerCase().indexOf("echo") != -1 ||
            song.title.toLowerCase().indexOf("calculation") != -1 ||
            song.title.toLowerCase().indexOf("repixelated") != -1 ||
            song.title.toLowerCase().indexOf("rewind") != -1 ||
            song.title.toLowerCase().indexOf("disruptive") != -1
        ) {
            return !reverse;
        }
        return reverse;
    },
    filterMegagongTracks() {
        let songs = [];
        for (let i = 0; i < initialSongList.length; i++) {
            if (
                this.filterSongMegagong(initialSongList[i], false)
            ) {
                songs.push(initialSongList[i]);
            }
        }
        this.songList = songs;
    },
    filterNonMegagongTracks() {
        let songs = [];
        for (let i = 0; i < initialSongList.length; i++) {
            if (
                this.filterSongMegagong(initialSongList[i], true)
            ) {
                songs.push(initialSongList[i]);
            }
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
        if (this.tintMode == TINT_ON) {
            this.tintMode = TINT_OFF;
            this.renderTintMode();
        }
        else {
            this.tintMode = TINT_ON;
            this.renderTintMode();
        }
    },
    renderTintMode() {
        try {
            let o3cl = this.bodyRefs.overlay3.classList;
            o3cl.remove('overlay-hidden');
            o3cl.remove('overlay-z3-12');
            o3cl.remove('overlay-z3-25');
            o3cl.remove('overlay-z3-35');
            o3cl.remove('overlay-z3-tint-max');
            o3cl.remove('overlay-night-mode');
            if (this.tintMode == TINT_OFF) {
                o3cl.add('overlay-hidden');
            }
            else if (this.tintMode == TINT_MAX) {
                o3cl.add('overlay-z3-tint-max');
            }
            else if (this.tintMode == TINT_LIGHT) {
                o3cl.add('overlay-z3-12');
            }
            else if (this.tintMode == TINT_NIGHT) {
                o3cl.add('overlay-z3-35')
                o3cl.add('overlay-night-mode');
            }
            else { // ON
                o3cl.add('overlay-z3-25');
            }
        }
        catch (e) {}
    },
    upgradeTint() {
        const currTintMode = this.tintMode;
        let needsColorUpdate = false;
        if (currTintMode == TINT_OFF) {
            this.tintMode = TINT_ON;
        }
        else if (currTintMode == TINT_ON) {
            this.tintMode = TINT_LIGHT;
        }
        else if (currTintMode == TINT_LIGHT) {
            this.tintMode = TINT_NIGHT;
            needsColorUpdate = true;
        }
        else if (currTintMode == TINT_NIGHT) {
            this.tintMode = TINT_MAX;
            needsColorUpdate = true;
        }
        else {
            this.tintMode = TINT_OFF;
        }
        this.renderTintMode();
        if (needsColorUpdate)
            this.updateColorTint();
    },
    toggleBg() {
        try {
            this.bgOn = !this.bgOn;
            if (this.bgOn) {
                this.bodyRefs.overlay1.style.display = '';
                this.bodyRefs.overlay2.style.display = '';
            }
            else {
                this.bodyRefs.overlay1.style.display = 'none';
                this.bodyRefs.overlay2.style.display = 'none';
            }
        }
        catch (e) {}
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
        if (this.currentSongIndex < this.songList.length - 1)
            this.nextClick();
    },
    prevClick() {
        //console.log("Previous");
        let currSongIndex = this.currentSongIndex - 1;
        if (currSongIndex < 0) {
            currSongIndex = this.songList.length - 1;
        }
        this.setSongIndex(currSongIndex);
        if (this.playlistVisible)
            this.scrollCurrentSongIntoView();
    },
    nextClick() {
        //console.log("Next");
        let currSongIndex = this.currentSongIndex + 1;
        if (currSongIndex >= this.songList.length) {
            currSongIndex = 0;
        }
        this.setSongIndex(currSongIndex);
        if (this.playlistVisible)
            this.scrollCurrentSongIntoView();
    },
    playClick() {
        this.setSongIndex(this.currentSongIndex);
        if (this.playlistVisible)
            this.scrollCurrentSongIntoView();
    },
    updateSongStatus(status) {
        this.playerSongStatus = status;
    }
  },
  computed: {
    currentArtworkUrl() {
        let baseUrl = this.albumArtworkUrl;
        // If backdrop is on and we have images configured and a valid index show it
        // (not negative, not zero so it starts on the album art not the hazy
        if (this.bgOn && this.bgImages.length > 0 && this.currentBgIndex >= 1) {
            let idx = this.currentBgIndex % this.bgImages.length;
            let bgSrc = this.bgImages[idx];
            return bgSrc;
        }
        return baseUrl;
    },
    bgAdvanceProgress() {
        if (!this.bgOn) return 0.0;
        let idx = Math.max(0, this.bgAnimFrame);
        if (this.bgAnimIncrCount <= 0) return 0.0;
        idx = Math.min(idx, this.bgAnimIncrCount - 1);
        return 1.0 * (this.bgAnimIncrCount - idx) / (this.bgAnimIncrCount);
    },
    tintAdvanceProgress() {
        const mode = this.tintMode;
        if (mode == TINT_OFF) return 0.0;
        let idx = Math.max(0, this.tintFrame);
        /*
        if ((this.tintMode == TINT_MAX && this.tintFrame >= 2)
                || (this.tintMode == TINT_LIGHT && this.tintFrame >= 7)
                || ((this.tintMode == TINT_ON || this.tintMode == TINT_NIGHT) && this.tintFrame >= 4)) {
                this.tintFrame = 0;
                this.updateColorTint();
            }
        */
        let frameCount = mode == TINT_MAX ? 2 : (mode == TINT_LIGHT ? 7 : 4);
        if (!frameCount) return 0.0;
        idx = Math.min(idx, frameCount - 1);
        return 1.0 * (frameCount - idx) / (frameCount);
    },
    tintToggleStateStyle() {
        if (this.tintMode == TINT_OFF) return '';
        if (this.tintMode == TINT_MAX) return 'on tint-max';
        if (this.tintMode == TINT_LIGHT) return 'on tint-light';
        if (this.tintMode == TINT_NIGHT) return 'on tint-night';
        return 'on';
    },
    bgIndexProgress() {
        const bgCount = this.bgImages.length;
        if (bgCount > 0) {
            let idx = Math.min(this.currentBgIndex, bgCount - 1);
            return 1.0 - ((idx) / (bgCount));
        }
        return 0.0;
    },
    tintIndexProgress() {
        const tintCount = this.tintMode != TINT_NIGHT ? this.bgColors.length : this.bgColorsNight.length;
        if (tintCount > 0) {
            let idx = Math.min(this.bgColorIdx, tintCount - 1);
            return 1.0 - ((idx) / (tintCount));
        }
        return 0.0;
    },
    inNightMode() {
        return this.tintMode == TINT_NIGHT;
    },
    playerThemeColor() {
        if (this.inNightMode) {
            return 'hsla(22, 96%, 75%, 100%)';
        }
        else {
            return 'hsla(208, 75%, 80%, 90%)';
        }
    },
    styledBorderVal() {
        if (this.inNightMode) {
            return '.15em dashed ' + this.playerThemeColor;
            //return '.15em dashed red';
        }
        else {
            return '.15em dashed ' + this.playerThemeColor;
        }
    }
  },
  watch: {
    inNightMode(modeOn) {
        try {
            let acl = this.bodyRefs.appDiv.classList;
            if (modeOn && !acl.contains('night-mode')) {
                acl.add('night-mode');
            }
            else if (!modeOn && acl.contains('night-mode')) {
                acl.remove('night-mode');
            }
        }
        catch(e) {}
    }
  }
}
</script>

<style>
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

.small-dual-label {
    font-size: 13pt;
    font-weight: bolder;
    transition-property: text-shadow, color;
    transition-duration: 3.5s;
    transition-timing-function: ease;
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
    transition-timing-function: ease;
    transition-delay: 0.5s;
}

.dual-label-1 {
    color: hsl(209, 75%, 84%);    
    text-shadow: -0.05em -0.17em 0.01em hsl(208, 35%, 8%);
}
.dual-label-2 {
    color: hsl(0, 71%, 94%);
    text-shadow: -0.1em 0.16em 0.01em hsl(208, 35%, 9%);
}
.dual-label-3 {
    color: hsl(47, 91%, 91%);    
    text-shadow: 0.15em 0.16em 0.01em hsl(208, 35%, 8%);
}
.dual-label-4 {
    color: hsl(120, 82%, 89%);    
    text-shadow: -0.15em 0.13em 0.01em hsl(208, 35%, 8%);
}
.dual-label-5 {
    color: hsl(296, 89%, 95%);
    text-shadow: -0.1em -0.15em 0.01em hsl(208, 35%, 7%);
}
.dual-label-6 {
    color: hsl(170, 70%, 86%);
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
    /* border-left:   .15em dashed rgba(255,255,255,0.32);
    border-right:    .15em dashed rgba(255,255,255,0.32); */
    box-shadow: 0 -0.05rem 2.5rem -0.5rem rgba(0,0,0,.22);
    border-radius: 2rem;
    transition: border-left 2s, border-right 2s;
}
.player-section-outer.tint-max {
    opacity: 0.75;
}
.player-section-outer.night-mode {
    opacity: 0.45;
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
    /* text-shadow: 0.15em 0.58em 0.01em rgba(31, 41, 116, 0.8); */
    font-weight: bolder;
    line-height: 1.1;
}

.album-name .album-letter {
    position: relative;
    top: 0;
    transition: top 15s ease, text-shadow 5s, color 5s;
    /* transition-property: text-shadow, color, position;
    transition-duration: 5s; */
}
.album-name .album-letter.muted-letter {
    opacity: 0.4;
    top: 0.15em;
}


.album-letter.dual-label-1 {
    text-shadow: 0.17em 0.60em 0.01em rgba(40, 101, 155, 0.8);
}
.album-letter.dual-label-1.alt {
    text-shadow: 0.17em 0.60em 0.01em hsla(209, 75%, 70%, 60%); 
}
.album-letter.dual-label-2 {
    text-shadow: 0.19em 0.58em 0.012em rgba(32, 80, 122, 0.75);
    transform:scaleX(-1);
}
.album-letter.dual-label-2.alt {
    text-shadow: 0.19em 0.58em 0.012em hsla(219, 91%, 84%, 60%);
}
.album-letter.dual-label-3 {
    text-shadow: 0.20em 0.55em 0.018em rgba(18, 54, 85, 0.75);
}
.album-letter.dual-label-3.alt {
    text-shadow: 0.20em 0.55em 0.018em hsla(33, 54%, 81%, 55%);
}
.album-letter.dual-label-4 {
    text-shadow: 0.19em 0.53em 0.04em rgba(10, 42, 70, 0.65);
    
}
.album-letter.dual-label-4.alt {
    text-shadow: 0.19em 0.53em 0.04em hsla(120, 63%, 79%, 55%);
}
.album-letter.dual-label-5 {
    text-shadow: 0.17em 0.55em 0.018em rgba(18, 54, 85, 0.75);
}
.album-letter.dual-label-5.alt {
    text-shadow: 0.17em 0.55em 0.018em hsla(296, 89%, 85%, 55%);
}
.album-letter.dual-label-6 {
    /*text-shadow: 0.13em 0.63em 0.01em rgba(31, 41, 116, 0.8);*/
    text-shadow: 0.16em 0.58em 0.012em rgba(32, 80, 122, 0.75);
}
.album-letter.dual-label-6.alt {
    text-shadow: 0.16em 0.58em 0.012em hsla(170, 70%, 75%, 60%);
}

.album-letter.dual-label-1.alt,
.album-letter.dual-label-6.alt {
    color: rgba(60, 163, 253, 0.9);
    top: -0.12em;
}
.album-letter.dual-label-2.alt,
.album-letter.dual-label-5.alt {
    color: rgba(50, 140, 219, 0.9);
    top: -0.08em;
}
.album-letter.dual-label-3.alt,
.album-letter.dual-label-4.alt {
    color: rgba(41, 121, 192, 0.9);
    top: 0.06em;
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
    /* border-left:   .15em dashed rgba(255,255,255,0.32);
    border-right:    .15em dashed rgba(255,255,255,0.32); */
    box-shadow: 0 0.05rem 2.5rem -0.5rem rgba(0,0,0,.22);
    border-radius: 2rem;
    padding: 0;
    border-collapse: collapse;
    transition: border-left 2s, border-right 2s;
}
.playlist-section-outer.tint-max {
    opacity: 0.75;
}
.playlist-section-outer.night-mode {
    opacity: 0.45;
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
    padding: 0 .5em 0 .5em;


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

.playlist-section .song-list .song-list-note {
    font-size: 9pt; 
    color: rgba(176, 212, 243, 0.75);
    text-shadow: 0.05em 0.1em 0.5em black;
    margin-top: 0;
    margin-bottom: 0.2em;
}
.playlist-section-outer.night-mode .song-list .song-list-note {
    color: hsla(22, 96%, 75%, 100%);
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
    /* border-top:    .15em dashed rgba(240,240,255,0.7);
    border-bottom: .15em dashed rgba(240,240,255,0.7); */
    border-collapse: collapse;
    box-shadow: inset 0 0 1em .5em rgba(59, 127, 187, 0.5);
    border-radius: 0.75em;
    transition: box-shadow 2s, border-top 2s, border-bottom 2s;
}

.playlist-section-outer.night-mode .song-selected {
    box-shadow: inset 0 0 1em .25em rgba(241, 177, 81, 0.5);
    /* background: rgba(185, 68, 0, 0.35); */
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
    background: rgba(60,90,130,0.4);
    border-radius: 0.5em;
    box-shadow: 0 0 .3em .3em rgba(60,90,130,0.4);
    margin-left: 0.25em;
    margin-right: 0.25em;
    padding-left: 0.25em;
    padding-right: 0.25em;
    flex-basis: 0.25em;
    line-height: 1.2;
    cursor: pointer;
}

.icon-cont-shadow:hover {
    background: rgba(60,90,130,0.8);
    box-shadow: 0 0 .3em .3em rgba(60,90,130,0.6);
}

.icon-cont-shadow > a {
    padding: 0 .5em;
    /* Set dimensions */
    width: .8em;
    height: .8em;
    display: inline-block; 
    vertical-align:-0.3vh;
    
    /* Set the desired color */
    background-color: hsl(208, 75%, 80%); 
    /* Ensure the mask covers the element */
    -webkit-mask-size: contain;
    mask-size: contain;
    -webkit-mask-repeat: no-repeat;
    mask-repeat: no-repeat;
    -webkit-mask-position: center;
    mask-position: center;
}

.shuffle-icon {
    

    /* Apply the image as a mask */
    -webkit-mask-image: url('/assets/icon-shuffle.png');
    mask-image: url('/assets/icon-shuffle.png');

    
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

.megagong-icon {
  /* Apply the image as a mask */
  -webkit-mask-image: url('/assets/icon-megagong.png');
  mask-image: url('/assets/icon-megagong.png');
  
}


.anti-megagong-icon {
  /* Apply the image as a mask */
  -webkit-mask-image: url('/assets/icon-anti-megagong.png');
  mask-image: url('/assets/icon-anti-megagong.png');
}

.order-icon {
  /* Apply the image as a mask */
  -webkit-mask-image: url('/assets/icon-order.png');
  mask-image: url('/assets/icon-order.png');
  
}

.playlist-controls {
    font-size: 12pt;
    display: flex;
    flex-direction: row;
    justify-content: center;
    align-items: center;
}

.instructions-row.night-mode {
    opacity: 70%;
}

.controls-row.night-mode {
    opacity: 70%;
}

span.blue-dimmed-bg {
    background-color: hsla(208, 75%, 59%,80%);
}

.night-mode span.blue-dimmed-bg {
    background-color: rgba(211, 83, 61, 0.75);
}
.bg-controls {
    font-size: 9pt;
}

.bg-controls-label {
    display: inline-block;
    width: 0;
    position: relative;
    font-size: 8pt;
    text-shadow: 0 0.05em 0.5em rgba(63, 0, 0, 0.7);
}
.bg-controls-label.bg-controls-label-left {
    
}
.bg-controls.label.bg-controls-label-right {
    
}

.bg-ctrl-label-base {
    position: absolute; left: .5em; top: 0.15em;
}
.bg-ctrl-label-max {
    color: #cc9410;
    font-weight: bolder;
}
.bg-ctrl-label-light {
    font-style: italic;
    color: #557799;
}
.bg-ctrl-label-night {
    color: #cb1400;
    text-shadow: 0 0.05em 0.5em rgba(255, 128, 0, 0.8);
}

.bg-controls-label-off {
    position: absolute;
    right: .35em;
    top: 0.15em;
    color:#181818;
    font-style: italic;
    text-shadow: 0 0.05em 0.5em rgba(255, 255, 255, 0.6);
}
.night-mode .bg-controls-label-off {
    text-shadow: 0 0.05em 0.5em rgba(255, 128, 0, 0.8);
}
.bg-controls-label-off.label-right {
    left: .5em;
}
.bg-controls-label-bullet {
    position: absolute;
    right: .35em;
    top: 0.15em;
}
.bg-controls-label-bullet.label-right {
    left: .35em;
}

.night-mode {

}

.night-mode .blue {
    color: rgba(231, 50, 44, 0.75);
}

.night-mode .blue-dimmed {
    color: rgba(211, 83, 61, 0.75);
}

.night-mode .white-dimmed {
    color: rgba(252, 141, 90, 0.75)
}

.bg-controls-guage-base-left {
    position:absolute; top: 2.05em; left: .75em; padding: 0.1em 0; width: .65em; 
    background: rgba(0,0,0,0.25);
    border-radius: .15em;
    height: 2em;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.night-mode .bg-controls-guage-base-left {
    background: rgba(0,0,0,0.35);
}
.bg-controls-guage-base-right {
    position:absolute; top: 2.05em; right: .75em; padding: 0.1em 0; width: .65em; 
    background: rgba(0,0,0,0.25); /* linear-gradient(to right, rgba(0,0,0,0.2), rgba(0,0,0,0.4), rgba(0,0,0,0.4), rgba(0,0,0,0.2));  */
    border-radius: .15em;
    height: 2em;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.night-mode .bg-controls-guage-base-right {
    background: rgba(0,0,0,0.35);
}

.bg-controls-guage-progress-left {
    position:absolute; top: 2.2em; left: 1.15em; width: .2em; 
    border-right: 0.15em solid rgba(255,255,255,0.35);
    transition: height 0.5s, top 0.5s;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.night-mode .bg-controls-guage-progress-left {
    border-right: 0.15em solid rgba(252, 141, 90, 0.65);
}
.bg-controls-guage-progress-right {
    position:absolute; top: 2.2em; right: 1.2em; width: .2em; 
    border-right: 0.15em solid rgba(255,255,255,0.35);
    transition: height 0.5s, top 0.5s;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.night-mode .bg-controls-guage-progress-right {
    border-right: 0.15em solid rgba(252, 141, 90, 0.65);
}

.bg-controls-guage-filled-left {
    position:absolute; left: .8em; top: 2.1em; width: .5em; 
    background: linear-gradient(to bottom, rgba(219, 172, 178, 0.2), 30%, rgba(89, 194, 255, 0.4), 95%, rgba(89, 194, 255, 0.65)); 
    border-radius: .15em;
    transition: height 1s;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.night-mode .bg-controls-guage-filled-left {
    background: linear-gradient(to bottom, rgba(63, 0, 8, 0.5), 30%, rgba(248, 182, 128, 0.5), 95%, rgba(248, 182, 128, 0.65));
}

.bg-controls-guage-filled-right {
    position:absolute; right: .8em; top: 2.1em; width: .5em; 
    background: linear-gradient(to bottom, rgba(219, 172, 178, 0.2), 30%, rgba(89, 194, 255, 0.4), 95%, rgba(89, 194, 255, 0.65)); 
    border-radius: .15em;
    transition: height 1s;
    user-select: none;
    -webkit-user-select: none;
    -moz-user-select: none;
    -ms-user-select: none;
}
.night-mode .bg-controls-label-right .bg-controls-guage-filled-right {
    background: linear-gradient(to bottom, rgba(63, 0, 8, 0.5), 30%, rgba(248, 182, 128, 0.5), 95%, rgba(248, 182, 128, 0.65));
}


</style>