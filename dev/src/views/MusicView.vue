<script setup>
import { ref } from 'vue'
import { RouterLink, RouterView } from 'vue-router'
import Song from '../components/Song.vue'
import VueAudioPlayer from '@liripeng/vue-audio-player'
</script>

<script>
export default {
  data() {
    return {
        // State        
        currentSongTitle: '',
        currentSongArtist: '',
        currentSongAlbum: 'Assorted Eggmunkee Songs',
        // Configuration
        songList: [

            {
                title: 'There we all go',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/There we all go.mp3'
            },

            {
                title: 'Good Afternoon, X',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Good Afternoon X.mp3'
            },


            {
                title: 'Radicalized',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Radicalized.mp3'
            },

            {
                title: 'Everything It Captures',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Everything It Captures.mp3'
            },
            
            {
                title: 'Bankers Know Best (Not Equal Cover)',
                artist: 'eggmunkee',
                album: 'Assorted Suno Covers',
                src: '/mp3/Bankers Know Best (Not Equal Cover).mp3'
            },
            
            {
                title: 'Fractured Armies',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Fractured Armies.mp3'
            },
            
            {
                title: 'Lost Cause Caravan',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Lost Cause Caravan.mp3'
            },

            {
                title: 'Hometown Streets',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Hometown Streets.mp3'
            },

            {
                title: 'Alright For Now (The Anniversary Cover)',
                artist: 'eggmunkee',
                album: 'Assorted Suno Covers',
                src: '/mp3/Alright For Now (The Anniversary Cover).mp3'
            },

            {
                title: 'Lemons',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Lemons.mp3'
            },

            {
                title: 'This must be a Test',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/This must be a Test.mp3'
            },
            
            {
                title: 'All I Got',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/All I Got.mp3'
            },

            {
                title: 'Dust on the rug',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Dust on the rug.mp3'
            },

            {
                title: 'Oddest Of Us',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Oddest Of Us.mp3'
            },

            {
                title: 'And then I found Home (In you)',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/And then I found Home (In you).mp3'
            },

            {
                title: 'Little More Coming Home (Acoustic)',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Little More Coming Home (Acoustic).mp3'
            },

            {
                title: 'Black Blizzard, Red Umbrella (The Octopus Project Cover)',
                artist: 'eggmunkee',
                album: 'Assorted Suno Covers',
                src: '/mp3/Black Blizzard, Red Umbrella (The Octopus Project Cover).mp3'
            },

            {
                title: 'Skasynthic Covahed',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Skasynthic Covahed.mp3'
            },

            {
                title: 'Ska Stroll 12-30',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Ska Stroll 12-30.mp3'
            },

            {
                title: 'Skatellite Chronos 7A',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Skatellite Chronos 7A.mp3'
            },

            {
                title: 'Skatellite Chronos 7i',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Skatellite Chronos 7i.mp3'
            },

            {
                title: 'Skatellite Chronos 7M',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Skatellite Chronos 7M.mp3'
            },

            {
                title: 'Buckaroo Live Show ’84 (Buckaroo Banzai Theme Cover)',
                artist: 'eggmunkee',
                album: 'Assorted Suno Covers',
                src: '/mp3/Buckaroo Live Show ’84 (Buckaroo Banzai Theme Cover).mp3'
            },

            {
                title: 'I Walk My Dog Buddy at Night',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/I Walk My Dog Buddy at Night.mp3'
            },

            {
                title: 'Dormant Chroma Delta III',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Dormant Chroma Delta III.mp3'
            },

            {
                title: 'old school rap beat, sampling 93',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/old school rap beat, sampling 93.mp3'
            },

            {
                title: 'Untitled - classical guitar jam C1',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Untitled - classical guitar jam C1.mp3'
            },

            {
                title: 'shoegaze classical 3a',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/shoegaze classical 3a.mp3'
            },

            {
                title: 'Shoegaze Synthwave 2 mk I',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Shoegaze Synthwave 2 mk I.mp3'
            },

            {
                title: 'Ska Dormant Rock v2 #NoCredMix',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/ska_dormant_rock_v2_E4R__NoCredMix_E8_RE2.mp3'
            },
            
            {
                title: 'Indied Down B',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/Indied Down B.mp3'
            },

            {
                title: 'Sand Dollar Algorithms (311-Muse mashup)',
                artist: 'eggmunkee',
                album: 'Assorted Remixes',
                src: '/mp3/SandDollarAlgorithms_311_Muse_wip.mp3'
            },

            {
                title: 'Hold On (Wilson Phillips Cover)',
                artist: 'eggmunkee',
                album: 'Assorted Suno Covers',
                src: '/mp3/Hold On (Wilson Phillips Cover).mp3'
            },

            /* Song Data Template: 
            {
                title: '',
                artist: 'eggmunkee',
                album: 'Assorted Suno Rock',
                src: '/mp3/.mp3'
            },
            */
        ]
    }
  },
  methods: {
    playNext(next) {
        try {
            let songIdx = this.$refs['audioPlayer'].currentPlayIndex;
            let song = this.songList[songIdx];
            this.currentSongTitle = song.title || ' ';
            this.currentSongArtist = song.artist || ' ';
            this.currentSongAlbum = song.album || ' ';
        } catch (e) {
            this.currentSongTitle = 'Unknown';
            this.currentSongArtist = ' ';
            this.currentSongAlbum = ' ';
        }

        next() // Start play
    },
    shuffleTracks() {
        let songs = this.songList;
        for (let i = songs.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [songs[i], songs[j]] = [songs[j], songs[i]];
        }
    }
  }
}
</script>

<template>
<div class="root-div">
    <h1 class="under">EGGMUNKEE MUSIC</h1>
    <div style="border: 2px solid #e6e6e6; border-radius: 2rem; padding: 15px; margin-bottom: 2rem;" >
        <vue-audio-player ref="audioPlayer"
            :audio-list="songList"
            theme-color="hsl(208, 75%, 59%)"
            :before-play="playNext"
            :progress-interval="500"
        ></vue-audio-player>
        <div class="song-label">
            <div class="song-title">{{currentSongTitle}}</div>
            <div class="song-artist">
                <span v-show="currentSongArtist">by {{currentSongArtist}}</span> <span v-show="currentSongAlbum">[{{currentSongAlbum}}]</span>
            </div>
        </div>
    </div>
    
    <h2>
        Songs ({{songList.length}})
        <label class="small-label"><a href="#" @click.prevent="shuffleTracks">Shuffle</a></label>
    </h2>
    <div>
        
    </div>
    <div v-for="song in songList">
        <Song :url="song.src" :title="song.title" :album="song.album" />
    </div>
</div>
</template>

<style scoped>
.under {
    text-decoration: underline;
}
.small-label {
    font-size: 85%;
}
.root-div {
    margin: 20px;
    text-align: center;
    font-size: 12pt;
    font-family: 'Georgia' 'Comic Sans' 'Serif' serif;
}
.song-label {
    color: hsl(208, 75%, 59%);
    font-weight: bold;
}
.song-title {
    font-weight: bold;
}
.song-artist {
    opacity: 75%;
    font-weight: bold;
}
</style>