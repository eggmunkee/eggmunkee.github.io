export default {
    methods: {
        clearPlaylist() {
            this.songList = [];
        },
        shuffleTracks() {
            let songs = this.songList;
            for (let i = songs.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [songs[i], songs[j]] = [songs[j], songs[i]];
            }
            this.songList = songs;
        },
        unshuffleTracks(set) {
            console.log("Unshuffle", set);
            this.songList = [];
            if (set == 'stochast')
                this.addStochast();
            else if (set == 'earlier')
                this.addEarlier();
            else if (set == 'stash')
                this.addStash();
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
                song.title.toLowerCase().indexOf("disruptive") != -1 ||
                song.title.toLowerCase().indexOf("archetypic") != -1
            ) {
                return !reverse;
            }
            return reverse;
        },
        filterMegagongTracks(current) {
            let songs = [];
            let source = !current ? this.stochastSongList : this.songList;
            for (let i = 0; i < source.length; i++) {
                if (
                    this.filterSongMegagong(source[i], false)
                ) {
                    songs.push(source[i]);
                }
            }
            this.songList = songs;
        },
        filterNonMegagongTracks(current) {
            let songs = [];
            let source = !current ? this.stochastSongList : this.songList;
            for (let i = 0; i < source.length; i++) {
                if (
                    this.filterSongMegagong(source[i], true)
                ) {
                    songs.push(source[i]);
                }
            }
            this.songList = songs;
        },
        getExisting() {
            let existing = {};
            for (let e = 0; e < this.songList.length; e++) {
                if (this.songList[e]) {
                    existing[this.songList[e].src] = this.songList[e];
                }
            }
            return existing;
        },
        addSourceList(sourceList) {
            let existing = this.getExisting();
            for (let i = 0; i < sourceList.length; i++) {
                if (sourceList[i].src && !(sourceList[i].src in existing))
                    this.songList.push(sourceList[i]);
            }
        },
        addStochast() {
            let sourceList = this.stochastSongList;
            this.addSourceList(sourceList);
        },
        addEarlier() {
            let sourceList = this.earlierSongList;
            this.addSourceList(sourceList);
        },
        addStash() {
            let sourceList = this.stashSongList;
            this.addSourceList(sourceList);
        },
        removeThisSong(songIndex) {
            if (songIndex >= 0 && songIndex < this.songList.length) {
                this.songList.splice(songIndex, 1);
            }
        }
    }
}